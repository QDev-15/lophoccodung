import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

export default async function AssignmentsPage() {
  const teacher = await requireTeacher();

  const assignments = await prisma.assignment.findMany({
    where: { createdById: teacher.id! },
    orderBy: { createdAt: "desc" },
    include: {
      quiz: { select: { title: true } },
      class: { select: { name: true } },
      _count: { select: { submissions: true } },
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">Bài đã giao</h1>

      {assignments.length === 0 ? (
        <p className="mt-8 text-zinc-500">Chưa có bài nào được giao.</p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {assignments.map((a) => (
            <li key={a.id}>
              <Link
                href={`/assignments/${a.id}/results`}
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-zinc-900">{a.quiz.title}</p>
                  <p className="text-sm text-zinc-500">Lớp {a.class.name}</p>
                </div>
                <span className="text-sm text-zinc-500">{a._count.submissions} bài nộp</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
