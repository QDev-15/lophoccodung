import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Vua Tốc Độ" — a two-lane go-kart race track. Clearly cars (not runners,
// unlike the sibling "Đường đua tốc độ" foot race), with scrolling
// speed-line lanes and a checkered-flag finish edge. Position is each
// team's relative lead, driven purely by scoreA vs scoreB.

function laneProgress(own: number, other: number, total: number) {
  const denom = Math.max(total, 1);
  const lead = Math.max(-1, Math.min(1, (own - other) / denom));
  return 7 + ((lead + 1) / 2) * 86;
}

export function Scene({ theme, scoreA, scoreB, total }: BattleSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const posA = laneProgress(scoreA, scoreB, total);
  const posB = laneProgress(scoreB, scoreA, total);
  const leaderA = scoreA > scoreB;
  const leaderB = scoreB > scoreA;

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[2rem] bg-(--color-ink) p-4 shadow-[0_10px_28px_-14px_rgba(46,42,33,0.4)] sm:p-6">
      <style>{`
        @keyframes scene-speedking-speedlines {
          0% { background-position: 0 0; }
          100% { background-position: -40px 0; }
        }
        @keyframes scene-speedking-bob {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-2px) scaleX(1.04); }
        }
        @keyframes scene-speedking-flagwave {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .scene-speedking-lane { animation: scene-speedking-speedlines 0.6s linear infinite; }
        .scene-speedking-car { animation: scene-speedking-bob 0.5s ease-in-out infinite; display: inline-block; }
        .scene-speedking-flag { animation: scene-speedking-flagwave 1.4s ease-in-out infinite; display: inline-block; }
        @media (prefers-reduced-motion: reduce) {
          .scene-speedking-lane, .scene-speedking-car, .scene-speedking-flag {
            animation: none !important;
          }
        }
      `}</style>

      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 opacity-15 ${tint.blob}`} />

      <div className="relative flex flex-col gap-3">
        <div className="relative h-10 overflow-hidden rounded-full bg-(--color-mint-dark)/20 sm:h-12">
          <div
            aria-hidden="true"
            className="scene-speedking-lane absolute inset-0 opacity-30"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, white 0 14px, transparent 14px 28px)" }}
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl transition-[left] duration-500 ease-out sm:text-3xl"
            style={{ left: `${posA}%` }}
          >
            <span
              className={`scene-speedking-car ${leaderA ? "drop-shadow-[0_0_8px_var(--color-mint)]" : ""}`}
              aria-hidden="true"
            >
              🏎️
            </span>
          </div>
        </div>

        <div className="relative h-10 overflow-hidden rounded-full bg-(--color-lavender)/20 sm:h-12">
          <div
            aria-hidden="true"
            className="scene-speedking-lane absolute inset-0 opacity-30"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, white 0 14px, transparent 14px 28px)",
              animationDelay: "0.2s",
            }}
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl transition-[left] duration-500 ease-out sm:text-3xl"
            style={{ left: `${posB}%` }}
          >
            <span
              className={`scene-speedking-car ${leaderB ? "drop-shadow-[0_0_8px_var(--color-lavender)]" : ""}`}
              style={{ animationDelay: "0.25s" }}
              aria-hidden="true"
            >
              🏎️
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-2 w-3 opacity-80"
          style={{ backgroundImage: "repeating-conic-gradient(#fff 0 90deg, #111 90deg 180deg)", backgroundSize: "8px 8px" }}
        />
      </div>

      <p className="relative mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-bold text-(--color-cloud)/85">
        <span className="scene-speedking-flag" aria-hidden="true">
          🏁
        </span>
        {leaderA ? "Đội A đang dẫn đầu đường đua!" : leaderB ? "Đội B đang dẫn đầu đường đua!" : "Hai đội đang kề nhau!"}
      </p>
    </div>
  );
}
