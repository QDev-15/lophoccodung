"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { GAME_ACCENTS, ghostButtonClass, GameStageBackdrop, CheerSquad } from "./RevealBanner";
import { IconChip } from "@/components/IconChip";
import type { PickerStudent } from "../../usePicker";

const accent = GAME_ACCENTS.sun;
const BUBBLE_COUNT = 8;

// Soft glassy bubble tints, cycling the project's standard mint → lavender → peach
// rotation (plus a sparing sun accent) for "one of several equal items." Each entry
// also carries a warm-tinted (never pure-black) shadow color for that bubble.
const BUBBLE_TINTS = [
  { glass: "from-(--color-mint-light) to-white", ring: "border-(--color-mint)/60", glow: "rgba(248,183,147,0.55)" },
  { glass: "from-violet-100 to-white", ring: "border-(--color-lavender)/50", glow: "rgba(139,92,246,0.45)" },
  { glass: "from-emerald-50 to-white", ring: "border-(--color-peach)/45", glow: "rgba(21,128,61,0.35)" },
  { glass: "from-amber-50 to-white", ring: "border-(--color-sun)/60", glow: "rgba(251,191,36,0.5)" },
];

// Small, flavor-agnostic mascot pair that flanks the reveal — this component is reused
// under several themed picker entries, so it never names a specific theme.
const MASCOTS: Array<{ icon: string; tint: "mint" | "lavender" }> = [
  { icon: "🐰", tint: "mint" },
  { icon: "🐻", tint: "lavender" },
];

// Ambient decorative mini-bubbles rising behind the stage (purely cosmetic).
const AMBIENT_BUBBLES = [
  { left: 8, size: 10, delay: 0 },
  { left: 24, size: 16, delay: 1.1 },
  { left: 48, size: 9, delay: 2.4 },
  { left: 70, size: 14, delay: 0.6 },
  { left: 88, size: 11, delay: 3.2 },
];

export function BubbleGame({ pick, isExhausted }: GameComponentProps) {
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const [student, setStudent] = useState<PickerStudent | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  function handlePop(i: number) {
    if (poppedIndex !== null || isExhausted) return;
    const result = pick();
    if (!result) return;
    setPoppedIndex(i);
    setStudent(result.student);
    setBurstKey((k) => k + 1);
  }

  function handleReset() {
    setPoppedIndex(null);
    setStudent(null);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)]">
      <style>{`
        @keyframes bubblegame-bob {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-9px) translateX(2px); }
        }
        .bubblegame-bob { animation: bubblegame-bob 3.2s ease-in-out infinite; }

        @keyframes bubblegame-pop-burst {
          0% { transform: scale(0.5); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .bubblegame-pop-burst { animation: bubblegame-pop-burst 0.55s ease-out both; }

        @keyframes bubblegame-rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          12% { opacity: 0.55; }
          85% { opacity: 0.3; }
          100% { transform: translateY(-160px) scale(1.4); opacity: 0; }
        }
        .bubblegame-rise { animation: bubblegame-rise 7s ease-in-out infinite; }

        .bubblegame-mascot-delay { animation-delay: 0.15s; }

        @media (prefers-reduced-motion: reduce) {
          .bubblegame-bob,
          .bubblegame-pop-burst,
          .bubblegame-rise {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <GameStageBackdrop accent={accent} />

      {/* Ambient rising mini-bubbles, purely decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
        {AMBIENT_BUBBLES.map((b) => (
          <span
            key={b.left}
            className="bubblegame-rise absolute bottom-0 rounded-full bg-white/60"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="grid grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
            const isPopped = poppedIndex === i;
            const locked = poppedIndex !== null && !isPopped;
            const canPop = poppedIndex === null && !isExhausted;
            const tint = BUBBLE_TINTS[i % BUBBLE_TINTS.length];
            return (
              <button
                key={i}
                type="button"
                onClick={() => handlePop(i)}
                disabled={poppedIndex !== null || isExhausted}
                aria-label={isPopped && student ? `Đã chọn ${student.fullName}` : "Chạm để làm nổ bong bóng"}
                className={`relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] bg-gradient-to-br shadow-[0_8px_18px_-6px_var(--bubble-glow)] transition-all duration-300 disabled:cursor-not-allowed sm:h-24 sm:w-24 ${tint.glass} ${tint.ring} ${
                  canPop ? "bubblegame-bob hover:brightness-105" : ""
                }`}
                style={
                  {
                    "--bubble-glow": tint.glow,
                    transform: isPopped ? "scale(1.5)" : undefined,
                    opacity: locked ? 0.2 : 1,
                    animationDelay: canPop ? `${i * 0.18}s` : undefined,
                  } as React.CSSProperties
                }
              >
                {/* Glossy highlight, like light on a soap bubble. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-2 h-5 w-5 rounded-full bg-white/70 blur-[2px] sm:h-6 sm:w-6"
                />

                {isPopped ? (
                  <>
                    <span
                      key={burstKey}
                      aria-hidden="true"
                      className="bubblegame-pop-burst pointer-events-none absolute inset-0 rounded-full border-[3px] border-white"
                    />
                    <span aria-hidden="true" className="animate-twinkle absolute -right-1.5 -top-1.5 text-sm">
                      ✨
                    </span>
                    <span className="relative px-1 text-center text-xs font-extrabold leading-tight text-(--color-ink) sm:text-sm">
                      {student?.fullName}
                    </span>
                  </>
                ) : (
                  <span className="relative text-4xl sm:text-5xl">🫧</span>
                )}
              </button>
            );
          })}
        </div>

        {poppedIndex !== null ? (
          <div className="animate-pop-in flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_6px_16px_-6px_rgba(46,42,33,0.3)]">
              <IconChip icon={MASCOTS[0].icon} tint={MASCOTS[0].tint} size="sm" className="animate-wiggle" />
              <p className="font-display px-1 text-base font-extrabold text-(--color-ink) sm:text-lg">
                🎉 {student?.fullName}
              </p>
              <IconChip
                icon={MASCOTS[1].icon}
                tint={MASCOTS[1].tint}
                size="sm"
                className="animate-wiggle bubblegame-mascot-delay"
              />
            </div>
            <button type="button" onClick={handleReset} disabled={isExhausted} className={ghostButtonClass()}>
              🫧 Bong bóng mới
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <CheerSquad seed={0} />
            <p className="font-display text-base font-bold text-(--color-ink)/60">
              🫧 Chạm vào một bong bóng để làm nó vỡ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
