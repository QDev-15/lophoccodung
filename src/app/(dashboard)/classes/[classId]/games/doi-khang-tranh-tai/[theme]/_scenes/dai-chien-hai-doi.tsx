import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Đại chiến hai đội" — the flagship battle theme: a classic, cheerful field-day
// tug-of-war. Team A (mint, 🧒) pulls from the left, Team B (lavender, 👧) pulls
// from the right, and the flag knot tied to the rope slides toward whichever
// team currently holds more points — centered when the score is tied. Driven
// purely by `scoreA`/`scoreB`, never by question progress.
export function Scene({ theme, scoreA, scoreB }: BattleSceneProps) {
  const diff = scoreA - scoreB;
  const sum = scoreA + scoreB;
  // -1 = Team B fully ahead, 0 = tied, +1 = Team A fully ahead. Proportional to
  // how decisive the lead is relative to total points scored so far.
  const pull = sum === 0 ? 0 : Math.max(-1, Math.min(1, diff / sum));
  const markerPct = Math.min(80, Math.max(20, 50 - pull * 30));
  const leaderA = pull > 0.08;
  const leaderB = pull < -0.08;
  const tint = TINT_STYLES[theme.tint];

  const leadLabel = leaderA
    ? "Đội A đang kéo mạnh hơn!"
    : leaderB
      ? "Đội B đang kéo mạnh hơn!"
      : "Hai đội đang ngang sức!";
  const leadColor = leaderA ? "text-(--color-mint-dark)" : leaderB ? "text-(--color-lavender)" : "text-(--color-ink)/55";

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[2rem] bg-white/70 p-4 shadow-[0_10px_28px_-14px_rgba(46,42,33,0.3)] sm:p-6">
      {/* Sparing theme accent: soft field wash behind the whole scene, tied to this theme's tint. */}
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${tint.blob} opacity-50`} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-(--color-mint-light)/70 to-transparent" />

      {/* Bunting flags across the top of the arena. */}
      <div aria-hidden="true" className="pointer-events-none relative -mt-1 mb-2 flex justify-center gap-2 overflow-hidden px-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="scene-tugofwar-bunting block h-3 w-3 shrink-0"
            style={{
              background: i % 2 === 0 ? "var(--color-mint)" : "var(--color-lavender)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-end justify-between gap-2 px-1 sm:px-5">
        {/* Team A — pulling from the left */}
        <div className="relative flex flex-col items-center">
          <span
            aria-hidden="true"
            className={`absolute -bottom-0.5 h-3 w-14 rounded-full bg-(--color-ink)/10 blur-[2px] transition-transform duration-300 ${leaderA ? "scale-110" : "scale-90"}`}
          />
          <span
            aria-hidden="true"
            className={`scene-tugofwar-pull-a relative inline-block text-4xl sm:text-5xl ${leaderA ? "scene-tugofwar-win" : ""}`}
          >
            🧒
          </span>
          <span className="mt-1 text-[11px] font-extrabold text-(--color-mint-dark) sm:text-xs">Đội A</span>
        </div>

        {/* The rope, with a flag knot that slides toward whoever's ahead. */}
        <div className="relative mx-1 flex-1 self-center">
          <div className="relative h-5">
            <div className="scene-tugofwar-rope absolute left-0 right-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full" />
            {/* Home / center mark on the rope. */}
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            <div
              className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-[left] duration-500 ease-out"
              style={{ left: `${markerPct}%`, transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
            >
              <span aria-hidden="true" className="scene-tugofwar-flag-wave block origin-bottom text-xl drop-shadow-sm sm:text-2xl">
                {theme.emoji}
              </span>
              <span aria-hidden="true" className="-mt-1 block size-3 rounded-full bg-white shadow-[0_0_0_2px_rgba(46,42,33,0.15)]" />
            </div>
          </div>
        </div>

        {/* Team B — pulling from the right */}
        <div className="relative flex flex-col items-center">
          <span
            aria-hidden="true"
            className={`absolute -bottom-0.5 h-3 w-14 rounded-full bg-(--color-ink)/10 blur-[2px] transition-transform duration-300 ${leaderB ? "scale-110" : "scale-90"}`}
          />
          <span
            aria-hidden="true"
            className={`scene-tugofwar-pull-b relative inline-block text-4xl sm:text-5xl ${leaderB ? "scene-tugofwar-win" : ""}`}
          >
            👧
          </span>
          <span className="mt-1 text-[11px] font-extrabold text-(--color-lavender) sm:text-xs">Đội B</span>
        </div>
      </div>

      <p className={`relative mt-3 text-center text-sm font-bold ${leadColor}`}>{leadLabel}</p>

      <style>{`
        .scene-tugofwar-rope {
          background: repeating-linear-gradient(135deg, #c88a4a 0 6px, #9c6a34 6px 12px);
          box-shadow: inset 0 2px 2px rgba(255,255,255,0.35), inset 0 -2px 3px rgba(46,42,33,0.3), 0 2px 6px -2px rgba(46,42,33,0.35);
        }

        @keyframes scene-tugofwar-pull-a-kf {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          50% { transform: rotate(-6deg) translateX(-3px); }
        }
        @keyframes scene-tugofwar-pull-b-kf {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          50% { transform: rotate(6deg) translateX(3px); }
        }
        .scene-tugofwar-pull-a { animation: scene-tugofwar-pull-a-kf 1.5s ease-in-out infinite; }
        .scene-tugofwar-pull-b { animation: scene-tugofwar-pull-b-kf 1.5s ease-in-out infinite; }

        @keyframes scene-tugofwar-win-kf {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.14); }
        }
        .scene-tugofwar-win { animation: scene-tugofwar-win-kf 0.85s ease-in-out infinite; }

        @keyframes scene-tugofwar-flag-wave-kf {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .scene-tugofwar-flag-wave { animation: scene-tugofwar-flag-wave-kf 1.8s ease-in-out infinite; }

        @keyframes scene-tugofwar-bunting-kf {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(3px) rotate(6deg); }
        }
        .scene-tugofwar-bunting { animation: scene-tugofwar-bunting-kf 2.2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .scene-tugofwar-pull-a,
          .scene-tugofwar-pull-b,
          .scene-tugofwar-win,
          .scene-tugofwar-flag-wave,
          .scene-tugofwar-bunting {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
