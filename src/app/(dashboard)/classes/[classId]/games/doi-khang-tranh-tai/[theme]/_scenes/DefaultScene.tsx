import type { BattleSceneProps } from "./types";

// Fallback scene — the original generic question-progress dots (with a
// bouncing runner on the current question). Reuses the `bat2-progress-glow`
// / `bat2-runner` keyframes already defined in BattlePlayer.tsx's local
// <style> block. Used as a starting point for any theme that hasn't gotten
// a bespoke scene yet.
export function DefaultScene({ index, total }: BattleSceneProps) {
  return (
    <div className="relative z-10 mt-5 flex justify-center gap-1.5 sm:gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < index;
        const current = i === index;
        return (
          <span
            key={i}
            className={`relative h-2 w-6 rounded-full transition-colors duration-300 sm:w-7 ${
              done ? "bg-(--color-mint)" : current ? "bat2-progress-glow bg-(--color-sun-dark)" : "bg-(--color-ink)/10"
            }`}
          >
            {current && (
              <span aria-hidden="true" className="bat2-runner absolute -top-6 left-1/2 -translate-x-1/2 text-lg">
                🏃
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
