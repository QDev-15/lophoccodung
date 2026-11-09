import { TINT_STYLES } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Nhảy ô vuông" — classic playground hopscotch: a chalk-drawn grid of
// numbered squares on pavement. A kid hops one-legged from square to square
// toward a checkered finish-line flag.

function ChalkStar() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--color-mint-dark)" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 16.9l-6.2 3.4 1.6-6.8-5.2-4.6 6.9-.6z"
      />
    </svg>
  );
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const atFinish = total === 0 || index >= total;

  return (
    <div
      className="relative overflow-x-auto rounded-3xl p-5 py-6 shadow-[inset_0_2px_6px_rgba(46,42,33,0.08)]"
      style={{ background: "repeating-linear-gradient(90deg, #e4ddcd 0 40px, #d9d1bf 40px 80px)" }}
      role="img"
      aria-label={finished ? "Đã nhảy tới ô đích" : `Đang ở ô số ${index + 1} trên ${total}`}
    >
      <style>{`
        @keyframes scene-hop-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-6deg); }
        }
        @keyframes scene-hop-flagwave {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes scene-hop-chalk-pop {
          0% { transform: scale(.4) rotate(-20deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .scene-hop-kid { animation: scene-hop-bounce 1.6s ease-in-out infinite; display: inline-block; }
        .scene-hop-win { animation: scene-hop-flagwave 0.6s ease-in-out infinite; display: inline-block; }
        .scene-hop-chalk { animation: scene-hop-chalk-pop 0.3s cubic-bezier(.34, 1.56, .64, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .scene-hop-kid, .scene-hop-win, .scene-hop-chalk {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative z-10 flex min-w-max items-end gap-3 px-2">
        {steps.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const zig = i % 2 === 0 ? "-translate-y-1" : "translate-y-1";
          return (
            <div key={i} className={`relative flex shrink-0 flex-col items-center ${current ? "" : zig}`}>
              {current && (
                <span className="scene-hop-kid relative mb-1 text-4xl sm:text-5xl" aria-hidden="true">
                  🧒
                </span>
              )}
              <div
                className={`relative flex items-center justify-center rounded-lg border-2 text-sm font-extrabold transition-all duration-300 ${
                  current ? "size-16 scale-105 sm:size-20" : "size-12 sm:size-14"
                } ${
                  done
                    ? `${tint.bgLight} border-transparent`
                    : current
                      ? `bg-white ${tint.ring}`
                      : "border-(--color-ink)/15 bg-white/70"
                }`}
              >
                {done ? (
                  <span className="scene-hop-chalk">
                    <ChalkStar />
                  </span>
                ) : (
                  <span className={current ? tint.text : "text-(--color-ink)/40"}>{i + 1}</span>
                )}
              </div>
            </div>
          );
        })}

        <div
          className={`relative z-10 flex size-14 shrink-0 flex-col items-center justify-end sm:size-16 ${finished ? "scene-hop-win" : ""}`}
        >
          <span className="text-3xl sm:text-4xl" aria-hidden="true">
            🏁
          </span>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-center text-base font-semibold text-(--color-ink)/70">
        {finished ? "Đã về đích rồi! 🎉" : atFinish ? "Chuẩn bị nhảy ô cuối!" : `Ô số ${index + 1} / ${total}`}
      </p>
    </div>
  );
}
