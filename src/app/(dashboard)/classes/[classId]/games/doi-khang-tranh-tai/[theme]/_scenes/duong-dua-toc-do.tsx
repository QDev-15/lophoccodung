import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Đường đua tốc độ" — a literal two-lane foot race. Each team's runner sits at a
// horizontal position driven by their own score relative to the other team's: tied
// scores put both runners at the track's midpoint, and every correct answer nudges
// the scorer's runner further toward the checkered flag while nudging the other
// team's runner (relatively) back. `total` sets the scale so a full possible lead
// reaches the edges of the track rather than flying off it.
const TRACK_MARGIN = 7; // % kept clear on each edge so a runner never clips the flags
const TRACK_SPAN = 100 - TRACK_MARGIN * 2;

function laneProgress(own: number, other: number, total: number) {
  const safeTotal = Math.max(total, 1);
  const ratio = Math.max(-1, Math.min(1, (own - other) / safeTotal));
  return TRACK_MARGIN + ((ratio + 1) / 2) * TRACK_SPAN;
}

export function Scene({ theme, total, scoreA, scoreB }: BattleSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const posA = laneProgress(scoreA, scoreB, total);
  const posB = laneProgress(scoreB, scoreA, total);

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[1.75rem] bg-(--color-cloud) p-3 shadow-[0_3px_0_rgba(46,42,33,0.06),0_10px_22px_-8px_rgba(46,42,33,0.25)] sm:p-4">
      <span
        aria-hidden="true"
        className={`absolute -right-6 -top-10 size-28 rounded-full opacity-25 blur-2xl ${tint.bg}`}
      />

      <div className="relative z-10 mb-2.5 flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-(--color-ink)/45 sm:text-sm">
        <span aria-hidden="true">{theme.emoji}</span>
        <span>Đường đua tốc độ</span>
      </div>

      <div className="relative z-10 flex flex-col gap-3 sm:gap-3.5">
        <RaceLane laneBg="bg-(--color-mint)" laneBorder="border-(--color-mint-dark)/35" mascot="🧒" pos={posA} ahead={scoreA > scoreB} />
        <RaceLane laneBg="bg-(--color-lavender)" laneBorder="border-(--color-lavender)/45" mascot="👧" pos={posB} ahead={scoreB > scoreA} />
      </div>

      <style>{`
        @keyframes scene-race-bounce {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-5px) rotate(4deg); }
        }
        .scene-race-runner { animation: scene-race-bounce 0.55s cubic-bezier(.34, 1.56, .64, 1) infinite; }

        @keyframes scene-race-dash {
          to { background-position-x: -24px; }
        }
        .scene-race-dashes { animation: scene-race-dash 0.9s linear infinite; }

        @keyframes scene-race-flag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        .scene-race-flag { display: inline-block; transform-origin: bottom left; animation: scene-race-flag 1.6s ease-in-out infinite; }

        @keyframes scene-race-dust {
          0% { opacity: 0.55; transform: scale(0.6) translateX(2px); }
          100% { opacity: 0; transform: scale(1.3) translateX(-12px); }
        }
        .scene-race-dust { animation: scene-race-dust 0.55s ease-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .scene-race-runner, .scene-race-dashes, .scene-race-flag, .scene-race-dust {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function RaceLane({
  laneBg,
  laneBorder,
  mascot,
  pos,
  ahead,
}: {
  laneBg: string;
  laneBorder: string;
  mascot: string;
  pos: number;
  ahead: boolean;
}) {
  return (
    <div className="relative h-11 sm:h-12">
      {/* the track itself, vertically centered in the lane's row */}
      <div
        className={`absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 overflow-hidden rounded-full border-2 bg-(--color-ink)/[0.05] sm:h-10 ${laneBorder}`}
      >
        {/* dashed lane-marking line down the middle of the track */}
        <div
          aria-hidden="true"
          className="scene-race-dashes absolute left-0 right-9 top-1/2 h-0.5 -translate-y-1/2 opacity-35 sm:right-10"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, var(--color-ink) 0 10px, transparent 10px 24px)",
          }}
        />
        {/* soft tint fill showing the leader's share of the lane */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full opacity-[0.16] transition-[width] duration-400 ease-out ${laneBg}`}
          style={{ width: `${pos}%` }}
        />
        {/* checkered finish flag at the end of the lane */}
        <span
          aria-hidden="true"
          className="scene-race-flag absolute right-1 top-1/2 -translate-y-1/2 text-base leading-none sm:text-lg"
        >
          🏁
        </span>
      </div>

      {/* the runner, riding centered on its lane */}
      <div
        className="absolute top-1/2 transition-[left] duration-400 ease-out"
        style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}
      >
        <div className="relative flex items-center justify-center">
          {ahead && (
            <span aria-hidden="true" className="scene-race-dust absolute -left-3 text-sm sm:text-base">
              💨
            </span>
          )}
          <span
            aria-hidden="true"
            className={`scene-race-runner flex size-8 items-center justify-center rounded-full text-base shadow-[0_4px_10px_-2px_rgba(46,42,33,0.35)] sm:size-9 sm:text-lg ${laneBg}`}
          >
            {mascot}
          </span>
        </div>
      </div>
    </div>
  );
}
