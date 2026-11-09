import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Vòng loại thử thách" (🎯 Elimination challenge round) — bespoke scene.
//
// Two dartboard-style targets face off side by side under a tense little
// spotlit arena. Each team's board has 5 concentric bands plus a bullseye;
// bands light up one-by-one, outside-in, as that team's score climbs toward
// `total` — the team closer to lighting its bullseye is visibly "closing in"
// on the round. Pure CSS/SVG, no deps, no hooks — fully derived from props.

const RING_COUNT = 5;
// Band boundary radii, outermost first, bullseye last (6 circles painted
// largest-to-smallest so each later circle visually becomes a ring).
const BAND_RADII = [92, 76, 60, 44, 28, 14] as const;

function litBandsFor(score: number, total: number) {
  if (total <= 0) return 0;
  const ratio = score / Math.max(1, total);
  return Math.max(0, Math.min(RING_COUNT, Math.round(ratio * RING_COUNT)));
}

type PanelProps = {
  teamKey: "a" | "b";
  tintVar: string; // e.g. "--color-mint"
  textClass: string;
  teamLabel: string;
  mascot: string;
  lit: number;
};

function DartboardPanel({ teamKey, tintVar, textClass, teamLabel, mascot, lit }: PanelProps) {
  const bullseyeHit = lit >= RING_COUNT;
  // A friendly little "impact mark" sitting on the frontier band, so the
  // board reads as "darts already thrown" rather than a static gauge.
  const markAngle = (lit * 61 + (teamKey === "a" ? 18 : -24)) % 360;
  const markRadius = lit > 0 ? (BAND_RADII[lit - 1] + BAND_RADII[Math.min(lit, RING_COUNT)]) / 2 : 0;
  const markRad = (markAngle * Math.PI) / 180;
  const markX = 100 + markRadius * Math.cos(markRad);
  const markY = 100 + markRadius * Math.sin(markRad);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative rounded-[1.75rem] bg-white/95 p-2 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)] ring-2 sm:rounded-[2rem] sm:p-3 ${
          teamKey === "a" ? "ring-(--color-mint-dark)/50" : "ring-(--color-lavender)/50"
        }`}
      >
        <svg
          viewBox="0 0 200 200"
          className="size-24 sm:size-32 md:size-36"
          role="img"
          aria-label={`Bia phi tiêu ${teamLabel}: đã trúng ${lit}/${RING_COUNT} vòng`}
        >
          {/* outer rim */}
          <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-ink)" strokeOpacity="0.12" strokeWidth="3" />

          {BAND_RADII.slice(0, RING_COUNT).map((r, i) => {
            const isLit = i < lit;
            const fill = isLit
              ? i % 2 === 0
                ? `var(${tintVar})`
                : `color-mix(in srgb, var(${tintVar}) 68%, white)`
              : "var(--color-cloud)";
            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={r}
                fill={fill}
                stroke="var(--color-ink)"
                strokeOpacity={isLit ? 0.1 : 0.14}
                strokeDasharray={isLit ? undefined : "4 5"}
                strokeWidth="1.5"
                className={isLit ? "scene-target-band-lit" : undefined}
                style={isLit ? { animationDelay: `${i * 0.12}s` } : undefined}
              />
            );
          })}

          {/* bullseye */}
          <circle
            cx="100"
            cy="100"
            r={BAND_RADII[RING_COUNT]}
            fill={bullseyeHit ? "var(--color-sun)" : "color-mix(in srgb, var(--color-ink) 10%, white)"}
            stroke="var(--color-ink)"
            strokeOpacity={bullseyeHit ? 0.15 : 0.18}
            strokeDasharray={bullseyeHit ? undefined : "3 4"}
            strokeWidth="1.5"
            className={bullseyeHit ? "scene-target-bullseye-hit" : undefined}
          />

          {/* frontier "dart" impact mark */}
          {lit > 0 && (
            <g className="scene-target-dart">
              <circle cx={markX} cy={markY} r="4.5" fill="white" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx={markX} cy={markY} r="1.6" fill="var(--color-ink)" fillOpacity="0.55" />
            </g>
          )}
        </svg>

        {/* mascot sticker perched on the board */}
        <span
          aria-hidden="true"
          className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-white text-sm shadow-[0_3px_8px_-2px_rgba(46,42,33,0.4)] sm:size-8 sm:text-base"
        >
          {mascot}
        </span>
      </div>

      <span className={`font-display text-xs font-extrabold sm:text-sm ${textClass}`}>{teamLabel}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white/90 sm:text-xs">
        {bullseyeHit ? "Trúng tâm! 🎉" : `${lit}/${RING_COUNT} vòng`}
      </span>
    </div>
  );
}

export function Scene({ theme, scoreA, scoreB, total }: BattleSceneProps) {
  const accent = TINT_STYLES[theme.tint];
  const litA = litBandsFor(scoreA, total);
  const litB = litBandsFor(scoreB, total);

  return (
    <div className="relative z-10 mt-5">
      <style>{`
        @keyframes scene-target-beam-sweep {
          0%, 100% { opacity: 0.35; transform: translateX(-6%) rotate(-3deg); }
          50% { opacity: 0.6; transform: translateX(6%) rotate(3deg); }
        }
        @keyframes scene-target-band-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.12); }
        }
        @keyframes scene-target-bullseye-pulse {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 rgba(217,119,6,0)); }
          50% { filter: brightness(1.25) drop-shadow(0 0 6px rgba(217,119,6,0.7)); }
        }
        @keyframes scene-target-dart-land {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scene-target-beam { animation: scene-target-beam-sweep 3.4s ease-in-out infinite; }
        .scene-target-band-lit { animation: scene-target-band-glow 2.2s ease-in-out infinite; transform-origin: 100px 100px; }
        .scene-target-bullseye-hit { animation: scene-target-bullseye-pulse 1.4s ease-in-out infinite; transform-origin: 100px 100px; }
        .scene-target-dart { animation: scene-target-dart-land 380ms cubic-bezier(.34,1.56,.64,1) backwards; transform-origin: center; transform-box: fill-box; }

        @media (prefers-reduced-motion: reduce) {
          .scene-target-beam, .scene-target-band-lit, .scene-target-bullseye-hit, .scene-target-dart {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* dark little arena stage so the spotlights + boards read as a tense "elimination round" */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-(--color-ink) to-[#332c20] px-4 py-5 shadow-[inset_0_2px_14px_rgba(255,255,255,0.08),0_16px_32px_-14px_rgba(46,42,33,0.55)] sm:rounded-[2.5rem] sm:px-8 sm:py-6">
        {/* spotlight beams converging from above */}
        <div
          aria-hidden="true"
          className="scene-target-beam pointer-events-none absolute -top-16 left-[14%] h-48 w-28 sm:h-64 sm:w-36"
          style={{ background: "conic-gradient(from 180deg, rgba(255,255,255,0.22), transparent 55%)" }}
        />
        <div
          aria-hidden="true"
          className="scene-target-beam pointer-events-none absolute -top-16 right-[14%] h-48 w-28 sm:h-64 sm:w-36"
          style={{ background: "conic-gradient(from 180deg, transparent 45%, rgba(255,255,255,0.22))", animationDelay: "1.2s" }}
        />
        {/* sparing theme-tint accent glow, centered */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full ${accent.blob} opacity-[0.12] blur-2xl`}
        />

        <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-10 md:gap-16">
          <DartboardPanel
            teamKey="a"
            tintVar="--color-mint"
            textClass="text-white"
            teamLabel="Đội A"
            mascot="🧒"
            lit={litA}
          />

          <div className="flex flex-col items-center gap-1 text-white/80">
            <span aria-hidden="true" className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] sm:text-3xl">
              {theme.emoji}
            </span>
            <span className="text-center text-[9px] font-bold uppercase tracking-wide sm:text-[11px]">
              Loại trực tiếp
            </span>
          </div>

          <DartboardPanel
            teamKey="b"
            tintVar="--color-lavender"
            textClass="text-white"
            teamLabel="Đội B"
            mascot="👧"
            lit={litB}
          />
        </div>
      </div>
    </div>
  );
}
