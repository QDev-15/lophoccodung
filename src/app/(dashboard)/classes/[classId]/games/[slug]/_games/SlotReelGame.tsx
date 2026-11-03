"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import type { PickerStudent } from "../../usePicker";

const ROW_HEIGHT = 48;
const REPEAT = 4;

export function SlotReelGame({ remaining, pick, isExhausted }: GameComponentProps) {
  const [spinning, setSpinning] = useState(false);
  const [strip, setStrip] = useState<PickerStudent[]>(remaining);
  const [offset, setOffset] = useState(0);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleSpin() {
    if (spinning || isExhausted) return;
    const pool = remaining;
    const result = pick();
    if (!result) return;

    const filler: PickerStudent[] = [];
    for (let i = 0; i < REPEAT; i++) {
      filler.push(...pool);
    }
    filler.push(result.student);
    const finalIndex = filler.length - 1;

    setStrip(filler);
    setOffset(0);
    setStudent(null);
    setSpinning(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOffset(finalIndex * ROW_HEIGHT));
    });
    setTimeout(() => {
      setSpinning(false);
      setStudent(result.student);
    }, 1900);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="relative w-56 overflow-hidden rounded-xl border-4 border-violet-300 bg-violet-50"
        style={{ height: ROW_HEIGHT }}
      >
        <div
          style={{
            transform: `translateY(-${offset}px)`,
            transition: spinning ? "transform 1.8s cubic-bezier(0.12,0.7,0.2,1)" : "none",
          }}
        >
          {strip.map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              className="flex items-center justify-center text-sm font-semibold text-violet-700"
              style={{ height: ROW_HEIGHT }}
            >
              {s.fullName}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 border-y-2 border-violet-500" />
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || isExhausted}
        className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {spinning ? "Đang quay..." : "Quay số!"}
      </button>

      {student && !spinning && (
        <p className="text-sm text-zinc-500">
          Đã gọi: <span className="font-semibold text-emerald-700">{student.fullName}</span>
        </p>
      )}
    </div>
  );
}
