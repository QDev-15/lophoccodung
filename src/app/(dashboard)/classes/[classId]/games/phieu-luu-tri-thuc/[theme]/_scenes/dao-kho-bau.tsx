import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Đảo kho báu" — a hand-drawn pirate treasure map. A dotted footpath winds
// across a sandy island, lined with palm trees, toward a big chest marked
// with an X. Passed spots show small explorer's X marks, the current spot
// carries the theme's pirate-flag mascot planted beside a pair of footprints,
// and upcoming spots are plain unexplored dots. On "finished" the chest
// swings open and bursts with gold coins + sparkles.

// Deterministic (non-random) placement so the map never re-shuffles on
// re-render — same spirit as the hand-tossed bead layout in Ô Ăn Quan.
const PALM_SPOTS = [
  { left: "6%", scale: 1, flip: false, delay: "0s" },
  { left: "27%", scale: 0.78, flip: true, delay: "0.4s" },
  { left: "63%", scale: 0.9, flip: false, delay: "0.9s" },
  { left: "88%", scale: 0.8, flip: true, delay: "1.3s" },
] as const;

const COIN_BURST = [
  { x: 38, y: 30, delay: "0ms" },
  { x: 52, y: 14, delay: "90ms" },
  { x: 66, y: 32, delay: "150ms" },
  { x: 46, y: 46, delay: "210ms" },
  { x: 60, y: 48, delay: "280ms" },
] as const;

function dashTrack(color: string) {
  return `repeating-linear-gradient(to right, ${color} 0, ${color} 5px, transparent 5px, transparent 15px)`;
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const linePct = total > 0 ? Math.min(100, (index / total) * 100) : 0;

  return (
    <div className="scene-island relative overflow-hidden rounded-[2rem] border-[3px] border-dashed border-[#a9834b]/50 bg-gradient-to-b from-[#f6e6bd] via-[#f0dba4] to-[#e2c386] shadow-[inset_0_2px_10px_rgba(255,255,255,0.45),inset_0_-10px_22px_rgba(120,80,30,0.14),0_14px_30px_-14px_rgba(46,42,33,0.35)]">
      {/* Decorative map scenery — lives outside the scrollable row so it stays
          put like fixed backdrop while the footpath can scroll under it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "linear-gradient(#8a6a3d 1px, transparent 1px), linear-gradient(90deg, #8a6a3d 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="absolute -right-6 -top-6 size-28 rounded-full bg-white/25 blur-2xl" />
        <CompassRose className="absolute right-3 top-3 size-10 opacity-70 sm:size-12" />
        {PALM_SPOTS.map((p, i) => (
          <PalmTree
            key={i}
            className="scene-island-sway absolute bottom-0 h-16 sm:h-20"
            style={{
              left: p.left,
              transform: `scale(${p.scale}) ${p.flip ? "scaleX(-1)" : ""}`,
              transformOrigin: "bottom center",
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative overflow-x-auto px-4 py-7 sm:px-6 sm:py-8">
        <div className="relative flex min-w-max items-center gap-4 px-3 sm:gap-5">
          {/* Dotted footpath: sand dashes everywhere, with an already-walked
              segment picked out in the theme tint like a trail of tread marks. */}
          <div
            aria-hidden="true"
            className="absolute left-3 right-3 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full"
            style={{ backgroundImage: dashTrack("rgba(138,106,61,0.55)") }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${finished ? 100 : linePct}%`, backgroundImage: dashTrack(tint.shadowDark) }}
            />
          </div>

          {steps.map((_, i) => {
            const done = i < index;
            const current = i === index && !finished;
            const zig = i % 2 === 0 ? "-translate-y-2" : "translate-y-2";
            return (
              <div
                key={i}
                className={`relative z-10 flex shrink-0 items-center justify-center ${
                  current ? "size-16 sm:size-20" : `size-10 sm:size-12 ${zig}`
                }`}
              >
                {current ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="scene-island-ping absolute inset-0 rounded-full border-2"
                      style={{ borderColor: tint.shadowDark }}
                    />
                    <FootprintPair className="absolute bottom-0 h-4 w-8 text-[#8a6a3d]/70" />
                    <span
                      className={`absolute inset-0 -translate-y-3 scale-110 rounded-full border-2 bg-white shadow-[0_4px_10px_-3px_rgba(46,42,33,0.3)] ${tint.ring} animate-glow`}
                    />
                    <span className="scene-island-flag-wave relative -translate-y-3 text-4xl sm:text-5xl" style={{ transformOrigin: "bottom left" }}>
                      {theme.mascot}
                    </span>
                  </>
                ) : done ? (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-[#8a6a3d]/40 bg-[#e8d19f] shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_2px_4px_-1px_rgba(46,42,33,0.2)]" />
                    <XMark className="relative h-5 w-5 text-[#7a4a2a] sm:h-6 sm:w-6" />
                  </>
                ) : (
                  <span className="absolute inset-0 rounded-full border-2 border-dashed border-[#8a6a3d]/40 bg-[#f6e9c7]/70" />
                )}
              </div>
            );
          })}

          {/* Finish node: the chest marked with a big X. Swings open on finish. */}
          <div className="relative z-10 ml-1 flex size-20 shrink-0 items-center justify-center sm:size-24">
            {finished && (
              <>
                <span
                  aria-hidden="true"
                  className="scene-island-ping absolute inset-0 rounded-full border-2"
                  style={{ borderColor: tint.shadowDark }}
                />
                {COIN_BURST.map((c, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="scene-island-coin-pop pointer-events-none absolute text-lg sm:text-xl"
                    style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: c.delay }}
                  >
                    🪙
                  </span>
                ))}
                <span className="animate-twinkle pointer-events-none absolute -top-1 left-1 text-lg text-(--color-sun)">✨</span>
                <span className="animate-twinkle pointer-events-none absolute -top-2 right-0 text-base text-(--color-sun)" style={{ animationDelay: "0.3s" }}>
                  ✨
                </span>
              </>
            )}
            <div className={`relative size-16 sm:size-20 ${finished ? "animate-pop-in" : "animate-float"}`}>
              <TreasureChest open={finished} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scene-island-ping {
          0% { transform: scale(0.85); opacity: 0.55; }
          70%, 100% { transform: scale(1.7); opacity: 0; }
        }
        .scene-island-ping {
          animation: scene-island-ping 1.8s cubic-bezier(.34, 1.56, .64, 1) infinite;
        }

        @keyframes scene-island-flag-wave {
          0%, 100% { transform: translateY(-0.75rem) rotate(-4deg); }
          50% { transform: translateY(-0.75rem) rotate(6deg); }
        }
        .scene-island-flag-wave {
          display: inline-block;
          animation: scene-island-flag-wave 2.4s ease-in-out infinite;
        }

        @keyframes scene-island-sway {
          0%, 100% { rotate: -2deg; }
          50% { rotate: 2deg; }
        }
        .scene-island-sway {
          animation: scene-island-sway 4.5s ease-in-out infinite;
        }

        @keyframes scene-island-coin-pop {
          0% { transform: translateY(0) scale(0.4) rotate(0deg); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-2.2rem) scale(1) rotate(25deg); opacity: 0; }
        }
        .scene-island-coin-pop {
          animation: scene-island-coin-pop 1.1s cubic-bezier(.34, 1.56, .64, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .scene-island-ping {
            animation: none;
            opacity: 0;
          }
          .scene-island-flag-wave,
          .scene-island-sway {
            animation: none;
          }
          .scene-island-coin-pop {
            animation: none;
            opacity: 0.9;
            transform: translateY(-0.6rem);
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hand-rolled map art — no illustration assets exist in this codebase, so the
// island flourishes (palm trees, compass rose, footprints, X marks, chest)
// are built as small inline SVGs in a flat, outlined cartoon style.
// ---------------------------------------------------------------------------

function PalmTree({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 90" className={className} style={style} role="presentation" aria-hidden="true">
      <path d="M30 88 C27 60 32 38 34 22" fill="none" stroke="#8a5a28" strokeWidth="5" strokeLinecap="round" />
      <g stroke="#1a7a4a" strokeWidth="3" strokeLinecap="round">
        <path d="M34 22 C20 14 8 16 2 26" fill="#34a65f" />
        <path d="M34 22 C22 8 10 4 0 8" fill="#2f9a56" />
        <path d="M34 22 C34 6 28 -2 20 -6" fill="#34a65f" />
        <path d="M34 22 C44 6 54 2 62 6" fill="#2f9a56" />
        <path d="M34 22 C48 14 58 16 60 28" fill="#34a65f" />
      </g>
      <circle cx="32" cy="24" r="3.2" fill="#8a5a28" />
      <circle cx="38" cy="27" r="3" fill="#6b4017" />
    </svg>
  );
}

function CompassRose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="presentation" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="#f6e6bd" stroke="#8a6a3d" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#8a6a3d" strokeWidth="1" opacity="0.4" />
      <path d="M24 5 L28 24 L24 43 L20 24 Z" fill="#b4443c" />
      <path d="M5 24 L24 20 L43 24 L24 28 Z" fill="#8a6a3d" opacity="0.8" />
      <circle cx="24" cy="24" r="3" fill="#f6e6bd" stroke="#6b4017" strokeWidth="1.5" />
    </svg>
  );
}

function FootprintPair({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 20" className={className} role="presentation" aria-hidden="true">
      <ellipse cx="10" cy="12" rx="5" ry="7" fill="currentColor" opacity="0.55" />
      <ellipse cx="30" cy="8" rx="5" ry="7" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function XMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="presentation" aria-hidden="true">
      <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function TreasureChest({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 100 86" className="h-full w-full" role="presentation" aria-hidden="true">
      <ellipse cx="50" cy="78" rx="34" ry="5" fill="#8a6a3d" opacity="0.25" />
      <rect x="10" y="42" width="80" height="32" rx="7" fill="#9c6a34" stroke="#6b4017" strokeWidth="3" />
      <rect x="10" y="54" width="80" height="7" fill="#e4b65c" opacity="0.85" />
      <circle cx="50" cy="58" r="5.5" fill="#f4d58a" stroke="#6b4017" strokeWidth="2" />
      {open && (
        <>
          <ellipse cx="50" cy="44" rx="27" ry="9" fill="#fff6d8" />
          <circle cx="37" cy="42" r="6" fill="#f4d58a" stroke="#c9922f" strokeWidth="1.5" />
          <circle cx="50" cy="38" r="7" fill="#ffe08a" stroke="#c9922f" strokeWidth="1.5" />
          <circle cx="63" cy="43" r="6" fill="#f4d58a" stroke="#c9922f" strokeWidth="1.5" />
        </>
      )}
      <g
        style={{
          transform: open ? "rotate(-120deg)" : "rotate(0deg)",
          transformOrigin: "50px 42px",
          transition: "transform 0.5s cubic-bezier(.34, 1.56, .64, 1)",
        }}
      >
        <path d="M10 42 C10 20 90 20 90 42 Z" fill="#b9823f" stroke="#6b4017" strokeWidth="3" strokeLinejoin="round" />
        <path d="M30 31 L70 31 M38 24 L62 24" stroke="#6b4017" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      </g>
    </svg>
  );
}
