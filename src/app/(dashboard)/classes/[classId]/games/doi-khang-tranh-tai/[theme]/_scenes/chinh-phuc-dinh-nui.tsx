import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Chinh Phục Đỉnh Núi" — a grand single-summit climb: two climbers scale a
// snowy peak side by side, rising through a cloud layer toward sunrise rays
// and a waiting summit flag. Height is driven purely by scoreA/scoreB. This
// is the "grand finale" visual among the three mountain-climb battle
// themes — the peak, clouds and sun rays are the focal point.

function heightPct(score: number, total: number) {
  const denom = Math.max(total, 1);
  return Math.min(88, Math.max(0, (score / denom) * 82));
}

export function Scene({ theme, total, scoreA, scoreB }: BattleSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const pctA = heightPct(scoreA, total);
  const pctB = heightPct(scoreB, total);
  const leaderA = scoreA > scoreB;
  const leaderB = scoreB > scoreA;

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-100 to-(--color-cloud) p-4 shadow-[0_10px_28px_-14px_rgba(46,42,33,0.3)] sm:p-6">
      <style>{`
        @keyframes scene-summit-rays {
          0%, 100% { opacity: .35; }
          50% { opacity: .65; }
        }
        @keyframes scene-summit-flag {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes scene-summit-climb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes scene-summit-cloud {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .scene-summit-rays { animation: scene-summit-rays 3s ease-in-out infinite; }
        .scene-summit-flag { animation: scene-summit-flag 1.6s ease-in-out infinite; display: inline-block; transform-origin: bottom left; }
        .scene-summit-climb { animation: scene-summit-climb 1.2s ease-in-out infinite; display: inline-block; }
        .scene-summit-cloud { animation: scene-summit-cloud 6s ease-in-out infinite; display: inline-block; }
        @media (prefers-reduced-motion: reduce) {
          .scene-summit-rays, .scene-summit-flag, .scene-summit-climb, .scene-summit-cloud {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative h-48 sm:h-56">
        <div
          aria-hidden="true"
          className={`scene-summit-rays absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full ${tint.blob} blur-2xl`}
        />

        <svg
          viewBox="0 0 200 140"
          className="absolute inset-x-0 bottom-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="100,6 180,140 20,140" fill="var(--color-ink)" opacity="0.08" />
          <polygon points="100,6 140,70 60,70" fill="white" opacity="0.9" />
        </svg>

        <div className="absolute inset-x-6 bottom-[45%] flex justify-between opacity-80" aria-hidden="true">
          <span className="scene-summit-cloud text-2xl sm:text-3xl">☁️</span>
          <span className="scene-summit-cloud text-xl sm:text-2xl" style={{ animationDelay: "1s" }}>
            ☁️
          </span>
          <span className="scene-summit-cloud text-2xl sm:text-3xl" style={{ animationDelay: "2s" }}>
            ☁️
          </span>
        </div>

        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-2xl sm:text-3xl" aria-hidden="true">
          <span className="scene-summit-flag">🚩</span>
        </div>

        <div
          className="absolute left-[28%] -translate-x-1/2 transition-[bottom] duration-500 ease-out"
          style={{ bottom: `${pctA}%` }}
        >
          <span
            className={`scene-summit-climb text-3xl sm:text-4xl ${leaderA ? "drop-shadow-[0_0_8px_var(--color-mint)]" : ""}`}
            aria-hidden="true"
          >
            🧒
          </span>
        </div>
        <div
          className="absolute left-[72%] -translate-x-1/2 transition-[bottom] duration-500 ease-out"
          style={{ bottom: `${pctB}%` }}
        >
          <span
            className={`scene-summit-climb text-3xl sm:text-4xl ${leaderB ? "drop-shadow-[0_0_8px_var(--color-lavender)]" : ""}`}
            style={{ animationDelay: "0.3s" }}
            aria-hidden="true"
          >
            👧
          </span>
        </div>
      </div>

      <p className="relative mt-2 text-center text-sm font-bold text-(--color-ink)/60">
        {theme.emoji}{" "}
        {leaderA
          ? "Đội A đang dẫn đầu lên núi!"
          : leaderB
            ? "Đội B đang dẫn đầu lên núi!"
            : "Hai đội ngang độ cao!"}
      </p>
    </div>
  );
}
