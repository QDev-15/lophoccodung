import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

export default async function QuizzesPage() {
  const teacher = await requireTeacher();
  const quizzes = await prisma.quiz.findMany({
    where: { teacherId: teacher.id! },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Đề kiểm tra</h1>
        <Link
          href="/quizzes/new"
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          + Tạo đề mới
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="mt-8 text-zinc-500">Bạn chưa có đề kiểm tra nào.</p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {quizzes.map((q) => (
            <li key={q.id}>
              <Link
                href={`/quizzes/${q.id}/edit`}
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-zinc-900">{q.title}</p>
                  {q.description && (
                    <p className="text-sm text-zinc-500">{q.description}</p>
                  )}
                </div>
                <span className="text-sm text-zinc-500">{q._count.questions} câu hỏi</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
