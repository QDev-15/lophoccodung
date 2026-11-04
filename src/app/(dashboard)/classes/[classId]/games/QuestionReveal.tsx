import type { QuestionType } from "@prisma/client";

import { formatCorrectAnswer } from "@/lib/grading";

export type GameQuestion = {
  id: string;
  type: string;
  prompt: string;
  points: number;
  data: unknown;
};

export function QuestionReveal({
  question,
  revealed,
}: {
  question: GameQuestion;
  revealed: boolean;
}) {
  const data = question.data as Record<string, unknown>;

  if (question.type === "MULTIPLE_CHOICE") {
    const options = (data.options as { id: string; text: string }[]) ?? [];
    return (
      <div className="mt-4 flex flex-col gap-2">
        {options.map((opt) => {
          const isCorrect = revealed && opt.id === data.correctOptionId;
          return (
            <div
              key={opt.id}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${
                isCorrect
                  ? "border-(--color-mint) bg-(--color-mint-light) text-(--color-cocoa)"
                  : "border-(--color-cocoa)/10 text-(--color-cocoa)/80"
              }`}
            >
              {opt.text} {isCorrect && "✓"}
            </div>
          );
        })}
      </div>
    );
  }

  if (question.type === "TRUE_FALSE") {
    const correctAnswer = data.correctAnswer as boolean;
    return (
      <div className="mt-4 flex gap-3">
        {[true, false].map((val) => {
          const isCorrect = revealed && val === correctAnswer;
          return (
            <div
              key={String(val)}
              className={`flex-1 rounded-xl border-2 px-4 py-2 text-center text-sm font-bold ${
                isCorrect
                  ? "border-(--color-mint) bg-(--color-mint-light) text-(--color-cocoa)"
                  : "border-(--color-cocoa)/10 text-(--color-cocoa)/80"
              }`}
            >
              {val ? "Đúng" : "Sai"} {isCorrect && "✓"}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {revealed ? (
        <p className="rounded-xl border-2 border-(--color-mint) bg-(--color-mint-light) px-4 py-2 text-sm font-bold text-(--color-cocoa)">
          Đáp án: {formatCorrectAnswer({ type: question.type as QuestionType, data: question.data })}
        </p>
      ) : (
        <p className="text-sm text-(--color-cocoa)/50">Câu điền từ — bấm &quot;Hiện đáp án&quot; để xem.</p>
      )}
    </div>
  );
}
