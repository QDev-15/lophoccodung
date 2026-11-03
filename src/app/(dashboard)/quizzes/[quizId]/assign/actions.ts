"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

export async function createAssignment(formData: FormData) {
  const teacher = await requireTeacher();

  const quizId = String(formData.get("quizId"));
  const classId = String(formData.get("classId"));
  const timeLimitOverrideMinutes = formData.get("timeLimitOverrideMinutes");
  const showResultsToStudent = formData.get("showResultsToStudent") === "on";
  const allowMultipleSubmissions = formData.get("allowMultipleSubmissions") === "on";

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, teacherId: teacher.id! },
    select: { id: true },
  });
  if (!quiz) {
    throw new Error("Không tìm thấy đề kiểm tra");
  }

  const classItem = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    select: { id: true },
  });
  if (!classItem) {
    throw new Error("Không tìm thấy lớp học");
  }

  const assignment = await prisma.assignment.create({
    data: {
      token: nanoid(10),
      quizId,
      classId,
      createdById: teacher.id!,
      timeLimitOverrideSeconds: timeLimitOverrideMinutes
        ? Number(timeLimitOverrideMinutes) * 60
        : null,
      showResultsToStudent,
      allowMultipleSubmissions,
    },
  });

  redirect(`/assignments/${assignment.id}/results`);
}
