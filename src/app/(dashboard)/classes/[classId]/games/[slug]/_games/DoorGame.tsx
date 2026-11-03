"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import type { PickerStudent } from "../../usePicker";

const DOOR_COUNT = 6;

export function DoorGame({ pick, isExhausted }: GameComponentProps) {
  const [openedDoor, setOpenedDoor] = useState<number | null>(null);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleDoorClick(i: number) {
    if (openedDoor !== null || isExhausted) return;
    const result = pick();
    if (!result) return;
    setOpenedDoor(i);
    setStudent(result.student);
  }

  function handleReset() {
    setOpenedDoor(null);
    setStudent(null);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: DOOR_COUNT }).map((_, i) => {
          const isOpen = openedDoor === i;
          return (
            <div
              key={i}
              className="relative flex h-28 w-20 items-center justify-center overflow-hidden rounded-lg bg-emerald-50"
            >
              <span className="absolute inset-0 flex items-center justify-center px-1 text-center text-xs font-semibold text-emerald-700">
                {isOpen && student ? student.fullName : ""}
              </span>
              <button
                onClick={() => handleDoorClick(i)}
                disabled={openedDoor !== null || isExhausted}
                className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-amber-600 bg-amber-500 text-3xl text-amber-50 transition-transform duration-500 disabled:cursor-not-allowed"
                style={{
                  transform: isOpen ? "scaleX(0)" : "scaleX(1)",
                  transformOrigin: "left",
                  opacity: openedDoor !== null && !isOpen ? 0.4 : 1,
                }}
              >
                🚪
              </button>
            </div>
          );
        })}
      </div>

      {openedDoor !== null ? (
        <button
          onClick={handleReset}
          disabled={isExhausted}
          className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          Mở lại các cửa
        </button>
      ) : (
        <p className="text-sm text-zinc-500">Chọn một ô cửa để mở.</p>
      )}
    </div>
  );
}
