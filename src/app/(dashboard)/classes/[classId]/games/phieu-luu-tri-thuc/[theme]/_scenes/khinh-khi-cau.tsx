import type { CSSProperties } from "react";

import { TINT_STYLES, type TintStyle } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for "Khinh khí cầu phiêu lưu" (Hot-air balloon adventure):
// a hand-drawn balloon drifts left-to-right over a row of cloud islands
// toward a rainbow finish line. Every custom keyframe/class below is
// prefixed `scene-balloon-` so it can never collide with another theme's
// local <style> block or the shared engine's own classes.

type IslandState = "upcoming" | "done" | "current" | "finishPending" | "finish";

function CloudPuff({
  fill,
  className,
  style,
}: {
  fill: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="48" rx="56" ry="18" fill={fill} />
      <circle cx="32" cy="34" r="22" fill={fill} />
      <circle cx="64" cy="22" r="26" fill={fill} />
      <circle cx="94" cy="36" r="19" fill={fill} />
    </svg>
  );
}

function CloudIsland({ tint, state }: { tint: TintStyle; state: IslandState }) {
  const big = state === "finish" || state === "finishPending";
  const ghost = state === "upcoming" || state === "finishPending";
  const glowing = state === "current" || state === "finish";
  const flagged = state === "done" || state === "finish";
  const grassy = !ghost;

  const sizeClasses = big
    ? "h-14 w-24 sm:h-16 sm:w-28"
    : state === "current"
      ? "h-12 w-20 sm:h-14 sm:w-24"
      : state === "done"
        ? "h-10 w-16 sm:h-12 sm:w-20"
        : "h-9 w-14 sm:h-10 sm:w-16";

  const style = glowing ? ({ "--scene-balloon-glow-color": tint.shadowDark } as CSSProperties) : undefined;

  return (
    <div className="relative flex flex-col items-center">
      {flagged && (
        <div className="absolute -top-3 right-0 z-20 flex items-center gap-0.5 sm:-top-4" aria-hidden="true">
          <span className="scene-balloon-flag inline-block text-sm sm:text-base" style={{ transformOrigin: "left bottom" }}>
            🚩
          </span>
          <span className="scene-balloon-sparkle inline-block text-xs">✨</span>
        </div>
      )}
      <div className={`relative ${sizeClasses}`} style={style}>
        {glowing && <span aria-hidden="true" className="scene-balloon-cloud-pulse absolute inset-1 rounded-full" />}
        <CloudPuff
          fill={ghost ? "var(--color-cloud)" : "var(--color-white)"}
          className={`relative z-10 h-full w-full drop-shadow-[0_6px_10px_rgba(46,42,33,0.18)] ${ghost ? "opacity-60" : ""}`}
        />
        {grassy && (
          <span
            aria-hidden="true"
            className={`absolute left-1/2 top-[16%] z-20 h-2.5 w-7 -translate-x-1/2 rounded-full sm:h-3 sm:w-9 ${tint.bg}`}
          />
        )}
      </div>
    </div>
  );
}

function HotAirBalloon({ tint }: { tint: TintStyle }) {
  return (
    <div className="scene-balloon-bob drop-shadow-[0_10px_14px_rgba(46,42,33,0.25)]">
      <svg viewBox="0 0 64 86" width="56" height="76" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="scene-balloon-envelope-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-white)" />
            <stop offset="100%" stopColor={tint.shadowDark} />
          </linearGradient>
        </defs>
        <line x1="32" y1="0" x2="32" y2="6" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="1" />
        <path
          d="M32 0 L32 6 L38 3 Z"
          fill={tint.shadowDark}
          className="scene-balloon-flag"
          style={{ transformOrigin: "32px 3px" }}
        />
        <path
          d="M32 4 C12 4 4 28 8 44 C11 57 20 62 32 62 C44 62 53 57 56 44 C60 28 52 4 32 4 Z"
          fill="url(#scene-balloon-envelope-grad)"
          stroke="rgba(62,40,27,0.3)"
          strokeWidth="1.5"
        />
        <path
          d="M32 4 L32 62 M19 8 C14 24 14 46 24 60 M45 8 C50 24 50 46 40 60"
          fill="none"
          stroke="rgba(62,40,27,0.2)"
          strokeWidth="1.2"
        />
        <ellipse cx="20" cy="22" rx="7" ry="11" fill="var(--color-white)" opacity="0.35" />
        <line x1="18" y1="58" x2="14" y2="74" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="1.3" />
        <line x1="46" y1="58" x2="50" y2="74" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="1.3" />
        <line x1="32" y1="61" x2="32" y2="74" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="1.3" />
        <rect x="12" y="72" width="40" height="13" rx="4" fill="var(--color-sun-dark)" stroke="rgba(62,40,27,0.35)" strokeWidth="1.3" />
        <rect x="12" y="72" width="40" height="4.5" rx="2.2" fill="var(--color-sun)" opacity="0.8" />
      </svg>
    </div>
  );
}

function RainbowGate({ active }: { active: boolean }) {
  const bands = ["var(--color-bloom)", "var(--color-sun)", "var(--color-mint)", "var(--color-peach)", "var(--color-lavender)"];
  return (
    <div
      aria-hidden="true"
      className={`relative ${active ? "scene-balloon-pop" : "opacity-45"}`}
      style={{ width: 128, height: 72 }}
    >
      <svg viewBox="0 0 160 90" width="100%" height="100%" aria-hidden="true" focusable="false">
        <g fill="none" strokeLinecap="round">
          {bands.map((color, i) => (
            <path
              key={color}
              d={`M ${10 + i * 7} 90 A ${70 - i * 7} ${70 - i * 7} 0 0 1 ${150 - i * 7} 90`}
              stroke={color}
              strokeWidth="9"
            />
          ))}
        </g>
      </svg>
      {active && <span className="scene-balloon-sparkle absolute -top-1 left-1/2 -translate-x-1/2 text-base">✨</span>}
    </div>
  );
}

function Birds() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="scene-balloon-bird absolute text-base sm:text-lg"
          style={{ top: `${6 + i * 9}%`, left: `${6 + i * 10}%`, animationDelay: `${i * 0.6}s` }}
        >
          🐦
        </span>
      ))}
    </>
  );
}

function Confetti({ tint }: { tint: TintStyle }) {
  const colors = ["var(--color-sun)", "var(--color-bloom)", tint.shadowDark, "var(--color-lavender)", "var(--color-mint)"];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-3 h-16 overflow-visible">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="scene-balloon-confetti absolute block h-2 w-1.5 rounded-sm"
          style={{
            left: `${4 + i * 9.5}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${(i % 5) * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const islands = Array.from({ length: total });

  return (
    <div className="relative overflow-x-auto rounded-3xl bg-gradient-to-b from-sky-100 via-sky-50 to-(--color-cloud) px-4 py-8 shadow-[inset_0_2px_8px_rgba(46,42,33,0.08)]">
      <style>{`
        @keyframes scene-balloon-bob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .scene-balloon-bob { animation: scene-balloon-bob 3.4s ease-in-out infinite; }

        @keyframes scene-balloon-cloud-pulse {
          0%, 100% { box-shadow: 0 0 0 0 transparent; }
          50% { box-shadow: 0 0 0 5px var(--scene-balloon-glow-color), 0 8px 16px -6px var(--scene-balloon-glow-color); }
        }
        .scene-balloon-cloud-pulse { animation: scene-balloon-cloud-pulse 2.6s ease-in-out infinite; }

        @keyframes scene-balloon-sparkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(15deg); }
        }
        .scene-balloon-sparkle { animation: scene-balloon-sparkle 1.8s ease-in-out infinite; }

        @keyframes scene-balloon-flag {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .scene-balloon-flag { animation: scene-balloon-flag 2.2s ease-in-out infinite; }

        @keyframes scene-balloon-pop {
          0% { opacity: 0; transform: scale(0.6) translateY(10px); }
          60% { opacity: 1; transform: scale(1.08) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .scene-balloon-pop { animation: scene-balloon-pop 0.6s cubic-bezier(.34,1.56,.64,1) both; }

        @keyframes scene-balloon-bird {
          0% { transform: translateX(-8px) translateY(0); opacity: 0; }
          12% { opacity: 1; }
          50% { transform: translateX(60px) translateY(-6px); }
          88% { opacity: 1; }
          100% { transform: translateX(128px) translateY(0); opacity: 0; }
        }
        .scene-balloon-bird { animation: scene-balloon-bird 6s ease-in-out infinite; }

        @keyframes scene-balloon-confetti {
          0% { transform: translateY(-8px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(68px) rotate(220deg); opacity: 0; }
        }
        .scene-balloon-confetti { animation: scene-balloon-confetti 1.6s ease-in infinite; }

        @keyframes scene-balloon-sun {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.12); opacity: 1; }
        }
        .scene-balloon-sun { animation: scene-balloon-sun 4s ease-in-out infinite; }

        @keyframes scene-balloon-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
        .scene-balloon-drift { animation: scene-balloon-drift 7s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .scene-balloon-bob,
          .scene-balloon-cloud-pulse,
          .scene-balloon-sparkle,
          .scene-balloon-flag,
          .scene-balloon-bird,
          .scene-balloon-confetti,
          .scene-balloon-sun,
          .scene-balloon-drift {
            animation: none !important;
          }
          .scene-balloon-pop {
            animation-duration: 0.001ms !important;
          }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <span className="scene-balloon-sun absolute right-8 top-4 text-2xl sm:right-12 sm:text-3xl">☀️</span>
        <CloudPuff
          fill="var(--color-white)"
          className="scene-balloon-drift absolute left-6 top-5 h-7 w-12 opacity-50 sm:left-10"
        />
        <CloudPuff
          fill="var(--color-white)"
          className="scene-balloon-drift absolute left-1/3 top-2 h-6 w-10 opacity-35"
          style={{ animationDelay: "1.2s" }}
        />
        {finished && <Birds />}
      </div>

      <div className="relative z-10 flex min-w-max items-end gap-5 px-3 pt-24 pb-1 sm:gap-7 sm:pt-28">
        {islands.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const state: IslandState = current ? "current" : done ? "done" : "upcoming";
          const lift = !current && i % 2 === 1 ? "mb-5" : "mb-0";
          return (
            <div key={i} className={`relative flex shrink-0 flex-col items-center ${lift}`}>
              {current && (
                <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2">
                  <HotAirBalloon tint={tint} />
                </div>
              )}
              <CloudIsland tint={tint} state={state} />
            </div>
          );
        })}

        <div className="relative flex shrink-0 flex-col items-center">
          {finished && (
            <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2">
              <HotAirBalloon tint={tint} />
            </div>
          )}
          <RainbowGate active={finished} />
          <CloudIsland tint={tint} state={finished ? "finish" : "finishPending"} />
          {finished && <Confetti tint={tint} />}
        </div>
      </div>

      <span className="sr-only" role="status">
        {finished
          ? "Khinh khí cầu đã đến nơi dưới cầu vồng!"
          : `Khinh khí cầu đang bay tới đảo mây số ${Math.min(index + 1, Math.max(total, 1))} trong ${total}.`}
      </span>
    </div>
  );
}
