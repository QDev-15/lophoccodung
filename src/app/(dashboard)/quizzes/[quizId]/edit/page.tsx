import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

import { QuizEditor, type InitialQuiz } from "../../QuizEditor";

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const teacher = await requireTeacher();

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, teacherId: teacher.id! },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) {
    notFound();
  }

  const initial: InitialQuiz = {
    title: quiz.title,
    description: quiz.description ?? "",
    timeLimitMinutes: quiz.timeLimitSeconds ? Math.round(quiz.timeLimitSeconds / 60) : null,
    shuffleQuestions: quiz.shuffleQuestions,
    questions: quiz.questions.map((q) => ({
      key: q.id,
      type: q.type,
      prompt: q.prompt,
      points: q.points,
      data: q.data as never,
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Sửa đề kiểm tra</h1>
        <Link
          href={`/quizzes/${quiz.id}/assign`}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Giao đề cho lớp
        </Link>
      </div>
      <div className="mt-6">
        <QuizEditor quizId={quiz.id} initial={initial} />
      </div>
    </div>
  );
}
