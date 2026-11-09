import { TINT_STYLES, type TintStyle } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for the "Du hành vũ trũ" (space voyage) theme: a dark
// starfield with a little rocket hopping from planet to planet toward a big
// glowing finish star. Everything here is scoped/prefixed `scene-space-*` so
// it can never collide with the engine's or another theme scene's styles.

// Deterministic star positions (percent) + size + twinkle delay — hand-picked
// so the sky looks scattered without using Math.random() (which would cause
// server/client render mismatches).
const STARS: Array<[number, number, number, number]> = [
  [4, 16, 2, 0], [9, 58, 3, 0.6], [14, 32, 2, 1.3], [19, 80, 2, 0.2],
  [24, 12, 3, 0.9], [29, 50, 2, 1.7], [34, 70, 2, 0.4], [40, 22, 3, 1.1],
  [46, 86, 2, 0.1], [52, 40, 2, 1.5], [58, 14, 3, 0.7], [63, 64, 2, 1.9],
  [69, 30, 2, 0.3], [74, 78, 3, 1.2], [80, 46, 2, 0.8], [85, 20, 2, 1.6],
  [90, 60, 3, 0.5], [95, 36, 2, 1.0], [12, 90, 2, 1.4], [62, 88, 2, 0.6],
  [37, 92, 2, 1.8], [88, 10, 2, 0.9],
];

// Planet color cycle, pulled only from design-system tokens.
const PLANET_COLORS = [
  "--color-mint",
  "--color-peach",
  "--color-sun",
  "--color-lavender",
  "--color-mint-dark",
  "--color-sun-dark",
];

function planetColor(i: number) {
  return `var(${PLANET_COLORS[i % PLANET_COLORS.length]})`;
}

function RocketGlyph({ tint }: { tint: TintStyle }) {
  return (
    <div
      aria-hidden="true"
      className="scene-space-rocket relative z-20 mb-1 flex flex-col items-center"
      style={{ filter: `drop-shadow(0 0 7px ${tint.shadowDark})` }}
    >
      <svg width="30" height="40" viewBox="0 0 40 52">
        <path
          d="M20 2 C28 10 30 24 27 36 L13 36 C10 24 12 10 20 2 Z"
          fill="var(--color-cloud)"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
        />
        <path d="M14 30 L26 30 L25 36 L15 36 Z" fill="var(--color-lavender)" opacity="0.85" />
        <circle cx="20" cy="16" r="5" fill="var(--color-lavender)" stroke="var(--color-ink)" strokeWidth="1" />
        <circle cx="18.3" cy="14.3" r="1.6" fill="white" opacity="0.85" />
        <path d="M13 34 L5 44 L13 39 Z" fill="var(--color-sun-dark)" stroke="var(--color-ink)" strokeWidth="1" />
        <path d="M27 34 L35 44 L27 39 Z" fill="var(--color-sun-dark)" stroke="var(--color-ink)" strokeWidth="1" />
      </svg>
      <span
        className="scene-space-flame -mt-1 block h-4 w-2.5 rounded-b-full"
        style={{ background: "linear-gradient(to bottom, var(--color-sun), var(--color-sun-dark))" }}
      />
    </div>
  );
}

function StardustBurst() {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {angles.map((deg, i) => (
        <span
          key={deg}
          className="scene-space-burst absolute left-1/2 top-1/2 size-1.5 rounded-full"
          style={{
            background: i % 2 === 0 ? "var(--color-sun)" : "var(--color-cloud)",
            transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-24px)`,
            animationDelay: `${(i % 4) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

function FinishStar({ finished }: { finished: boolean }) {
  return (
    <div
      className={`relative z-10 flex size-16 items-center justify-center sm:size-20 ${
        finished ? "scene-space-glow" : ""
      }`}
    >
      <svg
        viewBox="0 0 64 64"
        className="size-full drop-shadow-[0_0_14px_var(--color-sun)]"
        aria-hidden="true"
      >
        <polygon
          points="32,4 40,24 62,24 44,38 50,60 32,46 14,60 20,38 2,24 24,24"
          fill={finished ? "var(--color-sun)" : "var(--color-cloud)"}
          stroke="var(--color-sun-dark)"
          strokeWidth="2"
          opacity={finished ? 1 : 0.65}
        />
      </svg>
      {finished && (
        <span className="scene-space-pop absolute text-2xl sm:text-3xl" aria-hidden="true">
          🚀
        </span>
      )}
    </div>
  );
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const linePct = total > 0 ? Math.min(100, (index / total) * 100) : 0;
  const atFinish = total === 0 || index >= total;

  return (
    <div
      className="relative overflow-x-auto rounded-3xl bg-(--color-ink) px-5 py-8 shadow-[inset_0_2px_14px_rgba(0,0,0,0.5),0_10px_28px_-10px_var(--color-lavender)]"
      role="img"
      aria-label={
        finished
          ? "Phi thuyền đã đến ngôi sao đích"
          : `Phi thuyền đang ở hành tinh số ${index + 1} trên ${total}`
      }
    >
      <style>{`
        @keyframes scene-space-twinkle { 0%, 100% { opacity: .25; transform: scale(.75); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes scene-space-drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes scene-space-flicker { 0%, 100% { opacity: .7; transform: scaleY(1) scaleX(1); } 50% { opacity: 1; transform: scaleY(1.35) scaleX(.82); } }
        @keyframes scene-space-glowpulse { 0%, 100% { filter: drop-shadow(0 0 6px var(--color-sun)); } 50% { filter: drop-shadow(0 0 16px var(--color-sun)); } }
        @keyframes scene-space-burstmove { 0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--deg, 0deg)) translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--deg, 0deg)) translateY(-34px); } }
        @keyframes scene-space-pop { 0% { opacity: 0; transform: scale(.4) translateY(6px); } 60% { opacity: 1; transform: scale(1.1) translateY(0); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .scene-space-star { animation: scene-space-twinkle 2.6s ease-in-out infinite; }
        .scene-space-rocket { animation: scene-space-drift 2.4s ease-in-out infinite; }
        .scene-space-flame { animation: scene-space-flicker .45s ease-in-out infinite; }
        .scene-space-glow { animation: scene-space-glowpulse 1.8s ease-in-out infinite; }
        .scene-space-burst { animation: scene-space-burstmove 1.1s ease-out infinite; }
        .scene-space-pop { animation: scene-space-pop .4s cubic-bezier(.34, 1.56, .64, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .scene-space-star, .scene-space-rocket, .scene-space-flame, .scene-space-glow, .scene-space-burst, .scene-space-pop {
            animation: none !important;
          }
        }
      `}</style>

      {/* starfield + nebula glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        {STARS.map(([left, top, size, delay], i) => (
          <span
            key={i}
            className="scene-space-star absolute rounded-full bg-(--color-cloud)"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
          />
        ))}
        <div
          className="absolute -left-12 top-1/4 h-40 w-40 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--color-lavender)" }}
        />
        <div
          className="absolute right-0 top-0 h-32 w-32 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--color-sun)" }}
        />
      </div>

      <div className="relative z-10 flex min-w-max items-end gap-6 px-3 pb-1 pt-10">
        {/* flight path */}
        <div
          aria-hidden="true"
          className="absolute left-3 right-3 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tint.gradient} shadow-[0_0_10px_1px_var(--color-lavender)] transition-[width] duration-500 ease-out`}
            style={{ width: `${finished ? 100 : linePct}%` }}
          />
        </div>

        {steps.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const color = planetColor(i);
          const big = i % 3 === 1;
          const zig = i % 2 === 0 ? "-translate-y-1.5" : "translate-y-1.5";
          const hasRing = i % 4 === 2;

          return (
            <div key={i} className={`relative flex shrink-0 flex-col items-center ${current ? "" : zig}`}>
              {current && <RocketGlyph tint={tint} />}
              <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  current ? "size-16 sm:size-20" : big ? "size-12 sm:size-14" : "size-9 sm:size-11"
                }`}
                style={{
                  background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.7), ${color} 55%, rgba(0,0,0,.35) 100%)`,
                  boxShadow: current
                    ? `0 0 18px 4px ${color}, 0 4px 10px -3px rgba(0,0,0,.5)`
                    : `0 4px 8px -3px rgba(0,0,0,.5)${done ? ", 0 0 0 2px rgba(255,255,255,.3) inset" : ""}`,
                  opacity: done ? 0.8 : current ? 1 : 0.5,
                }}
              >
                {hasRing && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-[55%] w-[220%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-full border border-white/40"
                  />
                )}
                {done && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-white text-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  >
                    🚩
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* finish: big glowing star */}
        <div className="relative flex shrink-0 flex-col items-center">
          {finished && <StardustBurst />}
          <FinishStar finished={finished} />
        </div>
      </div>

      <p className="relative z-10 mt-4 text-center text-base font-semibold text-(--color-cloud)">
        {finished
          ? "Phi thuyền đã hạ cánh trên ngôi sao tri thức! 🌟"
          : atFinish
            ? "Sắp chạm tới ngôi sao rồi!"
            : `Hành tinh ${index + 1} / ${total}`}
      </p>
    </div>
  );
}
