import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  const studentDisplayName = String(body.studentDisplayName ?? "").trim();

  if (!studentDisplayName) {
    return NextResponse.json({ error: "Vui lòng nhập tên" }, { status: 400 });
  }

  const assignment = await prisma.assignment.findUnique({
    where: { token },
    select: { id: true, isActive: true, allowMultipleSubmissions: true },
  });

  if (!assignment || !assignment.isActive) {
    return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
  }

  if (!assignment.allowMultipleSubmissions) {
    const existing = await prisma.submission.findFirst({
      where: {
        assignmentId: assignment.id,
        studentDisplayName,
        status: "SUBMITTED",
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bạn đã nộp bài này rồi", submissionId: existing.id },
        { status: 409 },
      );
    }
  }

  const submission = await prisma.submission.create({
    data: {
      assignmentId: assignment.id,
      studentDisplayName,
      status: "IN_PROGRESS",
    },
  });

  return NextResponse.json({ submissionId: submission.id, startedAt: submission.startedAt });
}
