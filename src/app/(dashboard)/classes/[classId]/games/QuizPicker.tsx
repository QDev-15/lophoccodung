import Link from "next/link";

import { prisma } from "@/lib/prisma";

export async function QuizPicker({
  teacherId,
  basePath,
}: {
  teacherId: string;
  basePath: string;
}) {
  const quizzes = await prisma.quiz.findMany({
    where: { teacherId, questions: { some: {} } },
    include: { _count: { select: { questions: true } } },
    orderBy: { updatedAt: "desc" },
  });

  if (quizzes.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center">
        <p className="text-(--color-cocoa)/70">
          Bạn chưa có đề kiểm tra nào có câu hỏi. Hãy tạo một đề trước khi chơi game này.
        </p>
        <Link
          href="/quizzes/new"
          className="mt-4 inline-block rounded-full bg-(--color-honey) px-6 py-2.5 text-sm font-bold text-white hover:bg-(--color-honey-dark)"
        >
          Tạo đề kiểm tra
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-(--color-cocoa)/60">Chọn một đề kiểm tra để bắt đầu:</p>
      <ul className="mt-3 flex flex-col gap-2">
        {quizzes.map((q) => (
          <li key={q.id}>
            <Link
              href={`${basePath}?quizId=${q.id}`}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-3 transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)]"
            >
              <span className="font-bold text-(--color-cocoa)">{q.title}</span>
              <span className="text-sm text-(--color-cocoa)/50">{q._count.questions} câu hỏi</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
