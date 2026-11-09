"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useCameraMotion } from "@/lib/useCameraMotion";
import { IconChip, TINT_ROTATION } from "@/components/IconChip";

const ROUND_SECONDS = 20;
const TARGET_ENERGY = 100;
const LOW_TIME_THRESHOLD = 5;

type Phase = "idle" | "running" | "won" | "timeup";

const CHEER_KIDS = ["🙋‍♀️", "🙋‍♂️", "🧑‍🎓", "👦"] as const;
const CONFETTI = [
  { left: "8%", delay: "0s", emoji: "🎉" },
  { left: "32%", delay: "0.5s", emoji: "✨" },
  { left: "58%", delay: "1s", emoji: "🎊" },
  { left: "82%", delay: "0.3s", emoji: "⭐" },
  { left: "45%", delay: "1.4s", emoji: "🌟" },
] as const;

function ViewfinderCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M2 2 L2 10 M2 2 L10 2" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  );
}

export function ExerciseClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [energy, setEnergy] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);

  const energyRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishRef = useRef<(result: "won" | "timeup") => void>(() => {});

  const { videoRef, start, stop: stopMotion, active, error } = useCameraMotion((frame) => {
    energyRef.current = Math.max(0, Math.min(TARGET_ENERGY, energyRef.current + frame.total * 0.12 - 0.4));
    setEnergy(energyRef.current);
    if (energyRef.current >= TARGET_ENERGY) finishRef.current("won");
  });

  const finish = useCallback(
    (result: "won" | "timeup") => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setPhase(result);
      stopMotion();
    },
    [stopMotion],
  );
  useEffect(() => {
    finishRef.current = finish;
  });

  async function handleStart() {
    energyRef.current = 0;
    setEnergy(0);
    setSecondsLeft(ROUND_SECONDS);
    setPhase("running");
    await start();

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          finish(energyRef.current >= TARGET_ENERGY ? "won" : "timeup");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleStop() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stopMotion();
    setPhase("idle");
  }

  const isHot = phase === "running" && energy >= 70;
  const isLowTime = phase === "running" && secondsLeft <= LOW_TIME_THRESHOLD;

  return (
    <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[0_16px_40px_-16px_rgba(46,42,33,0.25)] sm:rounded-[2.5rem] sm:p-10">
      {/* Decorative ambience — soft color blobs + sprouting leaves, purely cosmetic */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 -top-14 size-40 rounded-full bg-(--color-mint-light)/60 blur-3xl" />
        <div className="absolute -bottom-12 -left-10 size-36 rounded-full bg-(--color-lavender)/15 blur-3xl" />
        <span className="animate-leaf-sway absolute bottom-1 left-3 text-2xl opacity-40">🍃</span>
        <span className="animate-leaf-sway absolute bottom-1 right-3 text-2xl opacity-40" style={{ animationDelay: "1.1s" }}>
          🌿
        </span>
      </div>

      <div className={`relative z-10 ${phase === "running" ? "exercise2-ring" : ""}`}>
        <div className="relative z-10 size-72 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1a1a1a] to-(--color-ink) shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08),0_8px_32px_-8px_rgba(62,40,27,0.4)] sm:size-80">
          <video
            ref={videoRef}
            muted
            playsInline
            className={`size-full scale-x-[-1] object-cover transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
          />

          {/* Viewfinder chrome */}
          <ViewfinderCorner className="absolute left-3 top-3 size-7 text-white/80" />
          <ViewfinderCorner className="absolute right-3 top-3 size-7 rotate-90 text-white/80" />
          <ViewfinderCorner className="absolute bottom-3 left-3 size-7 -rotate-90 text-white/80" />
          <ViewfinderCorner className="absolute bottom-3 right-3 size-7 rotate-180 text-white/80" />

          {!active && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
              <IconChip
                icon="🐰"
                tint="lavender"
                size="2xl"
                className="animate-float shadow-[0_10px_24px_-6px_rgba(0,0,0,0.5)]"
              />
              <span className="rounded-full bg-black/35 px-3 py-1 text-sm font-bold">Camera đang tắt</span>
            </div>
          )}

          {active && phase === "running" && (
            <div
              aria-hidden="true"
              className="exercise-scanline pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-(--color-mint)/0 via-(--color-mint)/25 to-(--color-mint)/0"
            />
          )}

          {phase === "running" && (
            <div className="absolute inset-x-3 top-3 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-center text-sm font-extrabold text-white transition-colors ${
                  isLowTime ? "animate-wiggle bg-(--color-bloom)" : "bg-black/40"
                }`}
              >
                ⏱️ {secondsLeft}s
              </span>
              {isHot && (
                <span className="animate-pop-in rounded-full bg-(--color-bloom) px-3 py-1 text-xs font-extrabold text-white shadow-[0_3px_0_#7a0e3a]">
                  🔥 Sắp xong!
                </span>
              )}
            </div>
          )}

          {phase === "won" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden bg-black/60 text-center text-white">
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                {CONFETTI.map((c, i) => (
                  <span
                    key={i}
                    className="exercise2-confetti absolute top-0 text-2xl"
                    style={{ left: c.left, animationDelay: c.delay }}
                  >
                    {c.emoji}
                  </span>
                ))}
              </span>

              <IconChip
                icon="🏆"
                tint="peach"
                size="xl"
                className="animate-pop-in relative shadow-[0_10px_22px_-6px_rgba(0,0,0,0.5)]"
              />
              <div className="relative mt-1 flex items-center gap-1.5">
                {CHEER_KIDS.map((kid, i) => (
                  <IconChip
                    key={kid}
                    icon={kid}
                    tint={TINT_ROTATION[i % TINT_ROTATION.length]}
                    size="md"
                    className={`shadow-[0_4px_10px_-3px_rgba(0,0,0,0.4)] ${i % 2 === 0 ? "animate-wiggle" : "animate-float"}`}
                  />
                ))}
              </div>
              <p className="font-display relative mt-1 text-2xl font-extrabold">Xuất sắc!</p>
              <p className="relative max-w-[14rem] text-sm text-white/80">Bạn đã vận động đủ năng lượng!</p>
            </div>
          )}

          {phase === "timeup" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 text-center text-white">
              <span className="animate-pop-in rounded-full bg-(--color-sun-dark) px-3 py-1 text-xs font-extrabold text-white">
                ⏰ Hết giờ rồi!
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="animate-float text-4xl" style={{ animationDelay: "0.2s" }}>
                  🧒
                </span>
                <IconChip icon="💪" tint="mint" size="lg" className="animate-wiggle shadow-[0_8px_18px_-4px_rgba(0,0,0,0.45)]" />
                <span className="animate-float text-4xl" style={{ animationDelay: "0.4s" }}>
                  👧
                </span>
              </div>
              <p className="font-display mt-1 text-xl font-extrabold">Cố lên nào!</p>
              <p className="max-w-[14rem] text-sm text-white/80">Hết giờ rồi, vận động nhiều hơn ở lượt sau nhé.</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xs">
        <div className="flex justify-between text-xs font-bold text-(--color-ink)/60">
          <span>⚡ Năng lượng</span>
          <span>{Math.round(energy)}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Năng lượng"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(energy)}
          className="relative mt-2 h-6 w-full overflow-hidden rounded-full border-2 border-(--color-ink)/10 bg-white shadow-[inset_0_2px_4px_rgba(46,42,33,0.12)]"
        >
          {/* Milestone ticks at 25/50/75% */}
          <span aria-hidden="true" className="absolute inset-y-1 left-1/4 w-px bg-(--color-ink)/10" />
          <span aria-hidden="true" className="absolute inset-y-1 left-1/2 w-px bg-(--color-ink)/10" />
          <span aria-hidden="true" className="absolute inset-y-1 left-3/4 w-px bg-(--color-ink)/10" />
          <span aria-hidden="true" className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs opacity-60">
            ⭐
          </span>

          <div
            className={`relative h-full rounded-full bg-gradient-to-r from-(--color-mint) to-(--color-mint-dark) transition-[width] duration-150 ${
              isHot ? "animate-glow" : ""
            }`}
            style={{ width: `${energy}%` }}
          >
            <span className="absolute inset-y-0.5 left-1 right-1 rounded-full bg-white/25" />
          </div>
          <div
            className="absolute -top-6 transition-[left] duration-150"
            style={{ left: `calc(${energy}% - 0.85rem)` }}
            aria-hidden="true"
          >
            <IconChip
              icon="🏃"
              tint="mint"
              size="sm"
              className={`shadow-[0_3px_8px_-2px_rgba(46,42,33,0.4)] ${isHot ? "animate-wiggle" : "animate-float"}`}
            />
          </div>
        </div>
      </div>

      {error && <p className="relative z-10 max-w-sm text-center text-sm font-bold text-(--color-bloom)">{error}</p>}

      <div className="relative z-10 flex gap-3">
        {phase === "idle" || phase === "won" || phase === "timeup" ? (
          <button
            type="button"
            onClick={handleStart}
            className="relative min-h-12 overflow-hidden rounded-full bg-(--color-mint) px-8 py-3 text-base font-extrabold text-white shadow-[0_5px_0_var(--color-mint-dark),0_12px_24px_-8px_rgba(184,73,46,0.55)] transition active:translate-y-1 active:shadow-[0_1px_0_var(--color-mint-dark)]"
          >
            <span aria-hidden="true" className="exercise2-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/35" />
            <span className="relative">{phase === "idle" ? "🎥 Bắt đầu vận động" : "🔁 Chơi lại"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="min-h-12 rounded-full border-2 border-(--color-ink)/15 bg-white px-8 py-3 text-base font-extrabold text-(--color-ink) shadow-[0_4px_0_rgba(46,42,33,0.08),0_10px_20px_-6px_rgba(46,42,33,0.18)] transition active:translate-y-1 active:shadow-[0_1px_0_rgba(46,42,33,0.08)]"
          >
            Dừng
          </button>
        )}
      </div>

      <p className="relative z-10 flex max-w-sm items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-center text-xs text-(--color-ink)/55">
        <span aria-hidden="true">🔒</span>
        Camera chỉ được xử lý ngay trên máy bạn để nhận diện chuyển động — không ghi hình hay gửi
        đi bất cứ đâu.
      </p>

      <style>{`
        @keyframes exercise-scanline-move {
          0% { transform: translateY(-4rem); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(20rem); opacity: 0; }
        }
        .exercise-scanline {
          animation: exercise-scanline-move 2.4s linear infinite;
        }

        /* Rotating soft gradient halo behind the camera frame while a round is running. */
        @keyframes exercise2-ring-spin {
          to { transform: rotate(360deg); }
        }
        .exercise2-ring {
          position: relative;
        }
        .exercise2-ring::before {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 2.75rem;
          background: conic-gradient(from 0deg, var(--color-mint), var(--color-mint-light), var(--color-mint-dark), var(--color-mint));
          filter: blur(3px);
          opacity: 0.85;
          z-index: 0;
          animation: exercise2-ring-spin 5s linear infinite;
        }

        /* Falling confetti pieces for the win celebration. */
        @keyframes exercise2-confetti-fall {
          0% { transform: translateY(-12px) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(170px) rotate(220deg); opacity: 0; }
        }
        .exercise2-confetti {
          animation: exercise2-confetti-fall 2.6s ease-in infinite;
        }

        /* One-shot sheen sweep across the primary CTA. */
        @keyframes exercise2-shine-move {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .exercise2-shine {
          animation: exercise2-shine-move 1.3s ease-out 0.2s;
        }

        @media (prefers-reduced-motion: reduce) {
          .exercise2-ring::before {
            animation: none;
            opacity: 0.5;
          }
          .exercise2-confetti {
            animation: none;
            opacity: 0.85;
          }
          .exercise2-shine {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
