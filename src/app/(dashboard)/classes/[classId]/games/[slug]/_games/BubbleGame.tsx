"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import type { PickerStudent } from "../../usePicker";

const BUBBLE_COUNT = 8;

export function BubbleGame({ pick, isExhausted }: GameComponentProps) {
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handlePop(i: number) {
    if (poppedIndex !== null || isExhausted) return;
    const result = pick();
    if (!result) return;
    setPoppedIndex(i);
    setStudent(result.student);
  }

  function handleReset() {
    setPoppedIndex(null);
    setStudent(null);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
          const isPopped = poppedIndex === i;
          return (
            <button
              key={i}
              onClick={() => handlePop(i)}
              disabled={poppedIndex !== null || isExhausted}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-3xl transition-all duration-300 disabled:cursor-not-allowed"
              style={{
                transform: isPopped ? "scale(1.5)" : "scale(1)",
                opacity: poppedIndex !== null && !isPopped ? 0.3 : 1,
              }}
            >
              {isPopped && student ? (
                <span className="px-1 text-[9px] font-semibold text-sky-700">
                  {student.fullName}
                </span>
              ) : (
                "🫧"
              )}
            </button>
          );
        })}
      </div>

      {poppedIndex !== null ? (
        <button
          onClick={handleReset}
          disabled={isExhausted}
          className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          Bong bóng mới
        </button>
      ) : (
        <p className="text-sm text-zinc-500">Chạm vào một bong bóng để làm nó vỡ.</p>
      )}
    </div>
  );
}
