"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner, GAME_ACCENTS, candyButtonClass, GameStageBackdrop, CheerSquad } from "./RevealBanner";
import { IconChip } from "@/components/IconChip";
import type { PickerStudent } from "../../usePicker";

const accent = GAME_ACCENTS.mint;
const SLICE_COLORS = ["var(--color-mint)", "var(--color-sun)", "var(--color-lavender)", "var(--color-peach)"];
// Small fixed-count "marquee lights" mounted on the wheel's cabinet rim — purely
// decorative, independent of how many students are in the pool.
const RIM_BULB_COUNT = 10;

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
  const gradientStops = remaining
    .map((_, i) => {
      const color = SLICE_COLORS[i % SLICE_COLORS.length];
      const start = (i * 360) / poolSize;
      const end = ((i + 1) * 360) / poolSize;
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");
  // Thin white spokes marking each slice boundary — rotates together with the
  // wheel since it lives inside the same transformed element.
  const spokeLines =
    poolSize > 1
      ? `repeating-conic-gradient(rgba(255,255,255,0.85) 0deg 0.6deg, transparent 0.6deg ${sliceAngle}deg)`
      : undefined;

  const canSpin = !spinning && !isExhausted;
  const landed = Boolean(current) && !spinning;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)]">
      <GameStageBackdrop accent={accent} />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center gap-1 sm:gap-5">
          <span
            aria-hidden="true"
            className="wheelgame-mascot-sway hidden text-5xl drop-shadow-[0_4px_4px_rgba(46,42,33,0.2)] sm:block"
          >
            🐰
          </span>

          <div className="relative h-64 w-64 shrink-0">
            {/* Confetti burst on landing — purely decorative, reuses the site's global twinkle/pop-in motion. */}
            {landed && (
              <div aria-hidden="true" className="pointer-events-none absolute -inset-6">
                <span className="animate-twinkle absolute left-0 top-2 text-2xl">🎊</span>
                <span className="animate-twinkle absolute right-0 top-4 text-2xl" style={{ animationDelay: "0.2s" }}>
                  ✨
                </span>
                <span className="animate-twinkle absolute bottom-2 left-4 text-2xl" style={{ animationDelay: "0.4s" }}>
                  ✨
                </span>
                <span className="animate-twinkle absolute bottom-0 right-6 text-2xl" style={{ animationDelay: "0.6s" }}>
                  🎉
                </span>
              </div>
            )}

            {/* Pointer */}
            <div
              aria-hidden="true"
              className={`absolute left-1/2 top-[-20px] z-20 -translate-x-1/2 ${
                spinning ? "wheelgame-pointer-tick" : "animate-float"
              }`}
            >
              <svg width="38" height="44" viewBox="0 0 38 44" className="drop-shadow-[0_4px_4px_rgba(46,42,33,0.35)]">
                <defs>
                  <linearGradient id="wheelgame-pointer-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-sun)" />
                    <stop offset="100%" stopColor="var(--color-sun-dark)" />
                  </linearGradient>
                </defs>
                <path
                  d="M19 44C19 44 2 23.5 2 14.5A17 17 0 1 1 36 14.5C36 23.5 19 44 19 44Z"
                  fill="url(#wheelgame-pointer-grad)"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <circle cx="19" cy="15" r="5.5" fill="white" opacity="0.9" />
              </svg>
            </div>

            {/* Rim marquee lights (fixed to the cabinet, do not spin with the disc) */}
            {Array.from({ length: RIM_BULB_COUNT }).map((_, i) => {
              const angle = (360 / RIM_BULB_COUNT) * i;
              const rad = (angle * Math.PI) / 180;
              const r = 122;
              const x = 128 + r * Math.sin(rad);
              const y = 128 - r * Math.cos(rad);
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  className="animate-twinkle absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: x,
                    top: y,
                    backgroundColor: i % 2 === 0 ? "var(--color-sun)" : "white",
                    boxShadow: "0 0 6px 1px rgba(251,191,36,0.55)",
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              );
            })}

            <div
              className="relative h-64 w-64 rounded-full border-[6px] border-white shadow-[0_10px_28px_-8px_rgba(46,42,33,0.35)]"
              style={{
                background: poolSize > 0 ? `conic-gradient(${gradientStops})` : "var(--color-cloud)",
                transform: `rotate(${rotation}deg)`,
                transition: "transform 2.6s cubic-bezier(0.17,0.67,0.12,1)",
              }}
            >
              {spokeLines && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ background: spokeLines }}
                />
              )}
              {remaining.map((s, i) => {
                const angle = sliceAngle * i + sliceAngle / 2 - 90;
                const rad = (angle * Math.PI) / 180;
                const radius = 95;
                const x = 128 + radius * Math.cos(rad);
                const y = 128 + radius * Math.sin(rad);
                return (
                  <span
                    key={s.id}
                    className="absolute w-[70px] -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                    style={{ left: x, top: y }}
                  >
                    {s.fullName}
                  </span>
                );
              })}
              <div className="absolute inset-[38%] rounded-full bg-white shadow-[inset_0_2px_6px_rgba(46,42,33,0.15)]" />
            </div>

            {/* Center hub icon — stays upright (rendered outside the rotating disc) */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <IconChip
                key={current ? current.id : "idle"}
                icon="⭐"
                tint="mint"
                size="sm"
                className={`shadow-[0_3px_8px_-2px_rgba(46,42,33,0.3)] ${landed ? "animate-cell-bounce" : spinning ? "" : "animate-float"}`}
              />
            </div>
          </div>

          <span
            aria-hidden="true"
            className="wheelgame-mascot-sway hidden text-5xl drop-shadow-[0_4px_4px_rgba(46,42,33,0.2)] sm:block"
            style={{ animationDelay: "0.9s" }}
          >
            🐻
          </span>
        </div>

        {!current && !spinning && <CheerSquad seed={0} />}

        <button
          onClick={handleSpin}
          disabled={spinning || isExhausted}
          className={`relative overflow-hidden ${candyButtonClass(accent, spinning || isExhausted)} ${canSpin ? "animate-glow" : ""}`}
        >
          <span aria-hidden="true" className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30" />
          <span className={`mr-1 inline-block ${spinning ? "wheelgame-icon-spin" : "animate-wiggle"}`} aria-hidden="true">
            🎡
          </span>
          {spinning ? "Đang quay..." : "Quay vòng quay!"}
        </button>

        <RevealBanner student={current} />
      </div>

      <style>{`
        @keyframes wheelgame-pointer-tick {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(3px) rotate(-6deg); }
        }
        .wheelgame-pointer-tick {
          animation: wheelgame-pointer-tick 0.35s ease-in-out infinite;
        }

        @keyframes wheelgame-icon-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .wheelgame-icon-spin {
          display: inline-block;
          animation: wheelgame-icon-spin 0.9s linear infinite;
        }

        @keyframes wheelgame-mascot-sway {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-6px) rotate(4deg); }
        }
        .wheelgame-mascot-sway {
          animation: wheelgame-mascot-sway 3.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .wheelgame-pointer-tick,
          .wheelgame-icon-spin,
          .wheelgame-mascot-sway {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
