import { z } from "zod";

export const multipleChoiceDataSchema = z.object({
  options: z
    .array(z.object({ id: z.string().min(1), text: z.string().trim().min(1) }))
    .min(2, "Cần ít nhất 2 lựa chọn"),
  correctOptionId: z.string().min(1, "Chưa chọn đáp án đúng"),
});

export const trueFalseDataSchema = z.object({
  correctAnswer: z.boolean(),
});

export const fillInBlankDataSchema = z.object({
  acceptedAnswers: z.array(z.string().trim().min(1)).min(1, "Cần ít nhất 1 đáp án được chấp nhận"),
  caseSensitive: z.boolean().default(false),
});

export const questionInputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("MULTIPLE_CHOICE"),
    prompt: z.string().trim().min(1, "Chưa nhập câu hỏi"),
    points: z.number().int().min(1).max(100),
    data: multipleChoiceDataSchema,
  }),
  z.object({
    type: z.literal("TRUE_FALSE"),
    prompt: z.string().trim().min(1, "Chưa nhập câu hỏi"),
    points: z.number().int().min(1).max(100),
    data: trueFalseDataSchema,
  }),
  z.object({
    type: z.literal("FILL_IN_BLANK"),
    prompt: z.string().trim().min(1, "Chưa nhập câu hỏi"),
    points: z.number().int().min(1).max(100),
    data: fillInBlankDataSchema,
  }),
]);

export type QuestionInput = z.infer<typeof questionInputSchema>;
