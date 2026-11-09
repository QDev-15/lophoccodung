import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for "Leo núi chinh phục" (mountain conquest climb). Each correct
// answer moves the climber one rocky ledge further up a diagonal switchback trail
// that ends at a snowy, flag-topped summit. Unlike the generic DefaultScene trail,
// every ledge sits higher than the last (a real climb, not a flat row of dots),
// passed ledges keep a tiny planted flag + chalk mark, and finishing plants a big
// flag at the summit under a sunrise with confetti.

const TRAIL_H = 258; // px — fixed scene height; width grows with `total` and scrolls
const PAD_X = 46;
const STEP_GAP = 70;
const GROUND_Y = 40; // px from the bottom where the first ledge sits
const LEDGE_TOP_Y = TRAIL_H - 96; // px from the bottom where the last ledge sits
const SUMMIT_Y = TRAIL_H - 34; // px from the bottom where the flag plants

const ROCK_PATHS = [
  "M4,37 C1,28 4,19 11,15 C15,8 23,4 32,4 C41,4 49,8 53,15 C60,19 63,28 60,37 C60,40.5 58,42 55,42 L9,42 C6,42 4,40.5 4,37 Z",
  "M3,36 C0,27 6,17 14,14 C19,6 27,3 32,3 C39,3 46,7 51,14 C59,18 62,27 59,36 C59,40 57,42 54,42 L8,42 C5,42 3,40 3,36 Z",
];

const CONFETTI = [
  { dx: -18, dy: -6, delay: "0s", tint: "bg-(--color-sun)" },
  { dx: -4, dy: -16, delay: "0.12s", tint: "bg-(--color-peach)" },
  { dx: 12, dy: -4, delay: "0.24s", tint: "bg-(--color-lavender)" },
  { dx: 22, dy: -14, delay: "0.05s", tint: "bg-(--color-mint)" },
  { dx: -28, dy: -18, delay: "0.3s", tint: "bg-(--color-sun-dark)" },
  { dx: 4, dy: -24, delay: "0.18s", tint: "bg-white" },
];

function RockLedge({
  gradId,
  variant,
  current,
  shadowDark,
}: {
  gradId: string;
  variant: 0 | 1;
  current: boolean;
  shadowDark: string;
}) {
  return (
    <svg viewBox="0 0 64 44" className="absolute inset-0 h-full w-full drop-shadow-[0_6px_6px_rgba(46,42,33,0.28)]">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={current ? "#fff3e0" : "#efe3d3"} />
          <stop offset="55%" stopColor={current ? "#d9b48a" : "#b49a7e"} />
          <stop offset="100%" stopColor="#8a6a4c" />
        </linearGradient>
      </defs>
      <path
        d={ROCK_PATHS[variant]}
        fill={`url(#${gradId})`}
        stroke={current ? shadowDark : "#6e5339"}
        strokeWidth={current ? 2 : 1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniFlag({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 18 22" className="h-4 w-3.5 sm:h-5 sm:w-4" aria-hidden="true">
      <line x1="2" y1="21" x2="2" y2="2" stroke="#6e5339" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 3 L15 6.5 L2 11 Z" fill={color} />
    </svg>
  );
}

function ChalkMark() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2">
      <span className="relative block h-3 w-3 opacity-70">
        <span className="absolute left-1/2 top-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
        <span className="absolute left-1/2 top-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
      </span>
    </span>
  );
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const count = Math.max(total, 0);

  const lastX = PAD_X + STEP_GAP * Math.max(count - 1, 0);
  const summitX = lastX + STEP_GAP * 1.35;
  const trailWidth = Math.max(560, summitX + PAD_X);

  const points = Array.from({ length: count }, (_, i) => {
    const f = count > 1 ? i / (count - 1) : 1;
    const jitter = i % 3 === 0 ? -9 : i % 3 === 1 ? 8 : -2;
    const yFromBottom = GROUND_Y + f * (LEDGE_TOP_Y - GROUND_Y) + jitter;
    return { x: PAD_X + i * STEP_GAP, top: TRAIL_H - yFromBottom };
  });
  const summitPoint = { x: summitX, top: TRAIL_H - SUMMIT_Y };

  const climbedPts = [...points.slice(0, Math.min(index, count)), ...(finished ? [summitPoint] : [])];
  const fullPts = [...points, summitPoint];

  const toPolyline = (pts: { x: number; top: number }[]) => pts.map((p) => `${p.x},${p.top}`).join(" ");

  return (
    <div className="relative overflow-x-auto rounded-3xl bg-[linear-gradient(180deg,#eaf1fb_0%,#fbf0df_55%,#f7f1e7_100%)] px-4 py-5 shadow-[inset_0_2px_6px_rgba(46,42,33,0.08)]">
      <style>{`
        @keyframes scene-climb-sway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(5deg); } }
        @keyframes scene-climb-chalk { 0% { opacity: 0; transform: translate(0, 0) scale(0.5); } 35% { opacity: 0.85; } 100% { opacity: 0; transform: translate(8px, -16px) scale(1); } }
        @keyframes scene-climb-flagwave { 0%, 100% { transform: skewY(0deg); } 50% { transform: skewY(9deg); } }
        @keyframes scene-climb-sunpulse { 0%, 100% { opacity: 0.45; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }
        @keyframes scene-climb-confetti { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(var(--scx, 0px), 50px) rotate(260deg); opacity: 0; } }
        @keyframes scene-climb-ping { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
        .scene-climb-sway { animation: scene-climb-sway 1.8s ease-in-out infinite; transform-origin: 70% 90%; }
        .scene-climb-chalk { animation: scene-climb-chalk 1.5s ease-out infinite; }
        .scene-climb-flagwave { animation: scene-climb-flagwave 1.3s ease-in-out infinite; transform-origin: left center; }
        .scene-climb-sunpulse { animation: scene-climb-sunpulse 3.2s ease-in-out infinite; }
        .scene-climb-confetti { animation: scene-climb-confetti 1.1s ease-in forwards; }
        .scene-climb-ping { animation: scene-climb-ping 1.5s cubic-bezier(.34,1.56,.64,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .scene-climb-sway, .scene-climb-chalk, .scene-climb-flagwave, .scene-climb-sunpulse, .scene-climb-confetti, .scene-climb-ping {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative" style={{ width: trailWidth, height: TRAIL_H }}>
        {/* Distant misty peaks + clouds, purely decorative backdrop */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <svg viewBox={`0 0 ${trailWidth} ${TRAIL_H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <polygon
              points={`0,${TRAIL_H} 0,${TRAIL_H - 70} ${trailWidth * 0.25},${TRAIL_H - 130} ${trailWidth * 0.55},${TRAIL_H - 60} ${trailWidth * 0.8},${TRAIL_H - 150} ${trailWidth},${TRAIL_H - 90} ${trailWidth},${TRAIL_H}`}
              fill="#c9d6ea"
              opacity="0.55"
            />
            <polygon
              points={`${trailWidth * 0.55},${TRAIL_H} ${trailWidth * 0.62},${TRAIL_H - 90} ${trailWidth * 0.78},${TRAIL_H - 160} ${summitPoint.x + 24},${summitPoint.top - 36} ${summitPoint.x + 70},${TRAIL_H - 40} ${trailWidth},${TRAIL_H - 20} ${trailWidth},${TRAIL_H}`}
              fill="#a9876c"
              opacity="0.9"
            />
            <polygon
              points={`${summitPoint.x - 34},${summitPoint.top + 34} ${summitPoint.x - 8},${summitPoint.top + 2} ${summitPoint.x},${summitPoint.top - 10} ${summitPoint.x + 8},${summitPoint.top + 2} ${summitPoint.x + 30},${summitPoint.top + 30}`}
              fill="#ffffff"
              opacity="0.95"
            />
          </svg>
          <span
            className="scene-climb-sunpulse absolute rounded-full"
            style={{
              left: summitPoint.x - 46,
              top: summitPoint.top - 60,
              width: 92,
              height: 92,
              background: "radial-gradient(circle, var(--color-sun) 0%, rgba(251,191,36,0) 70%)",
            }}
          />
          <span className="absolute left-[8%] top-3 h-6 w-16 rounded-full bg-white/70 blur-md" />
          <span className="absolute left-[32%] top-8 h-5 w-12 rounded-full bg-white/60 blur-md" />
        </div>

        {/* Trail line: pale full path + colored climbed portion */}
        <svg viewBox={`0 0 ${trailWidth} ${TRAIL_H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <polyline points={toPolyline(fullPts)} fill="none" stroke="#c9b79a" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
          {climbedPts.length > 1 && (
            <polyline
              points={toPolyline(climbedPts)}
              fill="none"
              stroke={tint.shadowDark}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            />
          )}
        </svg>

        {/* Ledges */}
        {points.map((p, i) => {
          const done = i < index || finished;
          const current = i === index && !finished;
          const size = current ? 58 : 44;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: p.x,
                top: p.top,
                width: size,
                height: size * 0.7,
                transform: "translate(-50%, -30%)",
              }}
            >
              <RockLedge
                gradId={`leo-nui-rock-${i}`}
                variant={(i % 2) as 0 | 1}
                current={current}
                shadowDark={tint.shadowDark}
              />
              {done && !current && (
                <>
                  <ChalkMark />
                  <span className="absolute -top-3 right-0.5">
                    <MiniFlag color={tint.shadowDark} />
                  </span>
                  <span className={`absolute bottom-1 left-1.5 size-1.5 rounded-full ${tint.bg} opacity-80`} />
                </>
              )}
              {current && (
                <>
                  <span
                    aria-hidden="true"
                    className={`scene-climb-ping absolute inset-0 -top-2 rounded-full border-2 ${tint.ring}`}
                  />
                  <span
                    aria-hidden="true"
                    className="scene-climb-sway absolute -top-7 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl"
                  >
                    {theme.mascot}
                  </span>
                  <span
                    aria-hidden="true"
                    className="scene-climb-chalk absolute -top-3 left-[58%] size-1.5 rounded-full bg-white/90"
                  />
                  <span
                    aria-hidden="true"
                    className="scene-climb-chalk absolute -top-4 left-[48%] size-1 rounded-full bg-white/70"
                    style={{ animationDelay: "0.4s" }}
                  />
                </>
              )}
            </div>
          );
        })}

        {/* Summit */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: summitPoint.x, top: summitPoint.top, transform: "translate(-50%, -100%)" }}
        >
          {finished ? (
            <div className="relative flex flex-col items-center">
              <span aria-hidden="true" className="absolute -top-2 flex gap-1">
                {CONFETTI.map((c, i) => (
                  <span
                    key={i}
                    className={`scene-climb-confetti absolute size-2 rounded-sm ${c.tint}`}
                    style={{
                      left: c.dx,
                      top: c.dy,
                      animationDelay: c.delay,
                      "--scx": `${c.dx > 0 ? 14 : -14}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </span>
              <span className="animate-pop-in relative -mb-1 text-4xl sm:text-5xl" aria-hidden="true">
                {theme.mascot}
              </span>
              <span className="relative flex items-end">
                <svg viewBox="0 0 18 22" className="h-7 w-6" aria-hidden="true">
                  <line x1="2" y1="21" x2="2" y2="1" stroke="#6e5339" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M2 2 L16 6.5 L2 11 Z"
                    fill={tint.shadowDark}
                    className="scene-climb-flagwave"
                  />
                </svg>
              </span>
            </div>
          ) : (
            <svg viewBox="0 0 18 22" className="h-6 w-5 opacity-60" aria-hidden="true">
              <line x1="2" y1="21" x2="2" y2="1" stroke="#9c8268" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
            </svg>
          )}
        </div>
      </div>

      <p className="relative z-10 mt-2 text-center text-base font-bold text-(--color-ink)/75">
        {finished
          ? "🏔️ Đã chinh phục đỉnh núi!"
          : `🧗 Đang leo: mỏm đá ${Math.min(index + 1, Math.max(count, 1))}/${Math.max(count, 1)}`}
      </p>
    </div>
  );
}
