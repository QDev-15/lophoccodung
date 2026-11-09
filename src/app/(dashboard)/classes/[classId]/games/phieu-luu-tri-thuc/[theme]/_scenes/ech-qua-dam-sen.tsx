import { TINT_STYLES, type TintStyle } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for "Ếch qua đầm sen" (frog hopping across a lotus pond).
// No illustration assets exist in this codebase, so the pond, lily pads,
// lotus bloom, dragonflies and reeds below are all hand-rolled inline SVG +
// CSS, in the same spirit as the village/basket art in OAnQuanGame.tsx.
// Brand colors (the current theme's tint) are only used where this scene
// needs to stay visually tied to the shared header chip/buttons — the pond
// itself (water, lily pads, lotus petals, reeds, dragonflies) uses its own
// decorative palette, the same way OAnQuanGame hardcodes its wood/basket hues.

const WATER = {
  padFill: { upcoming: "#8fd184", done: "#5fb35a", current: "#74c768" },
  padEdge: "#2f6b34",
  padGloss: "rgba(255,255,255,0.35)",
};

const ZIGZAG = [0, -12, 8, -6];

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const shown = Math.min(index, total);
  const midLeap = total > 0 && index >= total && !finished;

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-[inset_0_2px_6px_rgba(46,42,33,0.08)]">
      {/* --- water backdrop -------------------------------------------------- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#eaf8fb] via-[#bfe9f0] to-[#7cc9db]"
      />
      <div
        aria-hidden="true"
        className="scene-ech-shimmer absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 12px 14px, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 2px, transparent 3px, transparent 26px)",
        }}
      />
      <div aria-hidden="true" className="absolute -top-8 right-10 size-28 rounded-full bg-(--color-sun)/30 blur-2xl" />
      <div aria-hidden="true" className="absolute left-10 top-1 h-6 w-24 rounded-full bg-white/50 blur-md" />

      <Reeds aria-hidden className="absolute -bottom-1 left-1 h-16 w-9 opacity-80 sm:h-20 sm:w-11" />
      <Reeds aria-hidden flip className="absolute -bottom-1 right-2 h-20 w-10 opacity-70 sm:h-24 sm:w-12" />

      <Dragonfly
        aria-hidden
        className="scene-ech-dragonfly-a absolute left-[18%] top-5 h-5 w-9 opacity-80 sm:h-6 sm:w-11"
      />
      <Dragonfly
        aria-hidden
        className="scene-ech-dragonfly-b absolute right-[26%] top-9 h-4 w-8 opacity-70 sm:h-5 sm:w-9"
      />

      {/* --- progress chip (ties back to the shared theme tint) ------------- */}
      <div
        className={`absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold shadow-sm ${tint.bgLight} ${tint.text}`}
      >
        <span aria-hidden="true">🐸</span> {finished ? total : shown}/{total} lá sen
      </div>

      {/* --- the hop trail ---------------------------------------------------- */}
      <div className="relative z-10 overflow-x-auto px-6 pb-7 pt-14">
        <div className="relative flex min-w-max items-center gap-5 px-2 sm:gap-7">
          {steps.map((_, i) => {
            const done = i < index;
            const current = i === index && !finished;
            const offset = current ? 0 : ZIGZAG[i % ZIGZAG.length];

            if (current) {
              return (
                <div key={i} className="relative flex shrink-0 flex-col items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="scene-ech-ripple absolute size-16 rounded-full border-2 border-white/70 sm:size-20"
                  />
                  <span
                    aria-hidden="true"
                    className="scene-ech-ripple absolute size-16 rounded-full border-2 border-white/70 sm:size-20"
                    style={{ animationDelay: "0.7s" }}
                  />
                  <div className="relative size-20 sm:size-24">
                    <LilyPad tone="current" className="absolute inset-0 drop-shadow-[0_6px_10px_rgba(47,107,52,0.35)]" />
                    <span
                      aria-hidden="true"
                      className="adv-ping absolute inset-0 rounded-full border-2"
                      style={{ borderColor: tint.shadowDark }}
                    />
                    <span className="scene-ech-hop absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl">
                      {theme.mascot}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={i}
                className={`relative flex shrink-0 items-center justify-center ${
                  done ? "size-12 sm:size-14" : "size-10 opacity-75 sm:size-12"
                }`}
                style={{ transform: `translateY(${offset}px)` }}
              >
                <span
                  aria-hidden="true"
                  className="scene-ech-bob absolute inset-0"
                  style={{ animationDelay: `${(i % 4) * 0.35}s` }}
                >
                  <LilyPad tone={done ? "done" : "upcoming"} className="size-full" />
                </span>
                {done && (
                  <span
                    className={`absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-(--color-mint-dark) shadow-sm ring-2 ${tint.ring}`}
                  >
                    ✓
                  </span>
                )}
              </div>
            );
          })}

          {/* --- lotus finish line ------------------------------------------- */}
          <div className="relative flex shrink-0 flex-col items-center justify-center pl-1">
            {finished && (
              <>
                <Sparkle className="absolute -left-2 -top-2 text-lg" delay="0s" />
                <Sparkle className="absolute -right-3 top-0 text-xl" delay="0.3s" />
                <Sparkle className="absolute -bottom-1 left-1 text-base" delay="0.6s" />
                <Dragonfly className="scene-ech-dragonfly-a absolute -right-8 -top-6 h-5 w-9" aria-hidden />
              </>
            )}
            <div className={`relative flex items-center justify-center ${finished ? "size-24 sm:size-28" : "size-16 sm:size-20"}`}>
              <LotusFlower bloom={finished} className="absolute inset-0 drop-shadow-[0_8px_14px_rgba(173,20,87,0.25)]" />
              {finished && (
                <span
                  aria-hidden="true"
                  className="adv-ping absolute inset-0 rounded-full border-2"
                  style={{ borderColor: tint.shadowDark }}
                />
              )}
              <span
                className={`relative text-3xl sm:text-4xl ${
                  finished ? "animate-pop-in" : midLeap ? "scene-ech-leap" : ""
                }`}
              >
                {finished || midLeap ? theme.mascot : theme.finishIcon}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scene-ech-hop {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-6px) scaleY(1.04); }
        }
        .scene-ech-hop { animation: scene-ech-hop 1.5s ease-in-out infinite; }

        @keyframes scene-ech-ripple {
          0% { transform: scale(0.35); opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .scene-ech-ripple { animation: scene-ech-ripple 1.8s ease-out infinite; }

        @keyframes scene-ech-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .scene-ech-bob { display: block; animation: scene-ech-bob 3s ease-in-out infinite; }

        @keyframes scene-ech-dragonfly-a {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(8px, -5px) rotate(10deg); }
          50% { transform: translate(2px, -10px) rotate(-6deg); }
          75% { transform: translate(-6px, -4px) rotate(6deg); }
        }
        .scene-ech-dragonfly-a { animation: scene-ech-dragonfly-a 4.2s ease-in-out infinite; }

        @keyframes scene-ech-dragonfly-b {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-7px, -6px) rotate(-8deg); }
          60% { transform: translate(-2px, -11px) rotate(5deg); }
          85% { transform: translate(5px, -3px) rotate(-4deg); }
        }
        .scene-ech-dragonfly-b { animation: scene-ech-dragonfly-b 3.6s ease-in-out infinite; }

        @keyframes scene-ech-leap {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-16px) rotate(6deg); }
        }
        .scene-ech-leap { display: inline-block; animation: scene-ech-leap 0.8s ease-in-out infinite; }

        @keyframes scene-ech-shimmer {
          0%, 100% { background-position: 0 0; }
          50% { background-position: 10px 14px; }
        }
        .scene-ech-shimmer { animation: scene-ech-shimmer 6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .scene-ech-hop,
          .scene-ech-ripple,
          .scene-ech-bob,
          .scene-ech-dragonfly-a,
          .scene-ech-dragonfly-b,
          .scene-ech-leap,
          .scene-ech-shimmer {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Decorative pieces — plain SVG/CSS, no illustration assets exist for this
// theme so everything below is hand-rolled.
// ---------------------------------------------------------------------------

function LilyPad({ tone, className }: { tone: "upcoming" | "done" | "current"; className?: string }) {
  const fill = WATER.padFill[tone];
  return (
    <svg viewBox="0 0 100 100" className={className} role="presentation" aria-hidden="true">
      <path
        d="M50,54 L85,35 A40,40 0 1 1 73,21 Z"
        fill={fill}
        stroke={WATER.padEdge}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M50,54 Q40,38 27,30" stroke={WATER.padEdge} strokeWidth="2" fill="none" opacity="0.45" />
      <path d="M50,54 Q46,30 50,16" stroke={WATER.padEdge} strokeWidth="2" fill="none" opacity="0.45" />
      <path d="M50,54 Q34,62 14,58" stroke={WATER.padEdge} strokeWidth="2" fill="none" opacity="0.45" />
      <path d="M50,54 Q58,70 48,88" stroke={WATER.padEdge} strokeWidth="2" fill="none" opacity="0.45" />
      <ellipse cx="38" cy="42" rx="7" ry="4" fill={WATER.padGloss} />
    </svg>
  );
}

function LotusFlower({ bloom, className }: { bloom?: boolean; className?: string }) {
  const petals = bloom ? 8 : 5;
  const len = bloom ? 34 : 23;
  return (
    <svg viewBox="0 0 100 100" className={className} role="presentation" aria-hidden="true">
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i;
        return (
          <ellipse
            key={i}
            cx="50"
            cy={50 - len * 0.55}
            rx="11"
            ry={len}
            fill={i % 2 === 0 ? "#ffd2de" : "#ff8fab"}
            stroke="#e8628a"
            strokeWidth="1.5"
            opacity="0.95"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <circle cx="50" cy="50" r="13" fill="var(--color-sun)" stroke="var(--color-sun-dark)" strokeWidth="2" />
      {[[-5, -4], [5, -4], [0, 0], [-6, 5], [6, 5], [0, -7]].map(([dx, dy], i) => (
        <circle key={i} cx={50 + dx} cy={50 + dy} r="1.6" fill="var(--color-sun-dark)" opacity="0.7" />
      ))}
    </svg>
  );
}

function Reeds({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 90"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="presentation"
      aria-hidden="true"
    >
      <path d="M10,90 C8,60 6,40 9,10" fill="none" stroke="#3f8a42" strokeWidth="3" strokeLinecap="round" />
      <path d="M22,90 C21,55 24,35 20,6" fill="none" stroke="#2f7a38" strokeWidth="3" strokeLinecap="round" />
      <path d="M10,70 C2,65 -2,55 2,46" fill="none" stroke="#3f8a42" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22,66 C30,60 33,50 29,42" fill="none" stroke="#2f7a38" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="9" cy="8" rx="3.2" ry="8" fill="#6b4a2f" />
      <ellipse cx="20" cy="4" rx="3" ry="7.5" fill="#5a3c25" />
    </svg>
  );
}

function Dragonfly({ className, ...rest }: { className?: string; "aria-hidden"?: boolean }) {
  return (
    <svg viewBox="0 0 60 30" className={className} role="presentation" aria-hidden="true" {...rest}>
      <circle cx="8" cy="15" r="3.5" fill="#1d4e89" />
      <rect x="10" y="13" width="38" height="3" rx="1.5" fill="#2b6cb0" />
      <circle cx="50" cy="14.5" r="1.4" fill="#2b6cb0" />
      <ellipse cx="20" cy="6" rx="14" ry="4.5" fill="#cfe8ff" opacity="0.6" transform="rotate(-8 20 6)" />
      <ellipse cx="20" cy="24" rx="14" ry="4.5" fill="#cfe8ff" opacity="0.5" transform="rotate(8 20 24)" />
      <ellipse cx="34" cy="6" rx="12" ry="4" fill="#cfe8ff" opacity="0.55" transform="rotate(-6 34 6)" />
      <ellipse cx="34" cy="24" rx="12" ry="4" fill="#cfe8ff" opacity="0.45" transform="rotate(6 34 24)" />
    </svg>
  );
}

function Sparkle({ className, delay }: { className?: string; delay: string }) {
  return (
    <span aria-hidden="true" className={`animate-twinkle pointer-events-none ${className ?? ""}`} style={{ animationDelay: delay }}>
      ✨
    </span>
  );
}

// Re-exported so TypeScript keeps structural typing of TintStyle usages honest
// if this file is ever split; avoids an unused-import lint without changing
// the shared lib file.
export type { TintStyle };
