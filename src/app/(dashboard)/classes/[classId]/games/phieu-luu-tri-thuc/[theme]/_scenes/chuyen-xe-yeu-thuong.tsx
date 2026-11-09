import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for "Chuyến Xe Yêu Thương" (the bus of love): a school bus
// drives a winding road past roadside mile-marker signposts toward a big
// heart finish arch. This intentionally reads as a ROAD trip (curvy road,
// roadside signposts, a bus with wheels) — not a train/station theme.

type Point = { x: number; y: number };

const SPACING = 92;
const PAD_X = 60;
const AMPLITUDE = 18;
const HEIGHT = 220;
const CENTER_Y = 148;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

// Road-center points, one per mile marker plus one extra for the finish arch.
function roadPoints(stepCount: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= stepCount; i++) {
    pts.push({
      x: PAD_X + i * SPACING,
      y: CENTER_Y + Math.sin(i * 0.85 + 0.4) * AMPLITUDE,
    });
  }
  return pts;
}

// Catmull-Rom -> cubic Bezier smoothing so the road reads as a gentle,
// continuous winding path rather than a jagged zig-zag between markers.
function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function HeartIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 32 29" className={className} style={style} aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 28.2C16 28.2 1.2 19 1.2 9.6 1.2 3.9 5.9 1 10.3 1c3 0 5.1 1.9 5.7 3.5C16.6 2.9 18.7 1 21.7 1c4.4 0 9.1 2.9 9.1 8.6 0 9.4-14.8 18.6-14.8 18.6Z"
      />
    </svg>
  );
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const stepCount = Math.max(total, 1);
  const points = roadPoints(stepCount);
  const markers = points.slice(0, stepCount);
  const finishPoint = points[points.length - 1];
  const width = finishPoint.x + PAD_X;

  const busIdx = clamp(index, 0, stepCount - 1);
  const busPoint = finished ? finishPoint : markers[busIdx];
  const busPtIdx = finished ? points.length - 1 : busIdx;
  const prev = points[Math.max(busPtIdx - 1, 0)];
  const next = points[Math.min(busPtIdx + 1, points.length - 1)];
  const tiltDeg = clamp((Math.atan2(next.y - prev.y, next.x - prev.x) * 180) / Math.PI, -10, 10);

  const roadD = smoothPath(points);

  return (
    <div className="relative overflow-x-auto overflow-y-hidden rounded-3xl bg-gradient-to-b from-(--color-cloud) to-white/70 px-5 py-6 shadow-[inset_0_2px_6px_rgba(46,42,33,0.08)]">
      <div className="relative" style={{ width: `${width}px`, height: `${HEIGHT}px` }}>
        {/* soft sky clouds, purely decorative */}
        <div aria-hidden="true" className="scene-bus-cloud absolute left-6 top-1 h-7 w-16 rounded-full bg-white/70 blur-[1px]" />
        <div aria-hidden="true" className="scene-bus-cloud scene-bus-cloud-slow absolute left-48 top-6 h-5 w-11 rounded-full bg-white/60 blur-[1px]" />
        <div aria-hidden="true" className="scene-bus-cloud absolute right-20 top-0 h-6 w-14 rounded-full bg-white/60 blur-[1px]" />

        {/* grassy shoulder behind the road, tinted to the theme */}
        <div
          aria-hidden="true"
          className={`absolute left-0 right-0 rounded-full ${tint.bgLight} opacity-40`}
          style={{ top: CENTER_Y - AMPLITUDE - 26, height: AMPLITUDE * 2 + 52 }}
        />

        <svg aria-hidden="true" viewBox={`0 0 ${width} ${HEIGHT}`} width={width} height={HEIGHT} className="absolute inset-0">
          <path d={roadD} fill="none" stroke="var(--color-ink)" strokeOpacity={0.14} strokeWidth={30} strokeLinecap="round" transform="translate(0 5)" />
          <path d={roadD} fill="none" stroke="var(--color-ink)" strokeOpacity={0.75} strokeWidth={25} strokeLinecap="round" />
          <path
            d={roadD}
            fill="none"
            stroke="white"
            strokeOpacity={0.85}
            strokeWidth={1.6}
            strokeDasharray="9 11"
            strokeLinecap="round"
            className="scene-bus-dash"
          />
        </svg>

        {markers.map((p, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const side = i % 2 === 0 ? 24 : -24;
          const tilt = i % 2 === 0 ? -5 : 4;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: p.x + side, top: p.y - 2, transform: "translate(-50%, -100%)" }}
            >
              <div
                className={`relative flex h-7 w-8 items-center justify-center rounded-md border-2 text-[10px] font-bold shadow-[0_2px_4px_-1px_rgba(46,42,33,0.3)] ${
                  done
                    ? `${tint.bgLight} border-transparent ${tint.text}`
                    : current
                      ? `bg-white ring-2 ${tint.ring} border-transparent ${tint.text} scene-bus-sign-current`
                      : "border-(--color-ink)/15 bg-white text-(--color-ink)/40"
                }`}
                style={{ transform: `rotate(${tilt}deg)` }}
              >
                {current && (
                  <span
                    aria-hidden="true"
                    className="scene-bus-ping absolute inset-0 rounded-md border-2"
                    style={{ borderColor: tint.shadowDark }}
                  />
                )}
                {done ? <HeartIcon className="h-3.5 w-3.5 text-(--color-bloom)" /> : i + 1}
              </div>
              <div className="h-7 w-[3px] rounded-full bg-(--color-ink)/20" />
            </div>
          );
        })}

        {/* finish: big heart arch */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: finishPoint.x, top: finishPoint.y - 8, transform: "translate(-50%, -100%)" }}
        >
          <div className="relative">
            <HeartIcon className={`h-12 w-12 ${finished ? "scene-bus-heart-pop text-(--color-bloom)" : "text-(--color-bloom)/45"}`} />
            {finished && (
              <span
                aria-hidden="true"
                className="scene-bus-ping absolute -inset-2 rounded-full border-2"
                style={{ borderColor: tint.shadowDark }}
              />
            )}
            {finished && (
              <>
                <HeartIcon className="scene-bus-confetti absolute -left-5 -top-2 h-3 w-3 text-(--color-sun-dark)" style={{ animationDelay: "90ms" }} />
                <HeartIcon className="scene-bus-confetti absolute -right-5 -top-1 h-3 w-3 text-(--color-lavender)" style={{ animationDelay: "180ms" }} />
              </>
            )}
          </div>
          <div className="mt-9 h-9 w-[3px] rounded-full bg-(--color-ink)/20" />
        </div>

        {/* the bus itself */}
        <div
          className="absolute"
          style={{ left: busPoint.x, top: busPoint.y, transform: `translate(-50%, -82%) rotate(${tiltDeg}deg)` }}
        >
          <div className={finished ? "" : "scene-bus-bob"}>
            {!finished && (
              <>
                <span aria-hidden="true" className="scene-bus-puff absolute -left-5 top-6 h-2.5 w-2.5 rounded-full bg-(--color-ink)/20" />
                <span aria-hidden="true" className="scene-bus-puff scene-bus-puff-delay absolute -left-8 top-5 h-2 w-2 rounded-full bg-(--color-ink)/15" />
              </>
            )}

            <div className="relative flex flex-col items-center">
              <div className="h-2 w-11 rounded-t-full bg-white shadow-sm" />
              <div
                className={`relative flex h-10 w-16 items-center justify-center gap-1 rounded-2xl bg-gradient-to-b ${tint.gradient} shadow-[0_6px_10px_-4px_rgba(46,42,33,0.45)]`}
              >
                {[0, 1, 2].map((w) => (
                  <div key={w} className="flex h-5 w-4 items-center justify-center overflow-hidden rounded-[3px] bg-white/90">
                    <span className={`text-[9px] leading-none ${finished ? "scene-bus-wave" : ""}`}>{finished ? "🙂" : ""}</span>
                  </div>
                ))}
                <HeartIcon className="absolute -right-1 bottom-1 h-3 w-3 text-white/90" />
                {finished && <span aria-hidden="true" className="scene-bus-wave absolute -top-4 right-1 text-xs">👋</span>}
              </div>
              <div className="absolute -bottom-2 flex w-16 justify-between px-[7px]">
                <span className={`relative flex h-3 w-3 items-center justify-center rounded-full bg-(--color-ink) ${!finished ? "scene-bus-wheel" : ""}`}>
                  <span className="h-1 w-1 rounded-full bg-white/70" />
                </span>
                <span className={`relative flex h-3 w-3 items-center justify-center rounded-full bg-(--color-ink) ${!finished ? "scene-bus-wheel" : ""}`}>
                  <span className="h-1 w-1 rounded-full bg-white/70" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scene-bus-dashmove { to { stroke-dashoffset: -40; } }
        @keyframes scene-bus-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes scene-bus-wheel-spin { to { transform: rotate(360deg); } }
        @keyframes scene-bus-puff { 0% { opacity: .55; transform: translate(0,0) scale(.6); } 100% { opacity: 0; transform: translate(-14px,-12px) scale(1.3); } }
        @keyframes scene-bus-ping { 0% { opacity: .6; transform: scale(1); } 100% { opacity: 0; transform: scale(1.35); } }
        @keyframes scene-bus-wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(18deg); } }
        @keyframes scene-bus-pop { 0% { transform: scale(.4) rotate(-8deg); opacity: 0; } 70% { transform: scale(1.12) rotate(4deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes scene-bus-cloud-drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
        @keyframes scene-bus-confetti { 0% { transform: translateY(6px) scale(.4); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }

        .scene-bus-dash { animation: scene-bus-dashmove 1.6s linear infinite; }
        .scene-bus-bob { animation: scene-bus-bob 1.8s ease-in-out infinite; }
        .scene-bus-wheel { animation: scene-bus-wheel-spin .9s linear infinite; transform-origin: center; }
        .scene-bus-puff { animation: scene-bus-puff 1.1s ease-out infinite; }
        .scene-bus-puff-delay { animation-delay: .45s; }
        .scene-bus-ping { animation: scene-bus-ping 1.6s cubic-bezier(.34,1.56,.64,1) infinite; }
        .scene-bus-wave { display: inline-block; animation: scene-bus-wave 1s ease-in-out infinite; }
        .scene-bus-heart-pop { animation: scene-bus-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        .scene-bus-cloud { animation: scene-bus-cloud-drift 6s ease-in-out infinite; }
        .scene-bus-cloud-slow { animation-duration: 9s; }
        .scene-bus-confetti { animation: scene-bus-confetti .45s cubic-bezier(.34,1.56,.64,1) both; }
        .scene-bus-sign-current { animation: scene-bus-bob 1.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .scene-bus-dash,
          .scene-bus-bob,
          .scene-bus-wheel,
          .scene-bus-puff,
          .scene-bus-ping,
          .scene-bus-wave,
          .scene-bus-heart-pop,
          .scene-bus-cloud,
          .scene-bus-confetti,
          .scene-bus-sign-current {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
