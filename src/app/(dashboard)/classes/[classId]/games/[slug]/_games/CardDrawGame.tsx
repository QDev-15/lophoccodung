"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import type { PickerStudent } from "../../usePicker";

export function CardDrawGame({ pick, isExhausted }: GameComponentProps) {
  const [flipped, setFlipped] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleDraw() {
    if (flipped || isExhausted) return;
    const result = pick();
    if (!result) return;
    setStudent(result.student);
    setFlipped(true);
  }

  function handleReset() {
    setFlipped(false);
    setStudent(null);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-48 w-32 [perspective:1000px]">
        <div
          className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border-4 border-sky-300 bg-sky-600 text-4xl text-white [backface-visibility:hidden]">
            🂠
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl border-4 border-emerald-300 bg-white p-2 text-center text-sm font-semibold text-emerald-700 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            {student?.fullName}
          </div>
        </div>
      </div>

      <button
        onClick={flipped ? handleReset : handleDraw}
        disabled={!flipped && isExhausted}
        className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {flipped ? "Rút thẻ tiếp" : "Rút thẻ"}
      </button>
    </div>
  );
}
