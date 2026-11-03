"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";

const START_POS = { x: -40, y: -40 };

export function DartGame({ remaining, pick, isExhausted }: GameComponentProps) {
  const [throwing, setThrowing] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);
  const [dartPos, setDartPos] = useState<{ x: number; y: number } | null>(null);

  function handleThrow() {
    if (throwing || isExhausted) return;
    const result = pick();
    if (!result) return;
    const sliceAngle = 360 / result.poolSize;
    const angle = sliceAngle * result.index - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = 90;
    const target = { x: 128 + radius * Math.cos(rad), y: 128 + radius * Math.sin(rad) };

    setThrowing(true);
    setStudent(null);
    setDartPos(START_POS);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setDartPos(target));
    });
    setTimeout(() => {
      setThrowing(false);
      setStudent(result.student);
    }, 700);
  }

  const poolSize = remaining.length;
  const sliceAngle = poolSize > 0 ? 360 / poolSize : 360;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-red-300 bg-gradient-to-br from-red-50 to-amber-50">
        {remaining.map((s, i) => {
          const angle = sliceAngle * i - 90;
          const rad = (angle * Math.PI) / 180;
          const radius = 100;
          const x = 128 + radius * Math.cos(rad);
          const y = 128 + radius * Math.sin(rad);
          return (
            <span
              key={s.id}
              className="absolute w-[64px] -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-medium text-zinc-700"
              style={{ left: x, top: y }}
            >
              {s.fullName}
            </span>
          );
        })}
        <div className="absolute inset-10 rounded-full bg-white shadow-inner" />
        {dartPos && (
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
            style={{ left: dartPos.x, top: dartPos.y, transition: "left 0.6s ease-out, top 0.6s ease-out" }}
          >
            🎯
          </span>
        )}
      </div>

      <button
        onClick={handleThrow}
        disabled={throwing || isExhausted}
        className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {throwing ? "Đang ném..." : "Ném phi tiêu!"}
      </button>

      <RevealBanner student={student} />
    </div>
  );
}
