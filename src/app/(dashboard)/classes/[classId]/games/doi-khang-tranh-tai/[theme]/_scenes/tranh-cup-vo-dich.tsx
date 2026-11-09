import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Tranh cúp vô địch" — a championship podium with a trophy cup at the
// center; each team's mascot climbs their own side's steps toward it as
// they score. This theme's own accent (also lavender, same hue as Team B)
// is used only for the stage-light glow behind the cup, never for a team —
// the two mascots stay on their own fixed mint/lavender identities.

function heightPct(score: number, total: number) {
  const denom = Math.max(total, 1);
  return Math.min(78, Math.max(0, (score / denom) * 70));
}

export function Scene({ theme, scoreA, scoreB, total }: BattleSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const pctA = heightPct(scoreA, total);
  const pctB = heightPct(scoreB, total);
  const leaderA = scoreA > scoreB;
  const leaderB = scoreB > scoreA;
  const hasLeader = leaderA || leaderB;

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[2rem] bg-gradient-to-b from-(--color-ink)/5 to-white p-4 shadow-[0_10px_28px_-14px_rgba(46,42,33,0.3)] sm:p-6">
      <style>{`
        @keyframes scene-podium-spotlight {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.6; }
        }
        @keyframes scene-podium-cupglow {
          0%, 100% { filter: drop-shadow(0 0 6px var(--color-sun)); }
          50% { filter: drop-shadow(0 0 16px var(--color-sun)); }
        }
        @keyframes scene-podium-climb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes scene-podium-confetti {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translateY(40px) rotate(180deg); }
        }
        .scene-podium-spotlight { animation: scene-podium-spotlight 2.4s ease-in-out infinite; }
        .scene-podium-cup { animation: scene-podium-cupglow 1.8s ease-in-out infinite; display: inline-block; }
        .scene-podium-climb { animation: scene-podium-climb 1.3s ease-in-out infinite; display: inline-block; }
        .scene-podium-confetti { animation: scene-podium-confetti 1.4s ease-in infinite; display: inline-block; }
        @media (prefers-reduced-motion: reduce) {
          .scene-podium-spotlight, .scene-podium-cup, .scene-podium-climb, .scene-podium-confetti {
            animation: none !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className={`scene-podium-spotlight pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full ${tint.blob} blur-3xl`}
      />

      <div className="relative flex h-40 items-end justify-center gap-10 sm:h-48 sm:gap-16">
        <div className="relative flex h-full flex-col items-center justify-end">
          <div
            className={`scene-podium-climb mb-1 text-3xl sm:text-4xl ${leaderA ? "drop-shadow-[0_0_8px_var(--color-mint)]" : ""}`}
            style={{ marginBottom: `${pctA}%` }}
            aria-hidden="true"
          >
            🧒
          </div>
          <div className="h-10 w-16 rounded-t-lg bg-(--color-mint) sm:w-20" />
        </div>

        <div className="relative flex h-full flex-col items-center justify-end">
          {hasLeader && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-2 left-1/2 flex -translate-x-1/2 gap-3"
            >
              <span className="scene-podium-confetti text-lg">🎊</span>
              <span className="scene-podium-confetti text-lg" style={{ animationDelay: "0.3s" }}>
                ✨
              </span>
              <span className="scene-podium-confetti text-lg" style={{ animationDelay: "0.6s" }}>
                🎊
              </span>
            </div>
          )}
          <span className="scene-podium-cup mb-2 text-4xl sm:text-5xl" aria-hidden="true">
            {theme.emoji}
          </span>
          <div className="h-16 w-20 rounded-t-lg bg-(--color-sun-dark) sm:w-24" />
        </div>

        <div className="relative flex h-full flex-col items-center justify-end">
          <div
            className={`scene-podium-climb mb-1 text-3xl sm:text-4xl ${leaderB ? "drop-shadow-[0_0_8px_var(--color-lavender)]" : ""}`}
            style={{ marginBottom: `${pctB}%`, animationDelay: "0.3s" }}
            aria-hidden="true"
          >
            👧
          </div>
          <div className="h-10 w-16 rounded-t-lg bg-(--color-lavender) sm:w-20" />
        </div>
      </div>

      <p className="relative mt-3 text-center text-sm font-bold text-(--color-ink)/60">
        {leaderA
          ? "Đội A đang gần chiếc cúp hơn!"
          : leaderB
            ? "Đội B đang gần chiếc cúp hơn!"
            : "Hai đội ngang tài ngang sức!"}
      </p>
    </div>
  );
}
