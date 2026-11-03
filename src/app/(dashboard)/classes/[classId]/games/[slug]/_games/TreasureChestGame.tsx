"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";

export function TreasureChestGame({ pick, isExhausted }: GameComponentProps) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleOpen() {
    if (opening || isExhausted) return;
    const result = pick();
    if (!result) return;
    setOpening(true);
    setOpened(false);
    setStudent(null);
    setTimeout(() => {
      setOpening(false);
      setOpened(true);
      setStudent(result.student);
    }, 900);
  }

  function handleReset() {
    setOpened(false);
    setStudent(null);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className={`text-7xl ${opening ? "animate-chest-shake" : ""}`}>
        {opened ? "📦" : "🧰"}
      </div>

      {!opened ? (
        <button
          onClick={handleOpen}
          disabled={opening || isExhausted}
          className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {opening ? "Đang mở..." : "Mở rương!"}
        </button>
      ) : (
        <button
          onClick={handleReset}
          disabled={isExhausted}
          className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          Mở rương khác
        </button>
      )}

      <RevealBanner student={student} />
    </div>
  );
}
