import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Vườn hoa điểm thưởng" — a row of garden plots; a bee flies over them and
// each correct answer blooms one more flower, ending in a big bouquet.

const BLOOM_CYCLE = ["🌸", "🌼", "🌻", "🌺"];

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const atFinish = total === 0 || index >= total;

  return (
    <div
      className="relative overflow-x-auto rounded-3xl bg-gradient-to-b from-sky-50 to-(--color-mint-light)/60 px-5 py-8 shadow-[inset_0_2px_6px_rgba(46,42,33,0.08)]"
      role="img"
      aria-label={finished ? "Vườn hoa đã nở rộ" : `Đang chăm bông hoa số ${index + 1} trên ${total}`}
    >
      <style>{`
        @keyframes scene-garden-fly {
          0%, 100% { transform: translate(-50%, 0) rotate(0deg); }
          50% { transform: translate(-50%, -6px) rotate(10deg); }
        }
        @keyframes scene-garden-bud-sway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes scene-garden-pollen-kf {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) translateY(0); }
          40% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) translateY(-20px); }
        }
        @keyframes scene-garden-bloom-pop {
          0% { transform: scale(.4) rotate(-12deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .scene-garden-bee { animation: scene-garden-fly 1.8s ease-in-out infinite; }
        .scene-garden-bud { animation: scene-garden-bud-sway 2.2s ease-in-out infinite; display: inline-block; }
        .scene-garden-pollen { animation: scene-garden-pollen-kf 1.1s ease-out infinite; }
        .scene-garden-bloom { animation: scene-garden-bloom-pop 0.4s cubic-bezier(.34, 1.56, .64, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .scene-garden-bee, .scene-garden-bud, .scene-garden-pollen, .scene-garden-bloom {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative z-10 flex min-w-max items-end gap-4 px-2">
        {steps.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const flower = BLOOM_CYCLE[i % BLOOM_CYCLE.length];
          return (
            <div key={i} className="relative flex shrink-0 flex-col items-center">
              {current && (
                <span className="scene-garden-bee absolute -top-7 left-1/2 text-2xl sm:text-3xl" aria-hidden="true">
                  🐝
                </span>
              )}
              <div
                className={`relative flex items-center justify-center rounded-full text-2xl transition-all duration-300 sm:text-3xl ${
                  current ? "size-16 sm:size-20" : "size-12 sm:size-14"
                } ${done ? `${tint.bgLight} scene-garden-bloom` : current ? "bg-white" : "bg-(--color-cloud)/70"}`}
              >
                {done ? flower : current ? <span className="scene-garden-bud">🌱</span> : "〇"}
              </div>
              <div
                className="h-3 w-10 rounded-b-xl sm:w-12"
                style={{ background: "linear-gradient(to bottom, #c88a4a, #9c6a34)" }}
                aria-hidden="true"
              />
            </div>
          );
        })}

        <div className="relative flex shrink-0 flex-col items-center">
          {finished && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="scene-garden-pollen absolute left-1/2 top-1/2 size-1.5 rounded-full bg-(--color-sun)"
                  style={{ "--r": `${i * 72}deg`, animationDelay: `${i * 0.15}s` } as React.CSSProperties}
                />
              ))}
            </div>
          )}
          <div
            className={`relative flex size-16 items-center justify-center rounded-full text-3xl sm:size-20 sm:text-4xl ${
              finished ? `${tint.bgLight} scene-garden-bloom` : "bg-white/60"
            }`}
          >
            {finished ? "💐" : "🏺"}
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-center text-base font-semibold text-(--color-ink)/70">
        {finished ? "Vườn hoa nở rộ rồi! 🌼" : atFinish ? "Bông hoa cuối sắp nở!" : `Bông hoa ${index + 1} / ${total}`}
      </p>
    </div>
  );
}
