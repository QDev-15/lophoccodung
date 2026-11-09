import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Tiệm Sinh Tố" (the smoothie shop) — bespoke journey scene. Each correct
// answer blends and caps one smoothie cup on the shop counter; the chef
// mascot stirs the current cup, finished cups line up "sold" with a straw
// and fruit garnish, and upcoming cups wait as empty glasses. Finishing the
// whole row opens the shop with a banner + confetti.

// Fruit flavor cycle for cup liquid + garnish — pulled from the shared
// palette (never `bloom`, which is reserved project-wide for upsell), so
// variety across cups stays inside the app's existing color system.
const FRUITS = [
  { liquid: "var(--color-sun)", garnish: "🍌" },
  { liquid: "var(--color-mint)", garnish: "🥭" },
  { liquid: "var(--color-lavender)", garnish: "🫐" },
  { liquid: "var(--color-sun-dark)", garnish: "🍊" },
  { liquid: "var(--color-peach)", garnish: "🥝" },
];

// Fixed confetti layout (left-offset %, timing, color, tilt) so the grand-
// opening burst looks hand-scattered without re-randomizing on every render.
const CONFETTI: Array<{ left: number; delay: number; dur: number; rot: number; color: string }> = [
  { left: 4, delay: 0, dur: 2.2, rot: 15, color: "var(--color-sun)" },
  { left: 13, delay: 0.3, dur: 2.6, rot: -20, color: "var(--color-lavender)" },
  { left: 22, delay: 0.1, dur: 2.0, rot: 35, color: "var(--color-mint)" },
  { left: 31, delay: 0.5, dur: 2.4, rot: -10, color: "var(--color-sun-dark)" },
  { left: 40, delay: 0.2, dur: 2.8, rot: 25, color: "var(--color-peach)" },
  { left: 50, delay: 0.4, dur: 2.1, rot: -30, color: "var(--color-lavender)" },
  { left: 59, delay: 0.0, dur: 2.5, rot: 10, color: "var(--color-sun)" },
  { left: 68, delay: 0.6, dur: 2.3, rot: -15, color: "var(--color-mint)" },
  { left: 77, delay: 0.25, dur: 2.7, rot: 40, color: "var(--color-sun-dark)" },
  { left: 86, delay: 0.45, dur: 2.0, rot: -25, color: "var(--color-peach)" },
  { left: 94, delay: 0.15, dur: 2.6, rot: 20, color: "var(--color-lavender)" },
  { left: 17, delay: 0.55, dur: 2.2, rot: -5, color: "var(--color-sun)" },
];

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const safeTotal = Math.max(total, 0);
  const cups = Array.from({ length: safeTotal });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-(--color-cloud) to-white shadow-[inset_0_2px_6px_rgba(46,42,33,0.06)]">
      <style>{`
        @keyframes scene-smoothie-swirl {
          to { transform: rotate(360deg); }
        }
        @keyframes scene-smoothie-bubble-rise {
          0% { translate: 0 0; opacity: 0; }
          25% { opacity: 1; }
          100% { translate: 0 -22px; opacity: 0; }
        }
        @keyframes scene-smoothie-chef-wiggle {
          0%, 100% { rotate: -4deg; }
          50% { rotate: 5deg; }
        }
        @keyframes scene-smoothie-chef-cheer {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-6px) rotate(6deg); }
        }
        @keyframes scene-smoothie-banner-in {
          0% { transform: translateY(-14px) scale(0.75); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes scene-smoothie-confetti-fall {
          0% { translate: 0 -12px; opacity: 0; }
          15% { opacity: 1; }
          100% { translate: 0 150px; opacity: 0; }
        }
        @keyframes scene-smoothie-cup-pop {
          0% { transform: scale(0.85); }
          60% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .scene-smoothie-swirl { animation: scene-smoothie-swirl 2.6s linear infinite; }
        .scene-smoothie-bubble { animation: scene-smoothie-bubble-rise 1.6s ease-in infinite; }
        .scene-smoothie-chef { animation: scene-smoothie-chef-wiggle 1.4s ease-in-out infinite; }
        .scene-smoothie-chef-cheer { animation: scene-smoothie-chef-cheer 0.7s ease-in-out infinite; }
        .scene-smoothie-banner { animation: scene-smoothie-banner-in 0.45s cubic-bezier(.34, 1.56, .64, 1) both; }
        .scene-smoothie-confetti { animation: scene-smoothie-confetti-fall linear infinite; }
        .scene-smoothie-cup-current { animation: scene-smoothie-cup-pop 0.35s cubic-bezier(.34, 1.56, .64, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .scene-smoothie-swirl,
          .scene-smoothie-bubble,
          .scene-smoothie-chef,
          .scene-smoothie-chef-cheer,
          .scene-smoothie-confetti,
          .scene-smoothie-cup-current {
            animation: none !important;
          }
        }
      `}</style>

      {/* scalloped shop awning */}
      <div aria-hidden="true" className="flex h-3.5 w-full overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className={`-mt-2 h-5 w-full shrink-0 rounded-b-full ${i % 2 === 0 ? tint.bg : "bg-white"}`}
          />
        ))}
      </div>

      <div className="px-5 pb-6 pt-3">
        {/* shop header: sign + chef badge */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{theme.emoji}</span>
            <span className="text-base font-bold text-(--color-ink) sm:text-lg">Tiệm Sinh Tố</span>
          </div>
          <div
            className={`relative flex size-11 items-center justify-center rounded-full border-2 border-white shadow-[0_2px_6px_-2px_rgba(46,42,33,0.25)] sm:size-12 ${tint.bgLight}`}
          >
            <span
              className={`text-2xl sm:text-3xl ${finished ? "scene-smoothie-chef-cheer" : "scene-smoothie-chef"}`}
              aria-hidden="true"
            >
              {finished ? theme.finishIcon : theme.mascot}
            </span>
          </div>
        </div>

        <span className="sr-only">
          {finished ? "Đã pha xong tất cả cốc sinh tố, tiệm khai trương!" : `Đã pha ${index}/${safeTotal} cốc sinh tố`}
        </span>

        {/* counter with the row of cups */}
        <div className="relative overflow-x-auto rounded-2xl bg-white/60 px-4 pb-5 pt-8">
          <div className="relative flex min-w-max items-end gap-3 sm:gap-4">
            {cups.map((_, i) => {
              const done = finished || i < index;
              const current = !finished && i === index;
              const fruit = FRUITS[i % FRUITS.length];

              if (done) {
                return (
                  <div key={i} className="relative flex shrink-0 flex-col items-center">
                    <span
                      aria-hidden="true"
                      className="absolute -top-3.5 right-1 z-10 text-base sm:text-lg"
                      style={{ transform: "rotate(18deg)" }}
                    >
                      {fruit.garnish}
                    </span>
                    <div
                      aria-hidden="true"
                      className="absolute -top-2 right-2.5 z-10 h-5 w-1.5 rounded-full bg-gradient-to-b from-white to-(--color-ink)/20 shadow-sm sm:h-6"
                      style={{ transform: "rotate(22deg)" }}
                    />
                    <div
                      className="relative h-14 w-11 shrink-0 overflow-hidden rounded-b-xl rounded-t-md border border-(--color-ink)/10 shadow-[0_3px_6px_-2px_rgba(46,42,33,0.25)] sm:h-16 sm:w-12"
                      style={{ clipPath: "polygon(0% 0%, 100% 0%, 86% 100%, 14% 100%)" }}
                    >
                      <div className="absolute inset-0" style={{ background: fruit.liquid }} />
                      <div className="absolute inset-x-0 top-0 h-2 bg-white/50" />
                      <div className="absolute left-1 top-1 h-6 w-1 rounded-full bg-white/40 sm:h-8" />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute -top-1 z-10 h-2 w-9 rounded-full border border-(--color-ink)/10 bg-white/90 sm:w-10"
                    />
                  </div>
                );
              }

              if (current) {
                return (
                  <div
                    key={i}
                    className="scene-smoothie-cup-current relative flex shrink-0 flex-col items-center"
                  >
                    <span
                      aria-hidden="true"
                      className={`adv-ping absolute -top-2 h-16 w-14 rounded-full border-2 sm:h-20 sm:w-16`}
                      style={{ borderColor: tint.shadowDark }}
                    />
                    <div
                      className="relative h-16 w-14 shrink-0 overflow-hidden rounded-b-2xl rounded-t-lg border-2 bg-white/70 shadow-[0_4px_10px_-2px_rgba(46,42,33,0.3)] sm:h-20 sm:w-16"
                      style={{ clipPath: "polygon(0% 0%, 100% 0%, 84% 100%, 16% 100%)", borderColor: tint.shadowDark }}
                    >
                      <div className="absolute inset-x-0 bottom-0 h-[78%]" style={{ background: fruit.liquid }}>
                        <div
                          className="scene-smoothie-swirl absolute -inset-4 opacity-60"
                          style={{
                            background:
                              "conic-gradient(from 0deg, transparent, rgba(255,255,255,.75), transparent 40%, transparent)",
                          }}
                        />
                      </div>
                      {[0, 1, 2].map((b) => (
                        <span
                          key={b}
                          className="scene-smoothie-bubble absolute size-1.5 rounded-full bg-white/80"
                          style={{
                            left: `${28 + b * 18}%`,
                            bottom: "20%",
                            animationDelay: `${b * 0.4}s`,
                          }}
                        />
                      ))}
                      <div className="absolute inset-x-0 top-0 h-2 bg-white/40" />
                    </div>
                    <span className="mt-1 text-[11px] font-semibold text-(--color-ink)/60 sm:text-xs">
                      đang pha…
                    </span>
                  </div>
                );
              }

              // upcoming: empty glass, waiting
              return (
                <div key={i} className="relative flex shrink-0 flex-col items-center opacity-60">
                  <div
                    className="relative h-12 w-10 shrink-0 translate-y-1 overflow-hidden rounded-b-xl rounded-t-md border-2 border-dashed border-(--color-ink)/20 bg-white/40 sm:h-14 sm:w-11"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 86% 100%, 14% 100%)" }}
                  />
                </div>
              );
            })}
          </div>

          {/* counter ledge shadow */}
          <div
            aria-hidden="true"
            className="mt-3 h-2 rounded-full bg-(--color-ink)/10"
          />
          {/* progress drip */}
          <div
            aria-hidden="true"
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-(--color-ink)/10"
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r ${tint.gradient} transition-[width] duration-500 ease-out`}
              style={{ width: `${finished ? 100 : safeTotal > 0 ? Math.min(100, (index / safeTotal) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {finished && (
        <div className="pointer-events-none absolute inset-0">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="scene-smoothie-confetti absolute top-0 h-3 w-2 rounded-sm"
              style={{
                left: `${c.left}%`,
                backgroundColor: c.color,
                rotate: `${c.rot}deg`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.dur}s`,
              }}
            />
          ))}
          <div className="absolute inset-x-0 top-1 flex justify-center px-4">
            <div
              className={`scene-smoothie-banner rounded-full border-2 border-white px-4 py-1.5 text-center text-sm font-extrabold text-white shadow-[0_4px_10px_-2px_rgba(46,42,33,0.35)] sm:text-base bg-gradient-to-r ${tint.gradient}`}
            >
              🎉 KHAI TRƯƠNG THÀNH CÔNG! 🎉
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
