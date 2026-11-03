"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import type { PickerStudent } from "../../usePicker";

const STICK_COUNT = 8;

export function StickDrawGame({ pick, isExhausted }: GameComponentProps) {
  const [pulled, setPulled] = useState<number | null>(null);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handlePull(i: number) {
    if (pulled !== null || isExhausted) return;
    const result = pick();
    if (!result) return;
    setPulled(i);
    setStudent(result.student);
  }

  function handleReset() {
    setPulled(null);
    setStudent(null);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-2">
        {Array.from({ length: STICK_COUNT }).map((_, i) => {
          const isPulled = pulled === i;
          return (
            <button
              key={i}
              onClick={() => handlePull(i)}
              disabled={pulled !== null || isExhausted}
              className="flex flex-col items-center disabled:cursor-not-allowed"
            >
              <span
                className="flex flex-col items-center"
                style={{
                  transform: isPulled ? "translateY(-28px)" : "translateY(0)",
                  transition: "transform 0.4s ease-out",
                }}
              >
                {isPulled && student && (
                  <span className="mb-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {student.fullName}
                  </span>
                )}
                <span
                  className={`h-28 w-3 rounded-full ${
                    isPulled
                      ? "bg-emerald-400"
                      : pulled !== null
                        ? "bg-zinc-200"
                        : "bg-amber-400 hover:bg-amber-500"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>

      {pulled !== null ? (
        <button
          onClick={handleReset}
          disabled={isExhausted}
          className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          Rút que tiếp
        </button>
      ) : (
        <p className="text-sm text-zinc-500">Chọn một que thăm để kéo lên.</p>
      )}
    </div>
  );
}
