import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Fallback scene — the original generic stepping-stone trail. Used as a
// starting point for any theme that hasn't gotten a bespoke scene yet.
export function DefaultScene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const linePct = total > 0 ? Math.min(100, (index / total) * 100) : 0;

  return (
    <div className="relative overflow-x-auto rounded-3xl bg-white/70 px-5 py-6 shadow-[inset_0_2px_6px_rgba(46,42,33,0.06)]">
      <div className="relative flex min-w-max items-center gap-3 px-2">
        <div
          aria-hidden="true"
          className="absolute left-2 right-2 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-(--color-ink)/10"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tint.gradient} transition-[width] duration-500 ease-out`}
            style={{ width: `${finished ? 100 : linePct}%` }}
          />
        </div>
        {steps.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const zig = i % 2 === 0 ? "-translate-y-2" : "translate-y-2";
          return (
            <div
              key={i}
              className={`relative z-10 flex shrink-0 items-center justify-center rounded-full text-2xl transition sm:text-3xl ${
                current ? "size-16 scale-110 sm:size-20" : `size-11 sm:size-12 ${zig}`
              }`}
            >
              {current && (
                <span
                  aria-hidden="true"
                  className="adv-ping absolute inset-0 rounded-full border-2"
                  style={{ borderColor: tint.shadowDark }}
                />
              )}
              <span
                className={`absolute inset-0 rounded-full border-2 shadow-[0_2px_6px_-2px_rgba(46,42,33,0.2)] ${
                  done
                    ? `${tint.bgLight} border-transparent`
                    : current
                      ? `bg-white ${tint.ring} animate-glow`
                      : "border-(--color-ink)/10 bg-white"
                }`}
              />
              <span className={`relative ${current ? "animate-float text-4xl sm:text-5xl" : "text-xl"}`}>
                {current ? theme.mascot : done ? "✅" : theme.stepIcon}
              </span>
            </div>
          );
        })}
        <div
          className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full text-3xl shadow-[0_2px_6px_-2px_rgba(46,42,33,0.2)] sm:size-16 sm:text-4xl ${
            finished ? `${tint.bgLight} animate-glow` : "bg-white"
          }`}
        >
          {finished && (
            <span
              aria-hidden="true"
              className="adv-ping absolute inset-0 rounded-full border-2"
              style={{ borderColor: tint.shadowDark }}
            />
          )}
          <span className={finished ? "animate-pop-in" : ""}>{finished ? theme.mascot : theme.finishIcon}</span>
        </div>
      </div>
    </div>
  );
}
