import type { CSSProperties } from "react";

import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Ô Cửa Tuổi Thơ" — a row of storybook childhood doors down a soft corridor.
// Closed doors wait their turn; the current door stands ajar with a warm glow
// spilling through the gap; passed doors swing open to reveal a happy little
// surprise inside (a toy, a star, a balloon); and the big finish door at the
// end bursts wide open with light, confetti and spilling toys once the whole
// journey is complete. Reuses the engine's shared `animate-pop-in` /
// `animate-twinkle` / `animate-float` / `animate-glow` / `adv-ping` keyframes
// (defined once in AdventurePlayer.tsx, which always hosts this component) so
// motion language stays consistent across every theme scene; everything
// local to this file is prefixed `scene-doorway-` so it can never collide.

// What's peeking inside each opened door — plain childhood toys, cycled for
// variety across a long row.
const PEEK_ITEMS = ["🧸", "🪀", "🎈", "⭐", "🎁", "🪁", "🧩", "🚂"];

// Doors cycle through the shared mint → lavender → peach rotation (same trick
// as the mystery-door picker game and the Ô Ăn Quan board) so a long corridor
// reads as a row of distinct, colorful little doors rather than one color
// repeated endlessly — while the *current* and *finish* doors always use the
// theme's own tint so the spotlight still matches this theme's identity.
const DOOR_TINTS = ["mint", "lavender", "peach"] as const;

const CONFETTI: Array<{ tx: number; ty: number; delay: number; emoji: string }> = [
  { tx: -48, ty: -56, delay: 0, emoji: "🎊" },
  { tx: -18, ty: -74, delay: 60, emoji: "✨" },
  { tx: 16, ty: -72, delay: 130, emoji: "⭐" },
  { tx: 46, ty: -52, delay: 40, emoji: "🎉" },
  { tx: -36, ty: -26, delay: 170, emoji: "✨" },
  { tx: 36, ty: -24, delay: 100, emoji: "🎊" },
];

const SPILL_TOYS: Array<{ tx: number; delay: number; emoji: string }> = [
  { tx: -36, delay: 0, emoji: "🧸" },
  { tx: -12, delay: 90, emoji: "🎈" },
  { tx: 12, delay: 170, emoji: "🪀" },
  { tx: 36, delay: 50, emoji: "🪁" },
];

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const allAnswered = index >= total;

  return (
    <div className="relative overflow-x-auto rounded-3xl bg-gradient-to-b from-white/70 to-(--color-cloud) px-5 py-7 shadow-[inset_0_2px_6px_rgba(46,42,33,0.06)]">
      {/* ceiling string-lights along the corridor */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-3 flex justify-between">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="animate-twinkle size-1.5 rounded-full bg-(--color-sun) shadow-[0_0_6px_rgba(251,191,36,0.8)]"
            style={{ animationDelay: `${(i % 5) * 0.3}s` }}
          />
        ))}
      </div>

      <div className="relative mb-4 flex items-center justify-center gap-1.5">
        <span className="text-base">🚪</span>
        <span className={`font-display text-xs font-extrabold uppercase tracking-wide sm:text-sm ${tint.text}`}>
          Dãy cửa tuổi thơ
        </span>
      </div>

      <div className="relative flex min-w-max items-end justify-center gap-3 px-2 pb-1 [perspective:1300px] sm:gap-4">
        {steps.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const doorTint = TINT_STYLES[DOOR_TINTS[i % DOOR_TINTS.length]];
          const peek = PEEK_ITEMS[i % PEEK_ITEMS.length];

          return (
            <div
              key={i}
              className="relative h-28 w-16 shrink-0 overflow-hidden rounded-t-[1.4rem] rounded-b-lg border-[3px] border-white shadow-[0_6px_14px_-6px_rgba(46,42,33,0.3)] sm:h-32 sm:w-20"
            >
              {/* the little room behind the door, lit once it's been opened */}
              <div className={`absolute inset-0 ${done ? doorTint.bgLight : "bg-white/70"}`}>
                {done && (
                  <span className="animate-pop-in absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl">
                    {peek}
                  </span>
                )}
                {current && (
                  <>
                    <span
                      aria-hidden="true"
                      className="scene-doorway-beam absolute inset-y-1.5 left-1 w-3 rounded-full bg-gradient-to-b from-white via-(--color-sun) to-white/30 sm:w-4"
                    />
                    <span aria-hidden="true" className="animate-twinkle absolute left-2 top-3 text-sm sm:text-base">
                      ✨
                    </span>
                  </>
                )}
              </div>

              {/* a warm ring that pulses around the door currently being asked about */}
              {current && (
                <span
                  aria-hidden="true"
                  className="adv-ping absolute inset-0 rounded-t-[1.4rem] rounded-b-lg border-2"
                  style={{ borderColor: tint.shadowDark }}
                />
              )}

              {/* the door leaf: flat closed, ajar for the current step, swung open once passed */}
              <div
                className="absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-500 ease-out"
                style={{ transform: done ? "rotateY(-108deg)" : current ? "rotateY(-34deg)" : "rotateY(0deg)" }}
              >
                <div
                  className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-t-[1.4rem] rounded-b-lg border-[3px] border-white bg-gradient-to-b [backface-visibility:hidden] ${
                    current ? `${tint.gradient} scene-doorway-ajar animate-glow` : doorTint.gradient
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-white text-[9px] font-extrabold text-(--color-ink)/70 shadow-sm sm:size-5 sm:text-[10px]"
                  >
                    {i + 1}
                  </span>
                  <span aria-hidden="true" className="absolute inset-x-2.5 top-2.5 h-7 rounded-lg border-2 border-white/35 sm:h-9" />
                  <span
                    aria-hidden="true"
                    className="absolute right-2 top-1/2 size-2 -translate-y-1/2 rounded-full bg-(--color-sun) shadow-[inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
                  />
                  <span className={`relative text-3xl drop-shadow-[0_2px_2px_rgba(46,42,33,0.25)] sm:text-4xl ${current ? "animate-float" : ""}`}>
                    {current ? theme.mascot : "🚪"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* the big finish door at the end of the corridor */}
        <div className="relative h-32 w-20 shrink-0 overflow-hidden rounded-t-[1.9rem] rounded-b-lg border-[3px] border-white shadow-[0_8px_18px_-6px_rgba(46,42,33,0.32)] sm:h-40 sm:w-24">
          <div className={`absolute inset-0 ${finished ? "bg-white" : "bg-white/70"}`}>
            {finished && (
              <>
                <span aria-hidden="true" className="scene-doorway-flood absolute inset-0 bg-white" />
                {CONFETTI.map((c, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="scene-doorway-confetti absolute left-1/2 top-[38%] text-base sm:text-lg"
                    style={{ "--tx": `${c.tx}px`, "--ty": `${c.ty}px`, animationDelay: `${c.delay}ms` } as CSSProperties}
                  >
                    {c.emoji}
                  </span>
                ))}
                {SPILL_TOYS.map((t, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="scene-doorway-spill absolute top-1/2 text-lg sm:text-xl"
                    style={{ left: `calc(50% + ${t.tx}px)`, animationDelay: `${t.delay}ms` } as CSSProperties}
                  >
                    {t.emoji}
                  </span>
                ))}
              </>
            )}
          </div>

          {!finished && (allAnswered || total === 0) && (
            <span
              aria-hidden="true"
              className="adv-ping absolute inset-0 rounded-t-[1.9rem] rounded-b-lg border-2"
              style={{ borderColor: tint.shadowDark }}
            />
          )}

          <div
            className="absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-700 ease-out"
            style={{ transform: finished ? "rotateY(-140deg)" : "rotateY(0deg)" }}
          >
            <div
              className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-t-[1.9rem] rounded-b-lg border-[3px] border-white bg-gradient-to-b [backface-visibility:hidden] ${tint.gradient} ${
                !finished && (allAnswered || total === 0) ? "animate-glow" : ""
              }`}
            >
              <span aria-hidden="true" className="absolute inset-x-3 top-3 h-10 rounded-xl border-2 border-white/35 sm:h-14" />
              <span
                aria-hidden="true"
                className="absolute right-2.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-(--color-sun) shadow-[inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
              />
              <span
                className={`relative text-4xl drop-shadow-[0_3px_3px_rgba(46,42,33,0.25)] sm:text-5xl ${
                  !finished && (allAnswered || total === 0) ? "animate-float" : ""
                }`}
              >
                {theme.finishIcon}
              </span>
            </div>
          </div>

          {finished && (
            <span className="animate-pop-in absolute inset-x-0 bottom-2 flex justify-center text-3xl sm:text-4xl">
              {theme.mascot}
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scene-doorway-ajar-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.1); }
        }
        .scene-doorway-ajar { animation: scene-doorway-ajar-glow 2.2s ease-in-out infinite; }

        @keyframes scene-doorway-beam-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        .scene-doorway-beam { animation: scene-doorway-beam-pulse 1.8s ease-in-out infinite; }

        @keyframes scene-doorway-flood-flash {
          0% { opacity: 0.95; }
          100% { opacity: 0; }
        }
        .scene-doorway-flood { animation: scene-doorway-flood-flash 0.9s ease-out forwards; }

        @keyframes scene-doorway-confetti-burst {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
        .scene-doorway-confetti { animation: scene-doorway-confetti-burst 900ms ease-out forwards; }

        @keyframes scene-doorway-spill-fall {
          0% { transform: translateY(-10px) scale(0.3) rotate(-10deg); opacity: 0; }
          25% { opacity: 1; transform: translateY(0) scale(1.1) rotate(8deg); }
          100% { transform: translateY(28px) scale(0.9) rotate(-6deg); opacity: 0; }
        }
        .scene-doorway-spill { animation: scene-doorway-spill-fall 1.1s ease-in forwards; }

        @media (prefers-reduced-motion: reduce) {
          .scene-doorway-ajar,
          .scene-doorway-beam,
          .scene-doorway-flood,
          .scene-doorway-confetti,
          .scene-doorway-spill {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
