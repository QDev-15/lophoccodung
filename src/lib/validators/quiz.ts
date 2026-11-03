import { z } from "zod";

import { questionInputSchema } from "./question";

export const quizPayloadSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tên đề kiểm tra").max(150),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  timeLimitSeconds: z.number().int().min(10).max(3 * 60 * 60).nullable(),
  shuffleQuestions: z.boolean(),
  questions: z.array(questionInputSchema).min(1, "Cần ít nhất 1 câu hỏi"),
});

export type QuizPayload = z.infer<typeof quizPayloadSchema>;
