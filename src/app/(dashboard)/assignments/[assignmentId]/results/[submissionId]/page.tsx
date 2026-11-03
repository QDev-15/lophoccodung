import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

function formatCorrectAnswer(question: { type: string; data: unknown }): string {
  const data = question.data as Record<string, unknown>;
  if (question.type === "MULTIPLE_CHOICE") {
    const options = data.options as { id: string; text: string }[];
    const correct = options.find((o) => o.id === data.correctOptionId);
    return correct?.text ?? "—";
  }
  if (question.type === "TRUE_FALSE") {
    return data.correctAnswer ? "Đúng" : "Sai";
  }
  if (question.type === "FILL_IN_BLANK") {
    return (data.acceptedAnswers as string[]).join(" / ");
  }
  return "—";
}

function formatResponse(question: { type: string }, response: unknown, options?: { id: string; text: string }[]): string {
  const r = (response ?? {}) as Record<string, unknown>;
  if (question.type === "MULTIPLE_CHOICE") {
    const selected = options?.find((o) => o.id === r.selectedOptionId);
    return selected?.text ?? "(không trả lời)";
  }
  if (question.type === "TRUE_FALSE") {
    if (r.value === undefined) return "(không trả lời)";
    return r.value ? "Đúng" : "Sai";
  }
  if (question.type === "FILL_IN_BLANK") {
    return typeof r.text === "string" && r.text ? r.text : "(không trả lời)";
  }
  return "—";
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ assignmentId: string; submissionId: string }>;
}) {
  const { assignmentId, submissionId } = await params;
  const teacher = await requireTeacher();

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, createdById: teacher.id! },
    select: { id: true, quiz: { select: { title: true } } },
  });
  if (!assignment) {
    notFound();
  }

  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, assignmentId },
    include: {
      answers: { include: { question: true }, orderBy: { question: { order: "asc" } } },
    },
  });
  if (!submission) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">{assignment.quiz.title}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {submission.studentDisplayName} — {submission.score}/{submission.maxScore} điểm
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {submission.answers.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border p-4 ${
              a.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            }`}
          >
            <p className="font-medium text-zinc-900">{a.question.prompt}</p>
            <p className="mt-1 text-sm text-zinc-700">
              Trả lời:{" "}
              {formatResponse(
                a.question,
                a.response,
                (a.question.data as { options?: { id: string; text: string }[] }).options,
              )}
            </p>
            {!a.isCorrect && (
              <p className="text-sm text-zinc-500">
                Đáp án đúng: {formatCorrectAnswer(a.question)}
              </p>
            )}
            <p className="mt-1 text-xs text-zinc-400">{a.pointsAwarded} điểm</p>
          </div>
        ))}
      </div>
    </div>
  );
}
