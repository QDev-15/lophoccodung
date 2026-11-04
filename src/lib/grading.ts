import type { Question, QuestionType } from "@prisma/client";

type MultipleChoiceData = { options: { id: string; text: string }[]; correctOptionId: string };
type TrueFalseData = { correctAnswer: boolean };
type FillInBlankData = { acceptedAnswers: string[]; caseSensitive: boolean };

type GradableQuestion = {
  id: string;
  type: QuestionType;
  points: number;
  data: unknown;
};

export type GradedAnswer = {
  questionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
};

export function gradeAnswer(question: GradableQuestion, response: unknown): GradedAnswer {
  const r = (response ?? {}) as Record<string, unknown>;

  switch (question.type) {
    case "MULTIPLE_CHOICE": {
      const data = question.data as MultipleChoiceData;
      const isCorrect = r.selectedOptionId === data.correctOptionId;
      return {
        questionId: question.id,
        isCorrect,
        pointsAwarded: isCorrect ? question.points : 0,
      };
    }
    case "TRUE_FALSE": {
      const data = question.data as TrueFalseData;
      const isCorrect = r.value === data.correctAnswer;
      return {
        questionId: question.id,
        isCorrect,
        pointsAwarded: isCorrect ? question.points : 0,
      };
    }
    case "FILL_IN_BLANK": {
      const data = question.data as FillInBlankData;
      const normalize = (s: string) => (data.caseSensitive ? s.trim() : s.trim().toLowerCase());
      const answerText = typeof r.text === "string" ? r.text : "";
      const isCorrect = data.acceptedAnswers.some((a) => normalize(a) === normalize(answerText));
      return {
        questionId: question.id,
        isCorrect,
        pointsAwarded: isCorrect ? question.points : 0,
      };
    }
    default:
      return { questionId: question.id, isCorrect: false, pointsAwarded: 0 };
  }
}

export function gradeSubmission(
  questions: GradableQuestion[],
  responsesByQuestionId: Record<string, unknown>,
) {
  const answers = questions.map((q) => gradeAnswer(q, responsesByQuestionId[q.id]));
  const score = answers.reduce((sum, a) => sum + a.pointsAwarded, 0);
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
  return { answers, score, maxScore };
}

const ANSWER_KEY_FIELDS: Record<QuestionType, string[]> = {
  MULTIPLE_CHOICE: ["correctOptionId"],
  TRUE_FALSE: ["correctAnswer"],
  FILL_IN_BLANK: ["acceptedAnswers"],
};

export function stripAnswerKey<T extends { type: QuestionType; data: unknown }>(
  question: T,
): T {
  const fieldsToStrip = ANSWER_KEY_FIELDS[question.type] ?? [];
  const data = { ...(question.data as Record<string, unknown>) };
  for (const field of fieldsToStrip) {
    delete data[field];
  }
  return { ...question, data };
}

export function formatCorrectAnswer(question: { type: QuestionType; data: unknown }): string {
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

export type { Question };
