import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripAnswerKey } from "@/lib/grading";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { token },
    include: {
      quiz: { include: { questions: { orderBy: { order: "asc" } } } },
      class: { select: { name: true } },
    },
  });

  if (!assignment || !assignment.isActive) {
    return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
  }

  const now = new Date();
  if (assignment.opensAt && now < assignment.opensAt) {
    return NextResponse.json({ error: "Bài tập chưa mở" }, { status: 403 });
  }
  if (assignment.expiresAt && now > assignment.expiresAt) {
    return NextResponse.json({ error: "Bài tập đã kết thúc" }, { status: 403 });
  }

  const effectiveTimeLimitSeconds =
    assignment.timeLimitOverrideSeconds ?? assignment.quiz.timeLimitSeconds ?? null;

  return NextResponse.json({
    assignment: {
      id: assignment.id,
      className: assignment.class.name,
      timeLimitSeconds: effectiveTimeLimitSeconds,
      allowMultipleSubmissions: assignment.allowMultipleSubmissions,
    },
    quiz: {
      title: assignment.quiz.title,
      description: assignment.quiz.description,
    },
    questions: assignment.quiz.questions.map((q) =>
      stripAnswerKey({ id: q.id, type: q.type, prompt: q.prompt, points: q.points, data: q.data }),
    ),
  });
}
