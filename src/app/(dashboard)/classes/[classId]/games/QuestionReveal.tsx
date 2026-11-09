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
      <div className="mt-4 flex flex-col gap-2.5">
        {options.map((opt) => {
          const isCorrect = revealed && opt.id === data.correctOptionId;
          return (
            <div
              key={opt.id}
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-base font-bold transition ${
                isCorrect
                  ? "animate-pop-in border-(--color-mint) bg-(--color-mint-light) text-(--color-ink) shadow-[0_3px_10px_-4px_rgba(21,128,61,0.35)]"
                  : "border-(--color-ink)/10 text-(--color-ink)/80"
              }`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-base font-extrabold ${
                  isCorrect ? "bg-(--color-mint) text-white" : "bg-(--color-ink)/10 text-(--color-ink)/40"
                }`}
              >
                {isCorrect ? "✓" : ""}
              </span>
              {opt.text}
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
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-center text-base font-extrabold transition ${
                isCorrect
                  ? "animate-pop-in border-(--color-mint) bg-(--color-mint-light) text-(--color-ink) shadow-[0_3px_10px_-4px_rgba(21,128,61,0.35)]"
                  : "border-(--color-ink)/10 text-(--color-ink)/80"
              }`}
            >
              {val ? "✅ Đúng" : "❌ Sai"} {isCorrect && <span className="text-(--color-mint-dark)">✓</span>}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {revealed ? (
        <p className="animate-pop-in rounded-2xl border-2 border-(--color-mint) bg-(--color-mint-light) px-4 py-3.5 text-base font-bold text-(--color-ink) shadow-[0_3px_10px_-4px_rgba(21,128,61,0.35)]">
          ✅ Đáp án: {formatCorrectAnswer({ type: question.type as QuestionType, data: question.data })}
        </p>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-(--color-ink)/15 px-4 py-3.5 text-base text-(--color-ink)/50">
          ✏️ Câu điền từ — bấm &quot;Hiện đáp án&quot; để xem.
        </p>
      )}
    </div>
  );
}
