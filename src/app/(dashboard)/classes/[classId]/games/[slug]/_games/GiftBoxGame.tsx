"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import type { PickerStudent } from "../../usePicker";

const BOX_COUNT = 6;

export function GiftBoxGame({ pick, isExhausted }: GameComponentProps) {
  const [openedBox, setOpenedBox] = useState<number | null>(null);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleBoxClick(boxIndex: number) {
    if (openedBox !== null || isExhausted) return;
    const result = pick();
    if (!result) return;
    setOpenedBox(boxIndex);
    setStudent(result.student);
  }

  function handleReset() {
    setOpenedBox(null);
    setStudent(null);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: BOX_COUNT }).map((_, i) => {
          const isOpen = openedBox === i;
          return (
            <button
              key={i}
              onClick={() => handleBoxClick(i)}
              disabled={openedBox !== null || isExhausted}
              className={`flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2 text-center transition disabled:cursor-not-allowed ${
                isOpen
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-40"
              }`}
            >
              {isOpen && student ? (
                <span className="px-1 text-xs font-semibold text-emerald-700">
                  {student.fullName}
                </span>
              ) : (
                <span className="text-3xl">🎁</span>
              )}
            </button>
          );
        })}
      </div>

      {openedBox !== null ? (
        <button
          onClick={handleReset}
          disabled={isExhausted}
          className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          Chơi tiếp
        </button>
      ) : (
        <p className="text-sm text-zinc-500">Chọn một hộp quà để mở.</p>
      )}
    </div>
  );
}
