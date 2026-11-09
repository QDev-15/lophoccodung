"use client";

import { useEffect, useState } from "react";

import { IconChip } from "@/components/IconChip";

const PRESETS = [1, 3, 5, 10, 15];

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

// Deterministic ambient bubbles behind the card (left%, size px, delay s, duration s).
const BUBBLES: Array<[number, number, number, number]> = [
  [8, 22, 0, 8],
  [22, 14, 1.4, 7],
  [40, 18, 2.6, 9],
  [62, 12, 0.8, 6.5],
  [78, 20, 3.2, 8.5],
  [92, 15, 1.9, 7.5],
];

function CandyButton({
  onClick,
  disabled,
  variant = "mint",
  className = "",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: "mint" | "ink" | "ghost";
  className?: string;
  children: React.ReactNode;
}) {
  const styles = {
    mint: "bg-(--color-mint) text-white shadow-[0_5px_0_var(--color-mint-dark),0_12px_24px_-8px_rgba(184,73,46,0.55)] active:shadow-[0_1px_0_var(--color-mint-dark)]",
    ink: "bg-(--color-ink) text-white shadow-[0_5px_0_rgba(0,0,0,0.35),0_12px_24px_-8px_rgba(46,42,33,0.5)] active:shadow-[0_1px_0_rgba(0,0,0,0.35)]",
    ghost:
      "border-2 border-(--color-ink)/15 bg-white text-(--color-ink) shadow-[0_4px_0_rgba(46,42,33,0.08),0_10px_20px_-6px_rgba(46,42,33,0.18)] active:shadow-[0_1px_0_rgba(46,42,33,0.08)]",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative min-h-12 overflow-hidden rounded-full px-8 py-3 text-base font-extrabold transition-[transform,box-shadow] duration-200 active:translate-y-1 disabled:translate-y-0 disabled:opacity-50 ${styles[variant]} ${className}`}
      style={{ transitionTimingFunction: "var(--ease-bounce)" }}
    >
      {variant === "mint" && !disabled && (
        <span
          aria-hidden="true"
          className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/35"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

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
  const isUrgent = !isDone && running && secondsLeft <= 10;
  const markerAngle = progress * 360;

  return (
    <div className="relative w-full max-w-md">
      <style>{`
        @keyframes timerclient-bubble-rise {
          0% { transform: translateY(0) scale(0.85); opacity: 0; }
          15% { opacity: 0.55; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-180px) scale(1.15); opacity: 0; }
        }
        .timerclient-bubble { animation-name: timerclient-bubble-rise; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }

        @keyframes timerclient-urgent-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(173,20,87,0), inset 0 2px 6px rgba(255,255,255,0.8); }
          50% { box-shadow: 0 0 0 12px rgba(173,20,87,0.22), 0 10px 26px -6px rgba(173,20,87,0.5), inset 0 2px 6px rgba(255,255,255,0.8); }
        }
        .timerclient-urgent-ring { animation: timerclient-urgent-pulse 1s ease-in-out infinite; }

        @keyframes timerclient-celebrate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          20% { transform: translateY(-12px) rotate(-10deg); }
          45% { transform: translateY(0) rotate(8deg); }
          65% { transform: translateY(-7px) rotate(-5deg); }
          85% { transform: translateY(0) rotate(3deg); }
        }
        .timerclient-celebrate { animation: timerclient-celebrate 1s var(--ease-bounce) infinite; }

        @keyframes timerclient-confetti-fall {
          0% { transform: translateY(-16px) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateY(180px) rotate(340deg); opacity: 0; }
        }
        .timerclient-confetti { animation: timerclient-confetti-fall 2.1s ease-in infinite; }

        @keyframes timerclient-marker-glow {
          0%, 100% { box-shadow: 0 0 0 3px var(--color-mint), 0 2px 10px rgba(184,73,46,0.6); }
          50% { box-shadow: 0 0 0 5px var(--color-mint), 0 2px 14px rgba(184,73,46,0.85); }
        }
        .timerclient-marker { animation: timerclient-marker-glow 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .timerclient-bubble,
          .timerclient-urgent-ring,
          .timerclient-celebrate,
          .timerclient-confetti,
          .timerclient-marker {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* Ambient bubbles rising behind the card */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {BUBBLES.map(([left, size, delay, duration], i) => (
          <span
            key={i}
            className="timerclient-bubble absolute bottom-0 rounded-full bg-(--color-mint-light)/50"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] bg-(--color-cloud) shadow-[0_16px_40px_-16px_rgba(46,42,33,0.25)] sm:rounded-[2.5rem]">
        {/* Gradient header band with mascot */}
        <div className="animate-gradient-pan relative flex w-full items-center justify-center gap-3 bg-gradient-to-r from-(--color-lavender) via-(--color-mint) to-(--color-lavender) bg-[length:200%_200%] px-6 py-4 sm:px-10">
          <span aria-hidden="true" className="absolute -left-3 -top-6 size-16 rounded-full bg-white/15 blur-lg" />
          <span aria-hidden="true" className="absolute -right-4 -bottom-6 size-20 rounded-full bg-white/15 blur-lg" />
          <span
            aria-hidden="true"
            className="animate-twinkle absolute left-[12%] top-2 text-lg text-(--color-sun)"
          >
            ✦
          </span>
          <span
            aria-hidden="true"
            className="animate-twinkle absolute right-[14%] bottom-2 text-lg text-(--color-sun)"
            style={{ animationDelay: "0.5s" }}
          >
            ✦
          </span>

          <span className="animate-float inline-flex">
            <IconChip icon="🐰" tint="lavender" size="sm" className="bg-white/90 shadow-[0_3px_0_rgba(0,0,0,0.12)]" />
          </span>
          <p className="font-display text-sm font-extrabold text-white drop-shadow-sm sm:text-base">
            Thỏ Bông canh giờ cho lớp mình nhé!
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 px-6 pb-6 sm:px-10 sm:pb-10">
          {isDone && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <span className="animate-twinkle absolute left-[14%] top-20 text-3xl">🎊</span>
              <span className="animate-twinkle absolute right-[16%] top-24 text-3xl" style={{ animationDelay: "0.3s" }}>
                🔔
              </span>
              <span className="animate-twinkle absolute left-[22%] bottom-10 text-3xl" style={{ animationDelay: "0.6s" }}>
                ⏰
              </span>
              <span className="animate-twinkle absolute right-[22%] bottom-12 text-3xl" style={{ animationDelay: "0.9s" }}>
                🎊
              </span>
              {["🎉", "🎈", "⭐", "🎊", "🌟"].map((emoji, i) => (
                <span
                  key={emoji + i}
                  className="timerclient-confetti absolute top-0 text-2xl"
                  style={{ left: `${10 + i * 20}%`, animationDelay: `${i * 0.25}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}

          <div
            className={`relative mt-2 flex size-64 items-center justify-center rounded-full transition-colors sm:size-72 ${
              isDone ? "animate-glow bg-gradient-to-br from-(--color-bloom) to-[#7a0e3a]" : "bg-white"
            } ${isUrgent ? "timerclient-urgent-ring" : ""}`}
            style={{
              boxShadow:
                isDone || isUrgent
                  ? undefined
                  : "inset 0 2px 6px rgba(255,255,255,0.8), 0 10px 32px -10px rgba(46,42,33,0.22)",
              background: isDone
                ? undefined
                : `conic-gradient(${isUrgent ? "var(--color-bloom)" : "var(--color-mint)"} ${
                    progress * 360
                  }deg, var(--color-mint-light) 0deg)`,
            }}
          >
            {!isDone &&
              TICKS.map((deg) => (
                <span
                  key={deg}
                  className="absolute left-1/2 top-1/2 h-3 w-0.5 rounded-full bg-(--color-ink)/15"
                  style={{ transform: `rotate(${deg}deg) translateY(-7.6rem)` }}
                />
              ))}

            {!isDone && progress > 0 && (
              <div className="absolute inset-0" style={{ transform: `rotate(${markerAngle}deg)` }}>
                <span
                  className="timerclient-marker absolute left-1/2 top-1/2 size-4 -translate-x-1/2 rounded-full bg-white"
                  style={{ transform: "translateY(-7.6rem)" }}
                />
              </div>
            )}

            <div
              className={`relative flex size-52 flex-col items-center justify-center rounded-full bg-white transition-transform sm:size-60 ${
                isUrgent ? "animate-wiggle" : ""
              }`}
              style={{
                boxShadow: "inset 0 2px 8px rgba(46,42,33,0.08)",
              }}
            >
              <span
                className={`font-display text-5xl font-extrabold tabular-nums sm:text-6xl ${
                  isDone ? "text-(--color-bloom)" : isUrgent ? "text-(--color-bloom)" : "text-(--color-ink)"
                }`}
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              {!isDone && (
                <span className="mt-1 text-sm font-bold text-(--color-ink)/40">
                  {running ? "Đang đếm giờ…" : "Sẵn sàng"}
                </span>
              )}
              {isDone && (
                <>
                  <div className="timerclient-celebrate mt-1 flex items-center gap-2">
                    <span className="text-3xl">🙋‍♂️</span>
                    <span className="text-3xl">🙋‍♀️</span>
                  </div>
                  <span className="animate-pop-in mt-2 rounded-full bg-(--color-bloom) px-3 py-1 text-sm font-extrabold text-white shadow-[0_3px_0_#7a0e3a]">
                    Hết giờ! ⏰
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPreset(m)}
                className={`min-h-12 rounded-full px-4 py-2 text-base font-bold transition-[transform,box-shadow] duration-200 active:translate-y-0.5 ${
                  totalSeconds === m * 60
                    ? "bg-(--color-mint) text-white shadow-[0_3px_0_var(--color-mint-dark),0_8px_16px_-4px_rgba(184,73,46,0.45)]"
                    : "border-2 border-(--color-ink)/15 bg-white text-(--color-ink)/70 shadow-[0_2px_0_rgba(46,42,33,0.06)] hover:bg-(--color-mint-light) active:shadow-[0_1px_0_rgba(46,42,33,0.06)]"
                }`}
                style={{ transitionTimingFunction: "var(--ease-bounce)" }}
              >
                {m} phút
              </button>
            ))}
            <div className="flex min-h-12 items-center gap-1 rounded-full border-2 border-(--color-ink)/15 bg-white px-2 py-1">
              <input
                type="number"
                min={1}
                max={120}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Số phút"
                className="w-20 rounded-full px-2 py-1 text-base text-(--color-ink) focus:outline-none"
              />
              <button
                type="button"
                onClick={applyCustom}
                className="min-h-10 rounded-full bg-(--color-ink)/10 px-3 py-1.5 text-base font-bold text-(--color-ink) transition active:translate-y-0.5 hover:bg-(--color-ink)/15"
              >
                Đặt
              </button>
            </div>
          </div>

          <div className="relative flex gap-3">
            <CandyButton onClick={toggleRunning} disabled={secondsLeft === 0} variant="mint">
              {running ? "⏸️ Tạm dừng" : "▶️ Bắt đầu"}
            </CandyButton>
            <CandyButton onClick={reset} variant="ghost">
              🔁 Đặt lại
            </CandyButton>
          </div>
        </div>
      </div>
    </div>
  );
}
