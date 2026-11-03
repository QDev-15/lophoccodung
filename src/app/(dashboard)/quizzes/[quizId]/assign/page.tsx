import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

import { createAssignment } from "./actions";

export default async function AssignQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const teacher = await requireTeacher();

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, teacherId: teacher.id! },
    select: { id: true, title: true },
  });
  if (!quiz) {
    notFound();
  }

  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id! },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">Giao đề: {quiz.title}</h1>

      {classes.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">
          Bạn cần tạo một lớp học trước khi giao đề.
        </p>
      ) : (
        <form action={createAssignment} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="quizId" value={quizId} />
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Lớp</span>
            <select
              name="classId"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">
              Ghi đè thời gian làm bài (phút, không bắt buộc)
            </span>
            <input
              type="number"
              name="timeLimitOverrideMinutes"
              min={1}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" name="showResultsToStudent" defaultChecked />
            Cho học sinh xem điểm sau khi nộp bài
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" name="allowMultipleSubmissions" />
            Cho phép làm lại nhiều lần
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Tạo link giao bài
          </button>
        </form>
      )}
    </div>
  );
}
