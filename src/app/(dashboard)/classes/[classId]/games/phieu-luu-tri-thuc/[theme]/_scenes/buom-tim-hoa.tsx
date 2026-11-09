import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Bướm tìm hoa" — a meadow the butterfly flutters across, flower by flower,
// toward one big blossom at the finish. Unlike a static flower-bed grid, the
// focal point here is motion: the butterfly re-flies-in to whichever flower
// is current, wings flapping, while flowers behind it look happily wilted
// (with a little sparkle) and flowers ahead are still closed buds.

const PETAL_VARS = [
  "--color-bloom",
  "--color-sun",
  "--color-lavender",
  "--color-mint",
  "--color-sun-dark",
  "--color-mint-dark",
];

function petalColor(i: number) {
  return `var(${PETAL_VARS[i % PETAL_VARS.length]})`;
}

const WAVE_OFFSETS = [0, -16, -4, -22, -10, -18, -2];
const TUFT_LEFT = [4, 11, 19, 27, 35, 44, 53, 62, 71, 80, 88, 95];

function OpenFlower({ color, size, current }: { color: string; size: number; current?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={current ? "scene-butterfly-sway" : undefined}
      style={{ transformOrigin: "24px 40px" }}
    >
      <ellipse cx="24" cy="41" rx="3" ry="5" fill="var(--color-peach)" opacity="0.5" />
      <g style={{ transformOrigin: "24px 24px" }}>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse key={angle} cx="24" cy="13" rx="7" ry="11" fill={color} transform={`rotate(${angle} 24 24)`} />
        ))}
      </g>
      <circle cx="24" cy="24" r="7" fill="var(--color-sun)" />
      <circle cx="21.5" cy="21.5" r="1.4" fill="var(--color-ink)" opacity="0.35" />
      <circle cx="26.5" cy="23" r="1" fill="var(--color-ink)" opacity="0.25" />
    </svg>
  );
}

function WiltedFlower({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="41" rx="3" ry="5" fill="var(--color-peach)" opacity="0.45" />
      <g transform="rotate(10 24 24)" opacity="0.85">
        {[20, 80, 150, 220, 290].map((angle) => (
          <ellipse
            key={angle}
            cx="24"
            cy="16"
            rx="6"
            ry="9"
            fill={color}
            transform={`rotate(${angle} 24 24)`}
          />
        ))}
      </g>
      <circle cx="24" cy="25" r="6" fill="var(--color-sun-dark)" opacity="0.9" />
    </svg>
  );
}

function Bud({ color, size }: { color: string; size: number }) {
  const w = size * 0.62;
  return (
    <svg width={w} height={size} viewBox="0 0 30 46">
      <path
        d="M15 5 C21 5 25 15 25 24 C25 34 20.5 41 15 41 C9.5 41 5 34 5 24 C5 15 9 5 15 5 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M15 39 L15 45 M9.5 41 L6 45.5 M20.5 41 L24 45.5"
        stroke="var(--color-peach)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Sparkle({ delay }: { delay: number }) {
  return (
    <span
      aria-hidden="true"
      className="scene-butterfly-twinkle absolute -right-1 -top-1 text-sm"
      style={{ color: "var(--color-sun)", animationDelay: `${delay}ms` }}
    >
      ✦
    </span>
  );
}

function Butterfly({ size, landed }: { size: number; landed?: boolean }) {
  return (
    <svg
      width={size}
      height={size * 0.78}
      viewBox="0 0 64 50"
      className={landed ? "scene-butterfly-rest" : "scene-butterfly-bob"}
      aria-hidden="true"
    >
      <g className={landed ? "scene-butterfly-wing-left-slow" : "scene-butterfly-wing-left"} style={{ transformOrigin: "32px 25px" }}>
        <path d="M31 25 C21 3 2 4 3 19 C4 33 20 32 31 25 Z" fill="var(--color-bloom)" />
        <circle cx="13" cy="17" r="3.2" fill="var(--color-sun)" opacity="0.9" />
      </g>
      <g className={landed ? "scene-butterfly-wing-right-slow" : "scene-butterfly-wing-right"} style={{ transformOrigin: "32px 25px" }}>
        <path d="M33 25 C43 3 62 4 61 19 C60 33 44 32 33 25 Z" fill="var(--color-lavender)" />
        <circle cx="51" cy="17" r="3.2" fill="var(--color-sun)" opacity="0.9" />
      </g>
      <ellipse cx="32" cy="27" rx="2.4" ry="11" fill="var(--color-ink)" />
      <path d="M30 17 C28 13 26 11 24 10 M34 17 C36 13 38 11 40 10" stroke="var(--color-ink)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PollenBurst({ tintShadow }: { tintShadow: string }) {
  const particles = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {particles.map((p) => {
        const angle = (p / particles.length) * 360;
        const color = p % 2 === 0 ? "var(--color-sun)" : "var(--color-bloom)";
        return (
          <span
            key={p}
            className="scene-butterfly-burst absolute left-1/2 top-1/2 block size-1.5 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 4px 0 ${tintShadow}`,
              transform: `rotate(${angle}deg)`,
              animationDelay: `${p * 70}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-[inset_0_2px_6px_rgba(46,42,33,0.06)]">
      <style>{`
        @keyframes scene-butterfly-flap-left {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.45) rotate(-6deg); }
        }
        @keyframes scene-butterfly-flap-right {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.45) rotate(6deg); }
        }
        @keyframes scene-butterfly-flap-slow-left {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.75); }
        }
        @keyframes scene-butterfly-flap-slow-right {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.75); }
        }
        @keyframes scene-butterfly-bob-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes scene-butterfly-fly-in {
          0% { transform: translate(-26px, -10px) rotate(-14deg) scale(0.7); opacity: 0; }
          60% { opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes scene-butterfly-twinkle-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes scene-butterfly-sway-petals {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes scene-butterfly-burst-particle {
          0% { transform: rotate(var(--a, 0deg)) translateX(0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--a, 0deg)) translateX(46px) scale(0.3); opacity: 0; }
        }
        .scene-butterfly-wing-left { animation: scene-butterfly-flap-left 0.9s ease-in-out infinite; }
        .scene-butterfly-wing-right { animation: scene-butterfly-flap-right 0.9s ease-in-out infinite; }
        .scene-butterfly-wing-left-slow { animation: scene-butterfly-flap-slow-left 2.6s ease-in-out infinite; }
        .scene-butterfly-wing-right-slow { animation: scene-butterfly-flap-slow-right 2.6s ease-in-out infinite; }
        .scene-butterfly-bob { animation: scene-butterfly-bob-float 2.2s ease-in-out infinite, scene-butterfly-fly-in 0.5s cubic-bezier(.34,1.56,.64,1); }
        .scene-butterfly-rest { animation: scene-butterfly-fly-in 0.6s cubic-bezier(.34,1.56,.64,1); }
        .scene-butterfly-twinkle { animation: scene-butterfly-twinkle-pulse 1.8s ease-in-out infinite; }
        .scene-butterfly-sway { animation: scene-butterfly-sway-petals 2.4s ease-in-out infinite; }
        .scene-butterfly-burst { animation: scene-butterfly-burst-particle 0.9s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .scene-butterfly-wing-left, .scene-butterfly-wing-right,
          .scene-butterfly-wing-left-slow, .scene-butterfly-wing-right-slow,
          .scene-butterfly-bob, .scene-butterfly-rest, .scene-butterfly-twinkle,
          .scene-butterfly-sway, .scene-butterfly-burst {
            animation: none !important;
          }
        }
      `}</style>

      {/* sky */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-(--color-cloud) via-white to-white" />
      {/* sun */}
      <div
        aria-hidden="true"
        className="absolute right-6 top-4 size-8 rounded-full sm:size-10"
        style={{ background: "var(--color-sun)", boxShadow: "0 0 18px 4px var(--color-sun)" }}
      />
      {/* meadow horizon */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-20 sm:h-24 ${tint.bgLight}`}
        style={{ borderRadius: "50% 50% 0 0 / 70px 70px 0 0" }}
      />
      {/* grass tufts */}
      {TUFT_LEFT.map((left, i) => (
        <svg
          key={left}
          aria-hidden="true"
          className="absolute bottom-2 sm:bottom-3"
          style={{ left: `${left}%` }}
          width="14"
          height="16"
          viewBox="0 0 14 16"
        >
          <path
            d={i % 2 === 0 ? "M2 16 C2 8 5 4 7 0 M7 16 C7 9 9 5 12 1" : "M1 16 C1 9 3 5 5 1 M7 16 C7 8 8 4 9 0"}
            stroke="var(--color-peach)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
        </svg>
      ))}

      <div className="relative overflow-x-auto px-5 py-8 sm:px-8">
        <p className="sr-only">
          Bướm đang ở hoa số {Math.min(index + 1, total)} trên {total}
          {finished ? ", đã về tới bông hoa lớn ở đích." : "."}
        </p>
        <div className="relative flex min-w-max items-end gap-5 px-2 sm:gap-7" style={{ minHeight: 120 }}>
          {steps.map((_, i) => {
            const done = finished || i < index;
            const current = !finished && i === index;
            const offset = WAVE_OFFSETS[i % WAVE_OFFSETS.length];
            const size = current ? 54 : 38 + (i % 3) * 4;
            return (
              <div
                key={i}
                className="relative flex shrink-0 flex-col items-center justify-end"
                style={{ transform: `translateY(${offset}px)`, width: current ? 72 : 48 }}
              >
                {current && (
                  <div className="relative mb-1">
                    <Butterfly size={46} />
                  </div>
                )}
                <div className="relative">
                  {done && !current && <Sparkle delay={(i * 130) % 600} />}
                  {current ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -m-2 rounded-full blur-sm"
                        style={{ background: tint.shadowDark, opacity: 0.18 }}
                      />
                      <OpenFlower color={petalColor(i)} size={size} current />
                    </>
                  ) : done ? (
                    <WiltedFlower color={petalColor(i)} size={size} />
                  ) : (
                    <Bud color={petalColor(i)} size={size} />
                  )}
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1 block h-1 w-5 rounded-full"
                  style={{ background: tint.shadowDark, opacity: 0.15 }}
                />
              </div>
            );
          })}

          {/* finish: the big blossom */}
          <div className="relative flex shrink-0 flex-col items-center justify-end" style={{ width: 90 }}>
            {finished && (
              <div className="relative mb-1">
                <Butterfly size={48} landed />
              </div>
            )}
            <div className="relative">
              {finished && <PollenBurst tintShadow={tint.shadowDark} />}
              <span
                aria-hidden="true"
                className={`absolute inset-0 -m-3 rounded-full blur-md transition-opacity duration-500 ${finished ? "opacity-30" : "opacity-0"}`}
                style={{ background: tint.shadowDark }}
              />
              <svg width={finished ? 76 : 60} height={finished ? 76 : 60} viewBox="0 0 80 80" className="relative">
                <g opacity={finished ? 1 : 0.55}>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <ellipse key={angle} cx="40" cy="20" rx="9" ry="17" fill="var(--color-bloom)" transform={`rotate(${angle} 40 40)`} />
                  ))}
                  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
                    <ellipse key={angle} cx="40" cy="26" rx="6" ry="11" fill="var(--color-sun)" transform={`rotate(${angle} 40 40)`} opacity="0.9" />
                  ))}
                  <circle cx="40" cy="40" r="10" fill="var(--color-sun-dark)" />
                </g>
              </svg>
            </div>
            <span
              aria-hidden="true"
              className="mt-1 block h-1.5 w-8 rounded-full"
              style={{ background: tint.shadowDark, opacity: finished ? 0.3 : 0.15 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
