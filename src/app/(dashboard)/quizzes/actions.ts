"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { quizPayloadSchema, type QuizPayload } from "@/lib/validators/quiz";

async function assertOwnsQuiz(quizId: string, teacherId: string) {
  const owned = await prisma.quiz.findFirst({
    where: { id: quizId, teacherId },
    select: { id: true },
  });
  if (!owned) {
    throw new Error("Không tìm thấy đề kiểm tra");
  }
}

export async function saveQuiz(quizId: string | null, payload: QuizPayload) {
  const teacher = await requireTeacher();

  const parsed = quizPayloadSchema.parse(payload);

  if (quizId) {
    await assertOwnsQuiz(quizId, teacher.id!);
  }

  const savedQuizId = await prisma.$transaction(async (tx) => {
    const quiz = quizId
      ? await tx.quiz.update({
          where: { id: quizId },
          data: {
            title: parsed.title,
            description: parsed.description || null,
            timeLimitSeconds: parsed.timeLimitSeconds,
            shuffleQuestions: parsed.shuffleQuestions,
          },
        })
      : await tx.quiz.create({
          data: {
            title: parsed.title,
            description: parsed.description || null,
            timeLimitSeconds: parsed.timeLimitSeconds,
            shuffleQuestions: parsed.shuffleQuestions,
            teacherId: teacher.id!,
          },
        });

    await tx.question.deleteMany({ where: { quizId: quiz.id } });
    await tx.question.createMany({
      data: parsed.questions.map((q, index) => ({
        quizId: quiz.id,
        order: index,
        type: q.type,
        prompt: q.prompt,
        points: q.points,
        data: q.data,
      })),
    });

    return quiz.id;
  });

  revalidatePath("/quizzes");
  redirect(`/quizzes/${savedQuizId}/edit`);
}

export async function deleteQuiz(quizId: string) {
  const teacher = await requireTeacher();
  await assertOwnsQuiz(quizId, teacher.id!);

  await prisma.quiz.delete({ where: { id: quizId } });

  revalidatePath("/quizzes");
  redirect("/quizzes");
}
