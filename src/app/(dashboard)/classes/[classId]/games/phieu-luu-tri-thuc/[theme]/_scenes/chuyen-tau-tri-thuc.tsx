import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for "Chuyến tàu tri thức" (Knowledge train): a little cartoon
// engine chugs along a track through a row of station platforms. The current
// station is where the train sits (puffing smoke); passed stations raise a
// little flag; the final stop gets balloons + confetti once the class finishes.
export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const stations = Array.from({ length: total });
  const progressPct = total > 0 ? Math.min(100, (index / total) * 100) : 0;

  return (
    <div
      className={`relative overflow-x-auto rounded-3xl ${tint.bgLight} bg-gradient-to-b from-white/70 to-transparent px-5 pb-6 pt-10 shadow-[inset_0_2px_6px_rgba(46,42,33,0.06)]`}
    >
      {/* distant clouds for depth */}
      <span aria-hidden="true" className="scene-train-drift pointer-events-none absolute left-[8%] top-3 text-2xl opacity-60 sm:text-3xl">
        ☁️
      </span>
      <span
        aria-hidden="true"
        className="scene-train-drift pointer-events-none absolute right-[14%] top-6 text-xl opacity-50 sm:text-2xl"
        style={{ animationDelay: "-3s" }}
      >
        ☁️
      </span>

      <div className="relative flex min-w-max items-end gap-5 px-3 pb-2 sm:gap-7">
        {/* railway bed: ties + rails, with a glowing "traveled" overlay */}
        <div aria-hidden="true" className="absolute inset-x-1 bottom-9 h-4">
          <div
            className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full opacity-80"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, var(--color-ink) 0 5px, transparent 5px 22px)",
              backgroundRepeat: "repeat-x",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-(--color-ink)/35" />
          <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-(--color-ink)/35" />
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${tint.gradient} opacity-70 transition-[width] duration-500 ease-out`}
            style={{ width: `${finished ? 100 : progressPct}%` }}
          />
        </div>

        {stations.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          return (
            <div key={i} className="relative flex shrink-0 flex-col items-center justify-end" style={{ width: "4.25rem" }}>
              {/* train idling at the current station, puffing smoke */}
              {current && (
                <div className="scene-train-pop pointer-events-none absolute bottom-[2.1rem] left-1/2 -translate-x-1/2">
                  <TrainEngine tint={tint} />
                </div>
              )}

              {/* platform / station building */}
              <div className="relative z-10 flex flex-col items-center">
                {/* passed-station flag */}
                {done && (
                  <span
                    aria-hidden="true"
                    className="scene-train-flag absolute -top-5 left-1/2 text-base sm:text-lg"
                    style={{ transformOrigin: "bottom left" }}
                  >
                    🚩
                  </span>
                )}
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl border-2 text-lg shadow-[0_3px_8px_-2px_rgba(46,42,33,0.25)] sm:size-12 sm:text-xl ${
                    current
                      ? `bg-white ${tint.ring} animate-glow`
                      : done
                        ? `${tint.bgLight} border-transparent`
                        : "border-(--color-ink)/10 bg-white/90"
                  }`}
                >
                  {done ? "✅" : theme.stepIcon}
                </div>
                {/* platform base */}
                <div className={`h-2.5 w-14 rounded-b-md border-2 border-t-0 border-(--color-ink)/10 ${done || current ? tint.bgLight : "bg-white/80"} sm:w-16`} />
              </div>
            </div>
          );
        })}

        {/* final decorated station */}
        <div className="relative flex shrink-0 flex-col items-center justify-end" style={{ width: "5rem" }}>
          {finished && (
            <>
              <span aria-hidden="true" className="scene-train-confetti absolute -top-3 left-2 text-lg">
                🎊
              </span>
              <span aria-hidden="true" className="scene-train-confetti absolute -top-4 right-1 text-base" style={{ animationDelay: "-0.4s" }}>
                🎉
              </span>
              <span aria-hidden="true" className="scene-train-balloon absolute -top-9 left-[-0.4rem] text-2xl">
                🎈
              </span>
              <span aria-hidden="true" className="scene-train-balloon absolute -top-10 right-[-0.2rem] text-2xl" style={{ animationDelay: "-1.1s" }}>
                🎈
              </span>
              <div className="scene-train-pop pointer-events-none absolute bottom-[2.1rem] left-1/2 -translate-x-1/2">
                <TrainEngine tint={tint} arrived />
              </div>
            </>
          )}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`flex size-14 items-center justify-center rounded-2xl border-2 text-2xl shadow-[0_3px_8px_-2px_rgba(46,42,33,0.25)] sm:size-16 sm:text-3xl ${
                finished ? `${tint.bgLight} animate-glow border-transparent` : "border-dashed border-(--color-ink)/20 bg-white/90"
              }`}
            >
              <span className={finished ? "animate-pop-in" : ""}>{finished ? theme.finishIcon : "🏁"}</span>
            </div>
            <div className={`h-3 w-20 rounded-b-md border-2 border-t-0 border-(--color-ink)/10 sm:w-24 ${finished ? tint.bgLight : "bg-white/80"}`} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scene-train-drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .scene-train-drift {
          animation: scene-train-drift 7s ease-in-out infinite;
        }

        @keyframes scene-train-pop {
          0% { transform: scale(0.4) translateY(10px); opacity: 0; }
          70% { transform: scale(1.08) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .scene-train-pop {
          animation: scene-train-pop 0.5s cubic-bezier(.34, 1.56, .64, 1) both;
        }

        @keyframes scene-train-chug {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(-0.6deg); }
        }
        .scene-train-chug {
          animation: scene-train-chug 1.1s ease-in-out infinite;
        }

        @keyframes scene-train-smoke {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0.75; }
          100% { transform: translate(6px, -22px) scale(1.5); opacity: 0; }
        }
        .scene-train-smoke {
          animation: scene-train-smoke 1.6s ease-out infinite;
        }

        @keyframes scene-train-flag {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(10deg); }
        }
        .scene-train-flag {
          display: inline-block;
          animation: scene-train-flag 1.4s ease-in-out infinite;
        }

        @keyframes scene-train-balloon {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        .scene-train-balloon {
          display: inline-block;
          animation: scene-train-balloon 2.4s ease-in-out infinite;
        }

        @keyframes scene-train-confetti {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-5px) rotate(18deg); opacity: 0.8; }
        }
        .scene-train-confetti {
          display: inline-block;
          animation: scene-train-confetti 1.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .scene-train-drift,
          .scene-train-pop,
          .scene-train-chug,
          .scene-train-smoke,
          .scene-train-flag,
          .scene-train-balloon,
          .scene-train-confetti {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// Hand-drawn SVG engine + smoke puffs. Uses `currentColor` for the tint-colored
// body so it always matches the active theme's accent via `tint.text`.
function TrainEngine({ tint, arrived }: { tint: (typeof TINT_STYLES)["mint"]; arrived?: boolean }) {
  return (
    <div className={`relative ${arrived ? "" : "scene-train-chug"}`}>
      {/* smoke puffs from the chimney */}
      <span aria-hidden="true" className="scene-train-smoke absolute -top-2 left-1 text-sm opacity-80" style={{ animationDelay: "0s" }}>
        💨
      </span>
      <span aria-hidden="true" className="scene-train-smoke absolute -top-2 left-1 text-sm opacity-80" style={{ animationDelay: "0.5s" }}>
        💨
      </span>
      <span aria-hidden="true" className="scene-train-smoke absolute -top-2 left-1 text-xs opacity-70" style={{ animationDelay: "1s" }}>
        💨
      </span>

      <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden="true" className={tint.text}>
        {/* cow-catcher */}
        <path d="M4 32 L10 24 L10 32 Z" fill="var(--color-ink)" opacity="0.25" />
        {/* wheels */}
        <circle cx="16" cy="33" r="5" fill="var(--color-ink)" opacity="0.8" />
        <circle cx="16" cy="33" r="1.8" fill="white" />
        <circle cx="34" cy="33" r="5" fill="var(--color-ink)" opacity="0.8" />
        <circle cx="34" cy="33" r="1.8" fill="white" />
        <circle cx="50" cy="33" r="4" fill="var(--color-ink)" opacity="0.8" />
        <circle cx="50" cy="33" r="1.4" fill="white" />
        {/* boiler body */}
        <rect x="10" y="14" width="34" height="16" rx="8" fill="currentColor" />
        {/* cab */}
        <rect x="42" y="4" width="18" height="26" rx="4" fill="currentColor" />
        <rect x="46" y="9" width="10" height="9" rx="2" fill="white" fillOpacity="0.85" />
        {/* chimney */}
        <rect x="14" y="4" width="7" height="11" rx="2.5" fill="currentColor" />
        {/* front light */}
        <circle cx="12" cy="20" r="2.4" fill="var(--color-sun)" />
        {/* boiler window */}
        <circle cx="28" cy="21" r="4" fill="white" fillOpacity="0.9" />
        <circle cx="28" cy="21" r="4" fill="none" stroke="var(--color-ink)" strokeOpacity="0.2" />
      </svg>
    </div>
  );
}
