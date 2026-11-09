import { TINT_STYLES } from "@/lib/adventure-themes";
import type { BattleSceneProps } from "./types";

// "Leo đỉnh trí tuệ" — two climbers race up the two faces of ONE shared
// mountain toward a glowing "peak of intellect" (a brain lit up like a
// lightbulb) at the summit. Height up the slope = scoreA / scoreB relative
// to `total`. Floating glowing math/question-mark symbols drift along both
// faces to sell the "intellect" theme and keep this visually distinct from
// the other two mountain-climb battle scenes.

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// Straight-line approximation of each rocky face, in the 400×220 viewBox
// used below — close enough to the jagged outline to look like the climber
// is hugging the mountain.
const LEFT_BASE = { x: 34, y: 196 };
const LEFT_PEAK = { x: 196, y: 42 };
const RIGHT_BASE = { x: 366, y: 196 };
const RIGHT_PEAK = { x: 204, y: 42 };

function pointOn(base: { x: number; y: number }, peak: { x: number; y: number }, pct: number) {
  return {
    left: ((base.x + (peak.x - base.x) * pct) / 400) * 100,
    top: ((base.y + (peak.y - base.y) * pct) / 220) * 100,
  };
}

// Scattered glowing symbols decorating both mountain faces.
const SYMBOLS: Array<{ l: number; t: number; s: string; delay: number }> = [
  { l: 16, t: 66, s: "➕", delay: 0 },
  { l: 29, t: 46, s: "❓", delay: 0.5 },
  { l: 20, t: 26, s: "✖", delay: 1.1 },
  { l: 84, t: 64, s: "➗", delay: 0.25 },
  { l: 71, t: 44, s: "❓", delay: 0.85 },
  { l: 79, t: 24, s: "π", delay: 1.4 },
];

export function Scene({ theme, scoreA, scoreB, total }: BattleSceneProps) {
  const pctA = total > 0 ? clamp01(scoreA / total) : 0;
  const pctB = total > 0 ? clamp01(scoreB / total) : 0;
  const peach = TINT_STYLES.peach;

  const climberA = pointOn(LEFT_BASE, LEFT_PEAK, pctA);
  const climberB = pointOn(RIGHT_BASE, RIGHT_PEAK, pctB);
  const leaderA = pctA > pctB;
  const leaderB = pctB > pctA;

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[2rem] border-4 border-white/70 bg-gradient-to-b from-(--color-cloud) to-white p-3 shadow-[0_6px_0_rgba(62,40,27,0.08),0_16px_28px_-10px_rgba(62,40,27,0.3)] sm:p-5">
      <style>{`
        @keyframes scene-climbmind-float {
          0%, 100% { transform: translateY(0) rotate(-4deg); opacity: 0.55; }
          50% { transform: translateY(-9px) rotate(5deg); opacity: 1; }
        }
        @keyframes scene-climbmind-pulse-peak {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.92); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes scene-climbmind-bob {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }
        @keyframes scene-climbmind-crown-pop {
          0%, 100% { transform: translate(-50%, 0) scale(1) rotate(-6deg); }
          50% { transform: translate(-50%, -4px) scale(1.08) rotate(6deg); }
        }
        .scene-climbmind-float { animation: scene-climbmind-float 2.6s ease-in-out infinite; }
        .scene-climbmind-pulse-peak { animation: scene-climbmind-pulse-peak 1.8s ease-in-out infinite; }
        .scene-climbmind-bob { animation: scene-climbmind-bob 2.2s ease-in-out infinite; }
        .scene-climbmind-crown-pop { animation: scene-climbmind-crown-pop 1.1s ease-in-out infinite; }
        .scene-climbmind-climber {
          transition: left 400ms cubic-bezier(.34, 1.56, .64, 1), top 400ms cubic-bezier(.34, 1.56, .64, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .scene-climbmind-float,
          .scene-climbmind-pulse-peak,
          .scene-climbmind-bob,
          .scene-climbmind-crown-pop {
            animation: none !important;
          }
          .scene-climbmind-climber {
            transition: left 200ms linear, top 200ms linear;
          }
        }
      `}</style>

      {/* Scene label */}
      <div className="relative z-20 mb-1 flex justify-center">
        <span className={`inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold ${peach.text} shadow-[0_2px_0_rgba(62,40,27,0.08)]`}>
          {theme.emoji} Hai đội cùng leo lên đỉnh trí tuệ!
        </span>
      </div>

      <div className="relative mx-auto aspect-[400/220] w-full max-w-xl">
        {/* ---- mountain SVG ---- */}
        <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="scene-climbmind-grad-a" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="var(--color-mint-dark)" />
              <stop offset="100%" stopColor="var(--color-mint)" />
            </linearGradient>
            <linearGradient id="scene-climbmind-grad-b" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#5b21b6" />
              <stop offset="100%" stopColor="var(--color-lavender)" />
            </linearGradient>
            <radialGradient id="scene-climbmind-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-sun)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* sky glow behind the peak */}
          <circle cx="200" cy="40" r="46" fill="url(#scene-climbmind-glow)" className="scene-climbmind-pulse-peak" style={{ transformOrigin: "200px 40px" }} />

          {/* left rocky face — Team A */}
          <path
            d="M10,200 L55,182 L40,158 L90,142 L75,112 L130,96 L112,66 L160,50 L200,26 L200,220 L10,220 Z"
            fill="url(#scene-climbmind-grad-a)"
            stroke="rgba(62,40,27,0.25)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* right rocky face — Team B */}
          <path
            d="M390,200 L345,182 L360,158 L310,142 L325,112 L270,96 L288,66 L240,50 L200,26 L200,220 L390,220 Z"
            fill="url(#scene-climbmind-grad-b)"
            stroke="rgba(62,40,27,0.25)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* snow-cap at the summit */}
          <polygon points="168,58 200,24 232,58 214,48 200,62 186,48" fill="white" opacity="0.92" />

          {/* ground strip */}
          <rect x="0" y="212" width="400" height="8" fill="var(--color-mint-light)" opacity="0.6" />
        </svg>

        {/* glowing "peak of intellect" brain */}
        <div
          className="pointer-events-none absolute flex items-center justify-center text-2xl sm:text-3xl"
          style={{ left: "50%", top: "11%", transform: "translate(-50%, -60%)" }}
          aria-hidden="true"
        >
          <span className="scene-climbmind-pulse-peak" style={{ transformOrigin: "center" }}>
            🧠
          </span>
        </div>

        {/* floating glowing symbols */}
        {SYMBOLS.map((sym, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="scene-climbmind-float pointer-events-none absolute text-sm font-black sm:text-base"
            style={{
              left: `${sym.l}%`,
              top: `${sym.t}%`,
              color: "var(--color-sun-dark)",
              textShadow: "0 0 6px var(--color-sun), 0 0 2px #fff",
              animationDelay: `${sym.delay}s`,
            }}
          >
            {sym.s}
          </span>
        ))}

        {/* Team A climber */}
        <div
          className="scene-climbmind-climber absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${climberA.left}%`, top: `${climberA.top}%` }}
        >
          {leaderA && (
            <span aria-hidden="true" className="scene-climbmind-crown-pop absolute -top-5 left-1/2 text-base">
              👑
            </span>
          )}
          <span className="scene-climbmind-bob flex size-9 items-center justify-center rounded-full bg-white text-lg shadow-[0_3px_0_rgba(62,40,27,0.2),0_6px_10px_-3px_rgba(62,40,27,0.4)] ring-2 ring-(--color-mint-dark) sm:size-11 sm:text-xl">
            🧒
          </span>
        </div>

        {/* Team B climber */}
        <div
          className="scene-climbmind-climber absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${climberB.left}%`, top: `${climberB.top}%` }}
        >
          {leaderB && (
            <span aria-hidden="true" className="scene-climbmind-crown-pop absolute -top-5 left-1/2 text-base">
              👑
            </span>
          )}
          <span className="scene-climbmind-bob flex size-9 items-center justify-center rounded-full bg-white text-lg shadow-[0_3px_0_rgba(62,40,27,0.2),0_6px_10px_-3px_rgba(62,40,27,0.4)] ring-2 ring-(--color-lavender) sm:size-11 sm:text-xl">
            👧
          </span>
        </div>
      </div>
    </div>
  );
}
