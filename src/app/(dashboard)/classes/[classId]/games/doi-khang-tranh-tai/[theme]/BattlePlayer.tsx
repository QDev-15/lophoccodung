"use client";

import { useState } from "react";

import type { BattleTheme } from "@/lib/battle-themes";

import { QuestionReveal, type GameQuestion } from "../../QuestionReveal";

export function BattlePlayer({
  theme,
  quiz,
}: {
  theme: BattleTheme;
  quiz: { id: string; title: string; questions: GameQuestion[] };
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [awarded, setAwarded] = useState(false);

  const total = quiz.questions.length;
  const finished = index >= total;
  const question = finished ? null : quiz.questions[index];

  function award(team: "A" | "B" | "tie") {
    if (awarded) return;
    if (team === "A") setScoreA((s) => s + 1);
    if (team === "B") setScoreB((s) => s + 1);
    setAwarded(true);
  }

  function handleNext() {
    setIndex((i) => i + 1);
    setRevealed(false);
    setAwarded(false);
  }

  function handleRestart() {
    setIndex(0);
    setRevealed(false);
    setAwarded(false);
    setScoreA(0);
    setScoreB(0);
  }

  const winner = scoreA === scoreB ? null : scoreA > scoreB ? "A" : "B";

  return (
    <div className="flex flex-col gap-6">
      {/* Scoreboard */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-1 rounded-3xl bg-(--color-honey-light) p-5">
          <span className="text-sm font-bold text-(--color-honey-dark)">🟠 Đội A</span>
          <span className="font-display text-4xl font-extrabold text-(--color-honey-dark)">{scoreA}</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-3xl bg-(--color-sky-light) p-5">
          <span className="text-sm font-bold text-(--color-sky)">🔵 Đội B</span>
          <span className="font-display text-4xl font-extrabold text-(--color-sky)">{scoreB}</span>
        </div>
      </div>

      {finished ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-8 text-center shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)]">
          <span className="text-5xl">{theme.emoji}</span>
          <h2 className="font-display text-xl font-extrabold text-(--color-cocoa)">
            {winner === null
              ? "Hai đội hòa nhau!"
              : winner === "A"
                ? "🏆 Đội A chiến thắng!"
                : "🏆 Đội B chiến thắng!"}
          </h2>
          <p className="text-sm text-(--color-cocoa)/60">
            Tỉ số cuối: {scoreA} - {scoreB}
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

            {!revealed ? (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setRevealed(true)}
                  className="rounded-full bg-(--color-cocoa)/10 px-6 py-2.5 text-sm font-bold text-(--color-cocoa) hover:bg-(--color-cocoa)/15"
                >
                  Hiện đáp án
                </button>
              </div>
            ) : !awarded ? (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => award("A")}
                  className="rounded-full bg-(--color-honey) px-5 py-2.5 text-sm font-bold text-white hover:bg-(--color-honey-dark)"
                >
                  +1 Đội A
                </button>
                <button
                  onClick={() => award("tie")}
                  className="rounded-full bg-(--color-cocoa)/10 px-5 py-2.5 text-sm font-bold text-(--color-cocoa) hover:bg-(--color-cocoa)/15"
                >
                  Không ai đúng
                </button>
                <button
                  onClick={() => award("B")}
                  className="rounded-full bg-(--color-sky) px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
                >
                  +1 Đội B
                </button>
              </div>
            ) : (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="rounded-full bg-(--color-honey) px-6 py-2.5 text-sm font-bold text-white hover:bg-(--color-honey-dark)"
                >
                  {index + 1 === total ? "Xem kết quả →" : "Câu tiếp theo →"}
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
