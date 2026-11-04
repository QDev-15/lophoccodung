"use client";

import { useEffect, useState } from "react";

const PRESETS = [1, 3, 5, 10, 15];

export function TimerClient() {
  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (secondsLeft !== 0 || !running) return;
    // Countdown reached zero: stop running so the alert state renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRunning(false);
  }, [secondsLeft, running]);

  function setPreset(minutes: number) {
    setRunning(false);
    setTotalSeconds(minutes * 60);
    setSecondsLeft(minutes * 60);
  }

  function applyCustom() {
    const minutes = Math.max(1, Math.min(120, Number(customMinutes) || 0));
    if (!minutes) return;
    setPreset(minutes);
    setCustomMinutes("");
  }

  function toggleRunning() {
    if (secondsLeft === 0) return;
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(totalSeconds);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const isDone = secondsLeft === 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className={`relative flex size-64 items-center justify-center rounded-full transition-colors ${
          isDone ? "animate-glow bg-(--color-bloom)" : "bg-white"
        }`}
        style={{
          boxShadow: isDone
            ? undefined
            : "0 8px 32px -8px rgba(62,40,27,0.18)",
          background: isDone
            ? undefined
            : `conic-gradient(var(--color-honey) ${progress * 360}deg, var(--color-honey-light) 0deg)`,
        }}
      >
        <div className="flex size-52 flex-col items-center justify-center rounded-full bg-white">
          <span className={`font-display text-5xl font-extrabold ${isDone ? "text-(--color-bloom)" : "text-(--color-cocoa)"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          {isDone && <span className="mt-2 text-sm font-bold text-(--color-bloom)">Hết giờ! ⏰</span>}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => setPreset(m)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              totalSeconds === m * 60
                ? "bg-(--color-honey) text-white"
                : "bg-white text-(--color-cocoa) hover:bg-(--color-honey-light)"
            }`}
          >
            {m} phút
          </button>
        ))}
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1">
          <input
            type="number"
            min={1}
            max={120}
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Số phút"
            className="w-20 rounded-full px-2 py-1 text-sm text-(--color-cocoa) focus:outline-none"
          />
          <button
            onClick={applyCustom}
            className="rounded-full bg-(--color-cocoa)/10 px-3 py-1.5 text-sm font-bold text-(--color-cocoa) hover:bg-(--color-cocoa)/15"
          >
            Đặt
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleRunning}
          disabled={secondsLeft === 0}
          className="rounded-full bg-(--color-honey) px-8 py-3 text-base font-bold text-white transition hover:bg-(--color-honey-dark) disabled:opacity-50"
        >
          {running ? "Tạm dừng" : "Bắt đầu"}
        </button>
        <button
          onClick={reset}
          className="rounded-full border-2 border-(--color-cocoa)/15 px-8 py-3 text-base font-bold text-(--color-cocoa) hover:bg-white"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
}
