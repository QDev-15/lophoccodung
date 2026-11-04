"use client";

import { useState } from "react";

import type { AdventureTheme } from "@/lib/adventure-themes";

import { QuestionReveal, type GameQuestion } from "../../QuestionReveal";

export function AdventurePlayer({
  theme,
  quiz,
}: {
  theme: AdventureTheme;
  quiz: { id: string; title: string; questions: GameQuestion[] };
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const total = quiz.questions.length;
  const finished = index >= total;
  const question = finished ? null : quiz.questions[index];

  function handleNext() {
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  function handleRestart() {
    setIndex(0);
    setRevealed(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Path board */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white p-5 shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)]">
        {quiz.questions.map((_, i) => (
          <div key={i} className="relative flex size-11 items-center justify-center rounded-full text-xl">
            <span
              className={`absolute inset-0 rounded-full ${
                i < index
                  ? "bg-(--color-mint-light)"
                  : i === index
                    ? "bg-(--color-honey-light)"
                    : "bg-(--color-cream)"
              }`}
            />
            <span className="relative">
              {i === index && !finished ? theme.mascot : i < index ? "✅" : theme.stepIcon}
            </span>
          </div>
        ))}
        <div className="relative flex size-11 items-center justify-center rounded-full text-xl">
          <span className={`absolute inset-0 rounded-full ${finished ? "bg-(--color-honey-light)" : "bg-(--color-cream)"}`} />
          <span className="relative">{finished ? theme.mascot : theme.finishIcon}</span>
        </div>
      </div>

      {finished ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-8 text-center shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)]">
          <span className="text-5xl">{theme.finishIcon}</span>
          <h2 className="font-display text-xl font-extrabold text-(--color-cocoa)">
            Hoàn thành hành trình!
          </h2>
          <p className="text-sm text-(--color-cocoa)/60">
            Cả lớp đã trả lời xong {total} câu hỏi trong &quot;{quiz.title}&quot;.
          </p>
          <button
            onClick={handleRestart}
            className="mt-2 rounded-full bg-(--color-honey) px-6 py-2.5 text-sm font-bold text-white hover:bg-(--color-honey-dark)"
          >
            Chơi lại
          </button>
        </div>
      ) : (
        question && (
          <div className="rounded-3xl bg-white p-6 shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)]">
            <p className="text-xs font-bold text-(--color-cocoa)/40">
              Câu {index + 1}/{total}
            </p>
            <p className="mt-2 font-display text-lg font-bold text-(--color-cocoa)">
              {question.prompt}
            </p>

            <QuestionReveal question={question} revealed={revealed} />

            <div className="mt-6 flex justify-end gap-3">
              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  className="rounded-full bg-(--color-cocoa)/10 px-6 py-2.5 text-sm font-bold text-(--color-cocoa) hover:bg-(--color-cocoa)/15"
                >
                  Hiện đáp án
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="rounded-full bg-(--color-honey) px-6 py-2.5 text-sm font-bold text-white hover:bg-(--color-honey-dark)"
                >
                  {index + 1 === total ? "Về đích →" : "Câu tiếp theo →"}
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
