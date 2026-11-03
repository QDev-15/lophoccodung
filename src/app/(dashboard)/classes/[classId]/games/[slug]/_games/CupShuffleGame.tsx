"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";

export function CupShuffleGame({ pick, isExhausted }: GameComponentProps) {
  const [shuffling, setShuffling] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleShuffle() {
    if (shuffling || isExhausted) return;
    const result = pick();
    if (!result) return;
    setShuffling(true);
    setStudent(null);
    setTimeout(() => {
      setShuffling(false);
      setStudent(result.student);
    }, 1200);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-6 text-6xl">
        {[0, 1, 2].map((i) => (
          <span key={i} className={shuffling ? "animate-cup-shuffle" : ""}>
            🥤
          </span>
        ))}
      </div>

      <button
        onClick={handleShuffle}
        disabled={shuffling || isExhausted}
        className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {shuffling ? "Đang xóc..." : student ? "Xóc tiếp" : "Xóc đĩa!"}
      </button>

      <RevealBanner student={student} />
    </div>
  );
}
