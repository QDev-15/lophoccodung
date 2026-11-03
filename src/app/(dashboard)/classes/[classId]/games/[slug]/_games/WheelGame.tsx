"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";

export function WheelGame({ remaining, pick, isExhausted }: GameComponentProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [current, setCurrent] = useState<PickerStudent | null>(null);

  function handleSpin() {
    if (spinning || isExhausted) return;
    const result = pick();
    if (!result) return;
    const sliceAngle = 360 / result.poolSize;
    const targetCenter = result.index * sliceAngle + sliceAngle / 2;
    const spins = 4 + Math.random();
    const delta = spins * 360 + (360 - targetCenter);
    setSpinning(true);
    setCurrent(null);
    setRotation((r) => r + delta);
    setTimeout(() => {
      setCurrent(result.student);
      setSpinning(false);
    }, 2700);
  }

  const poolSize = remaining.length;
  const sliceAngle = poolSize > 0 ? 360 / poolSize : 360;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-64 w-64">
        <div className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2 text-2xl">🔻</div>
        <div
          className="relative h-64 w-64 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-50 to-sky-50 shadow-inner"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 2.6s cubic-bezier(0.17,0.67,0.12,1)",
          }}
        >
          {remaining.map((s, i) => {
            const angle = sliceAngle * i - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 100;
            const x = 128 + radius * Math.cos(rad);
            const y = 128 + radius * Math.sin(rad);
            return (
              <span
                key={s.id}
                className="absolute w-[72px] -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-medium leading-tight text-zinc-700"
                style={{ left: x, top: y }}
              >
                {s.fullName}
              </span>
            );
          })}
          <div className="absolute inset-8 rounded-full bg-white shadow" />
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || isExhausted}
        className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {spinning ? "Đang quay..." : "Quay vòng quay!"}
      </button>

      <RevealBanner student={current} />
    </div>
  );
}
