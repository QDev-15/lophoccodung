import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { gradeSubmission } from "@/lib/grading";

const GRACE_PERIOD_MS = 5_000;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  const submissionId = String(body.submissionId ?? "");
  const answers = (body.answers ?? {}) as Record<string, unknown>;

  const assignment = await prisma.assignment.findUnique({
    where: { token },
    include: { quiz: { include: { questions: true } } },
  });
  if (!assignment || !assignment.isActive) {
    return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
  }

  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, assignmentId: assignment.id },
  });
  if (!submission) {
    return NextResponse.json({ error: "Không tìm thấy bài làm" }, { status: 404 });
  }
  if (submission.status !== "IN_PROGRESS") {
    return NextResponse.json({ error: "Bài làm đã được nộp" }, { status: 409 });
  }

  const effectiveTimeLimitSeconds =
    assignment.timeLimitOverrideSeconds ?? assignment.quiz.timeLimitSeconds ?? null;

  if (effectiveTimeLimitSeconds != null) {
    const elapsedMs = Date.now() - submission.startedAt.getTime();
    if (elapsedMs > effectiveTimeLimitSeconds * 1000 + GRACE_PERIOD_MS) {
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Hết thời gian làm bài" }, { status: 400 });
    }
  }

  const { answers: graded, score, maxScore } = gradeSubmission(
    assignment.quiz.questions,
    answers,
  );

  await prisma.$transaction([
    prisma.answer.deleteMany({ where: { submissionId: submission.id } }),
    prisma.answer.createMany({
      data: graded.map((a) => ({
        submissionId: submission.id,
        questionId: a.questionId,
        response: (answers[a.questionId] ?? {}) as object,
        isCorrect: a.isCorrect,
        pointsAwarded: a.pointsAwarded,
      })),
    }),
    prisma.submission.update({
      where: { id: submission.id },
      data: { status: "SUBMITTED", submittedAt: new Date(), score, maxScore },
    }),
  ]);

  return NextResponse.json({
    score,
    maxScore,
    showResults: assignment.showResultsToStudent,
  });
}
