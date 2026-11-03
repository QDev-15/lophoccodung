import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

export default async function AssignmentResultsPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const teacher = await requireTeacher();

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, createdById: teacher.id! },
    include: {
      quiz: { select: { title: true } },
      class: { select: { name: true } },
      submissions: { orderBy: { submittedAt: "desc" } },
    },
  });

  if (!assignment) {
    notFound();
  }

  const shareUrl = `/take/${assignment.token}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">{assignment.quiz.title}</h1>
      <p className="mt-1 text-sm text-zinc-500">Lớp {assignment.class.name}</p>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
        <span className="text-zinc-500">Link cho học sinh:</span>
        <code className="text-sky-700">{shareUrl}</code>
      </div>

      <h2 className="mt-8 font-semibold text-zinc-900">
        Kết quả ({assignment.submissions.length} bài nộp)
      </h2>

      {assignment.submissions.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">Chưa có học sinh nào nộp bài.</p>
      ) : (
        <table className="mt-3 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-2">Học sinh</th>
              <th className="px-4 py-2">Điểm</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {assignment.submissions.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2">{s.studentDisplayName}</td>
                <td className="px-4 py-2">
                  {s.score != null ? `${s.score}/${s.maxScore}` : "—"}
                </td>
                <td className="px-4 py-2 text-zinc-500">
                  {s.status === "SUBMITTED"
                    ? "Đã nộp"
                    : s.status === "EXPIRED"
                      ? "Hết giờ"
                      : "Đang làm"}
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/assignments/${assignment.id}/results/${s.id}`}
                    className="text-sky-600 hover:underline"
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
