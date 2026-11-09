"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { GAME_ACCENTS, ghostButtonClass, GameStageBackdrop, type GameAccent } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";
import { IconChip } from "@/components/IconChip";

// Overall screen accent (backdrop glow, prompt text, CTA) — stays the single
// dominant primary color for this screen, per the mint→lavender→peach rule.
const accent = GAME_ACCENTS.mint;
const STICK_COUNT = 8;

// Individual sticks cycle mint → lavender → peach as "several equal items" —
// `sun` is kept out of this rotation and reserved for the sparing sparkle accent.
const STICK_TINTS: GameAccent[] = [GAME_ACCENTS.mint, GAME_ACCENTS.lavender, GAME_ACCENTS.peach];
const STICK_GLOW_VAR = ["--color-mint", "--color-lavender", "--color-peach"];

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
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)]">
      <GameStageBackdrop accent={accent} />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <IconChip
          icon="🥢"
          tint="mint"
          size="2xl"
          className="stickdraw-idle-float shadow-[0_8px_20px_-6px_rgba(184,73,46,0.4)]"
        />

        {/* Holder + two curious mascots peeking from either side — kept present
            throughout (not just on reveal) but small and quiet. */}
        <div className="relative mt-1">
          <span aria-hidden="true" className="animate-float absolute -bottom-1 -left-5 text-4xl sm:-left-6 sm:text-5xl">
            🐰
          </span>
          <span
            aria-hidden="true"
            className="animate-float absolute -bottom-1 -right-5 text-4xl sm:-right-6 sm:text-5xl"
            style={{ animationDelay: "0.5s" }}
          >
            🦊
          </span>

          <div className="relative z-10 overflow-x-auto">
            <div
              className={`relative mx-auto flex min-w-fit items-end justify-center gap-2.5 rounded-t-[1.25rem] rounded-b-[3rem] border-4 border-(--color-mint-dark)/25 bg-gradient-to-b from-white to-(--color-mint-light)/70 px-6 pb-5 pt-7 shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),0_12px_28px_-10px_rgba(46,42,33,0.35)] sm:gap-3 sm:px-8 ${
                pulled === null ? "stickdraw-sway" : ""
              }`}
              style={{ transformOrigin: "bottom center" }}
            >
              <span aria-hidden="true" className="absolute inset-x-6 top-1.5 h-2 rounded-full bg-white/70" />

              {Array.from({ length: STICK_COUNT }).map((_, i) => {
                const isPulled = pulled === i;
                const locked = pulled !== null && !isPulled;
                const tint = STICK_TINTS[i % STICK_TINTS.length];
                const canClick = pulled === null && !isExhausted;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePull(i)}
                    disabled={pulled !== null || isExhausted}
                    aria-label={`Que thăm số ${i + 1}`}
                    className={`group relative flex min-h-11 min-w-11 flex-col items-center justify-end pt-2 transition disabled:cursor-not-allowed ${
                      locked ? "opacity-30" : canClick ? "hover:-translate-y-1 active:scale-95" : ""
                    }`}
                  >
                    <span className={`flex flex-col items-center ${isPulled ? "stickdraw-rise" : ""}`}>
                      {isPulled && student && (
                        <span
                          className={`animate-pop-in mb-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm ${tint.bgDark}`}
                        >
                          {student.fullName}
                        </span>
                      )}

                      <span className="relative flex items-center justify-center">
                        {isPulled && (
                          <span
                            aria-hidden="true"
                            className="animate-twinkle absolute -inset-2.5 rounded-full blur-sm"
                            style={{ background: `var(${STICK_GLOW_VAR[i % STICK_GLOW_VAR.length]})` }}
                          />
                        )}
                        <span
                          className={`relative block size-5 rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.25),inset_1px_1px_1px_rgba(255,255,255,0.65),0_2px_4px_-1px_rgba(46,42,33,0.35)] ${
                            locked ? "bg-(--color-ink)/15" : `bg-gradient-to-br ${tint.gradient}`
                          }`}
                        />
                      </span>

                      <span
                        className={`h-24 w-3 rounded-full shadow-[0_3px_6px_-2px_rgba(46,42,33,0.3)] sm:h-28 sm:w-3.5 ${
                          locked
                            ? "bg-(--color-ink)/15"
                            : `bg-gradient-to-b ${tint.gradient} ${canClick ? "group-hover:brightness-110" : ""}`
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {pulled !== null && student ? (
          <div className="animate-pop-in relative flex flex-col items-center gap-4 rounded-[1.75rem] bg-gradient-to-br from-(--color-mint-light)/70 via-white to-(--color-mint-light)/40 px-8 py-6 text-center shadow-[0_10px_28px_-10px_rgba(184,73,46,0.4)]">
            <span aria-hidden="true" className="animate-twinkle absolute left-4 top-3 text-2xl">
              🎊
            </span>
            <span
              aria-hidden="true"
              className="animate-twinkle absolute right-4 top-4 text-xl"
              style={{ animationDelay: "0.3s" }}
            >
              ✨
            </span>

            <div className="flex items-center gap-3">
              <span className="animate-wiggle text-5xl">🐰</span>
              <div className="flex flex-col items-center gap-1">
                <span className={`text-xs font-extrabold uppercase tracking-wide ${accent.text}`}>Đã chọn được</span>
                <p className="font-display text-2xl font-extrabold text-(--color-ink) sm:text-3xl">
                  🎉 {student.fullName}
                </p>
              </div>
              <span className="animate-wiggle text-5xl" style={{ animationDelay: "0.2s" }}>
                🦊
              </span>
            </div>

            <button onClick={handleReset} disabled={isExhausted} className={ghostButtonClass()}>
              🔄 Rút que tiếp
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <p className="font-display text-base font-bold text-(--color-ink)/60">
              👉 Chọn một que thăm để kéo lên nhé!
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes stickdraw-rise {
          0% { transform: translateY(0) rotate(0deg); }
          55% { transform: translateY(-42px) rotate(-6deg); }
          75% { transform: translateY(-30px) rotate(4deg); }
          100% { transform: translateY(-34px) rotate(0deg); }
        }
        .stickdraw-rise {
          animation: stickdraw-rise 0.5s var(--ease-bounce) both;
        }

        @keyframes stickdraw-sway {
          0%, 100% { transform: rotate(-1.2deg); }
          50% { transform: rotate(1.2deg); }
        }
        .stickdraw-sway {
          animation: stickdraw-sway 3.6s ease-in-out infinite;
        }

        @keyframes stickdraw-idle-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        .stickdraw-idle-float {
          animation: stickdraw-idle-float 3.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .stickdraw-rise,
          .stickdraw-sway,
          .stickdraw-idle-float {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
