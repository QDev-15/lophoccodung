import { TINT_STYLES } from "@/lib/adventure-themes";
import type { TintStyle } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for "Tay Câu Siêu Đẳng" (🎣 Super fishing hand).
// A fisherman in a nón lá stands on a little dock at the edge of a pond.
// Each quiz question is a fish swimming in the water:
//   - already-correct fish are tallied in the creel/bucket by the dock
//   - the current fish leaps "on the hook" toward the surface
//   - upcoming fish swim calmly further out
// On finish, a big trophy fish gets reeled in with a splash while the
// fisherman cheers.
export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const caught = Math.min(index, total);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-(--color-cloud) via-sky-100 to-sky-200 shadow-[inset_0_2px_6px_rgba(46,42,33,0.08)]">
      <style>{`
        @keyframes scene-fishing-bob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-4px) rotate(2deg); }
        }
        @keyframes scene-fishing-wiggle {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(2px) rotate(3deg); }
          75% { transform: translateX(-2px) rotate(-3deg); }
        }
        @keyframes scene-fishing-jump {
          0%, 100% { transform: translateY(0) rotate(-6deg) scale(1); }
          40% { transform: translateY(-16px) rotate(4deg) scale(1.06); }
          70% { transform: translateY(-6px) rotate(-2deg) scale(1.03); }
        }
        @keyframes scene-fishing-line-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes scene-fishing-water-shimmer {
          0% { background-position: 0 0; }
          100% { background-position: -80px 0; }
        }
        @keyframes scene-fishing-ripple {
          0% { transform: scale(0.6); opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes scene-fishing-splash-ring {
          0% { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes scene-fishing-droplet {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx, 10px), -34px) scale(0.4); opacity: 0; }
        }
        @keyframes scene-fishing-trophy-pop {
          0% { transform: scale(0.2) rotate(-25deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes scene-fishing-cheer {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }
        @keyframes scene-fishing-sparkle {
          0%, 100% { transform: scale(0.7) rotate(0deg); opacity: 0.5; }
          50% { transform: scale(1.15) rotate(25deg); opacity: 1; }
        }
        .scene-fishing-bob { animation: scene-fishing-bob 2.6s ease-in-out infinite; }
        .scene-fishing-wiggle { animation: scene-fishing-wiggle 1.8s ease-in-out infinite; }
        .scene-fishing-jump { animation: scene-fishing-jump 1.1s var(--ease-bounce, cubic-bezier(.34,1.56,.64,1)) infinite; }
        .scene-fishing-line-sway { animation: scene-fishing-line-sway 2.2s ease-in-out infinite; transform-origin: top center; }
        .scene-fishing-water {
          background-image: repeating-linear-gradient(100deg, rgba(255,255,255,0.55) 0 8px, transparent 8px 38px);
          animation: scene-fishing-water-shimmer 3.4s linear infinite;
        }
        .scene-fishing-ripple { animation: scene-fishing-ripple 2.4s ease-out infinite; }
        .scene-fishing-splash-ring { animation: scene-fishing-splash-ring 0.9s ease-out infinite; }
        .scene-fishing-droplet { animation: scene-fishing-droplet 0.9s ease-out infinite; }
        .scene-fishing-trophy { animation: scene-fishing-trophy-pop 0.6s var(--ease-bounce, cubic-bezier(.34,1.56,.64,1)) both; }
        .scene-fishing-cheer { animation: scene-fishing-cheer 1.3s ease-in-out infinite; }
        .scene-fishing-sparkle { animation: scene-fishing-sparkle 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .scene-fishing-bob,
          .scene-fishing-wiggle,
          .scene-fishing-jump,
          .scene-fishing-line-sway,
          .scene-fishing-water,
          .scene-fishing-ripple,
          .scene-fishing-splash-ring,
          .scene-fishing-droplet,
          .scene-fishing-cheer,
          .scene-fishing-sparkle {
            animation: none !important;
          }
          .scene-fishing-trophy { animation-duration: 0.01ms !important; }
        }
      `}</style>

      {/* sun + cloud dressing */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`absolute -top-6 right-10 size-24 rounded-full ${tint.blob} opacity-60 blur-2xl`} />
        <span className="absolute left-5 top-3 text-2xl opacity-80 sm:text-3xl">☁️</span>
        <span className="absolute right-6 top-2 text-xl opacity-70 sm:text-2xl">🌤️</span>
      </div>

      <div className="relative overflow-x-auto">
        <div className="relative flex min-w-max items-end gap-3 px-4 pb-5 pt-6 sm:gap-4 sm:px-6">
          {/* water surface band behind everything */}
          <div
            aria-hidden="true"
            className="scene-fishing-water absolute inset-x-0 bottom-3 top-1/2 -z-0 rounded-b-3xl bg-gradient-to-b from-sky-300/70 to-sky-400/80"
          />
          {/* progress wake line showing distance "reeled in" */}
          <div
            aria-hidden="true"
            className="absolute left-4 right-4 top-[46%] h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/40"
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r ${tint.gradient} transition-[width] duration-500 ease-out`}
              style={{ width: `${finished ? 100 : total > 0 ? Math.min(100, (index / total) * 100) : 0}%` }}
            />
          </div>

          <Fisherman tint={tint} celebrating={finished} />
          <CreelBucket tint={tint} count={caught} total={total} />

          {steps.map((_, i) => {
            const state = finished ? "caught" : i < index ? "caught" : i === index ? "current" : "upcoming";
            return (
              <FishMarker
                key={i}
                state={state}
                tint={tint}
                fishEmoji={theme.stepIcon || "🐟"}
                delay={i % 5}
              />
            );
          })}

          <TrophyGoal tint={tint} finished={finished} finishIcon={theme.finishIcon || "🏆"} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fisherman standing on a small dock, wearing a nón lá, rod in hand.
// ---------------------------------------------------------------------------

function Fisherman({ tint, celebrating }: { tint: TintStyle; celebrating: boolean }) {
  return (
    <div className="sticky left-1 z-20 flex shrink-0 flex-col items-center">
      <div className="relative h-28 w-24 sm:h-32 sm:w-28">
        {celebrating && (
          <>
            <span className="scene-fishing-sparkle absolute -left-1 top-0 text-base" style={{ animationDelay: "0.1s" }}>
              ✨
            </span>
            <span className="scene-fishing-sparkle absolute right-0 top-1 text-sm" style={{ animationDelay: "0.4s" }}>
              ✨
            </span>
          </>
        )}
        <svg
          viewBox="0 0 120 150"
          className={`absolute inset-0 h-full w-full drop-shadow-[0_6px_8px_rgba(46,42,33,0.25)] ${
            celebrating ? "scene-fishing-cheer" : ""
          }`}
          role="presentation"
          aria-hidden="true"
        >
          {/* dock */}
          <rect x="6" y="118" width="96" height="16" rx="6" fill="#c88a4a" stroke="#8a5a28" strokeWidth="3" />
          <rect x="14" y="134" width="8" height="14" fill="#8a5a28" />
          <rect x="86" y="134" width="8" height="14" fill="#8a5a28" />

          {!celebrating ? (
            <>
              {/* rod + line (idle fishing pose) */}
              <g className="scene-fishing-line-sway">
                <line x1="78" y1="92" x2="112" y2="40" stroke="#8a5a28" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M108 44 C 108 70, 100 80, 94 96" fill="none" stroke="#dbeafe" strokeWidth="1.5" />
                <circle cx="94" cy="98" r="2.6" fill="#64748b" />
              </g>
              {/* arm holding rod */}
              <path d="M66 96 C 74 90, 78 90, 82 92" fill="none" stroke="#f3b27a" strokeWidth="9" strokeLinecap="round" />
              {/* resting arm */}
              <path d="M44 96 C 38 102, 36 108, 38 114" fill="none" stroke="#f3b27a" strokeWidth="9" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* both arms raised, holding trophy fish aloft */}
              <path d="M40 94 C 30 78, 26 60, 30 46" fill="none" stroke="#f3b27a" strokeWidth="9" strokeLinecap="round" />
              <path d="M70 94 C 80 78, 84 60, 80 46" fill="none" stroke="#f3b27a" strokeWidth="9" strokeLinecap="round" />
              <g className="scene-fishing-trophy" style={{ transformOrigin: "55px 38px" }}>
                <ellipse cx="55" cy="36" rx="16" ry="11" fill="var(--color-sun)" stroke="#8a5a28" strokeWidth="2.5" />
                <path d="M39 36 L 27 28 L 27 44 Z" fill="var(--color-sun)" stroke="#8a5a28" strokeWidth="2" />
                <circle cx="63" cy="33" r="2" fill="#3e281b" />
                <path d="M46 42 Q 55 46 63 42" fill="none" stroke="#8a5a28" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </>
          )}

          {/* torso */}
          <rect x="30" y="68" width="38" height="52" rx="18" fill={tint.shadowDark} opacity="0.92" />
          <rect x="30" y="68" width="38" height="52" rx="18" fill="none" stroke="#8a5a28" strokeWidth="2.5" opacity="0.35" />

          {/* head */}
          <circle cx="49" cy="56" r="17" fill="#ffd9b3" stroke="#8a5a28" strokeWidth="2.5" />
          {/* face */}
          {celebrating ? (
            <>
              <circle cx="43" cy="55" r="2.2" fill="#3e281b" />
              <circle cx="56" cy="55" r="2.2" fill="#3e281b" />
              <path d="M41 62 Q 49 70 58 62" fill="none" stroke="#b8492e" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="37" cy="59" r="3" fill="#ffb4a2" opacity="0.6" />
              <circle cx="61" cy="59" r="3" fill="#ffb4a2" opacity="0.6" />
            </>
          ) : (
            <>
              <path d="M39 54 Q 42 51 45 54" fill="none" stroke="#3e281b" strokeWidth="2" strokeLinecap="round" />
              <path d="M53 54 Q 56 51 59 54" fill="none" stroke="#3e281b" strokeWidth="2" strokeLinecap="round" />
              <path d="M43 63 Q 49 67 55 63" fill="none" stroke="#b8492e" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}

          {/* nón lá conical hat */}
          <g transform={celebrating ? "rotate(-12 49 36)" : undefined}>
            <polygon points="20,44 78,44 49,12" fill="#f3dcb0" stroke="#8a5a28" strokeWidth="2.5" strokeLinejoin="round" />
            <ellipse cx="49" cy="44" rx="30" ry="6" fill="#e9c08a" stroke="#8a5a28" strokeWidth="2.5" />
          </g>
        </svg>
        <div className="pointer-events-none absolute -bottom-1 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-(--color-ink)/15 blur-[3px]" />
      </div>
      <span className="mt-0.5 text-[11px] font-bold text-(--color-ink)/60 sm:text-xs">Cô câu cá</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Creel / bucket tally of caught fish, by the fisherman's feet.
// ---------------------------------------------------------------------------

function CreelBucket({ tint, count, total }: { tint: TintStyle; count: number; total: number }) {
  return (
    <div className="sticky left-24 z-10 flex shrink-0 flex-col items-center gap-1 pb-2 sm:left-28">
      <div className="relative">
        <svg viewBox="0 0 60 48" className="h-11 w-14 drop-shadow-[0_3px_5px_rgba(46,42,33,0.25)] sm:h-12 sm:w-16" role="presentation" aria-hidden="true">
          <ellipse cx="30" cy="10" rx="22" ry="5" fill="#e9c08a" stroke="#8a5a28" strokeWidth="2" />
          <path
            d="M9 10 C9 10 11 36 15 40 C19 44 41 44 45 40 C49 36 51 10 51 10"
            fill="#c88a4a"
            stroke="#8a5a28"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M11 17 C 19 20, 41 20, 49 17" fill="none" stroke="#8a5a28" strokeWidth="1.2" opacity="0.5" />
          <path d="M12 25 C 19 28, 41 28, 48 25" fill="none" stroke="#8a5a28" strokeWidth="1.2" opacity="0.5" />
          {/* a couple of fish tails peeking out of the creel */}
          {count > 0 && <text x="19" y="13" fontSize="11">🐟</text>}
          {count > 1 && <text x="31" y="11" fontSize="10">🐠</text>}
        </svg>
        <span
          className={`absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border-2 border-white text-[11px] font-extrabold text-white shadow-sm sm:size-7 sm:text-xs ${tint.bg}`}
        >
          {count}
        </span>
      </div>
      <span className="text-[10px] font-bold text-(--color-ink)/55 sm:text-[11px]">
        {count}/{total}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fish swimming in the pond — one per quiz step.
// ---------------------------------------------------------------------------

function FishMarker({
  state,
  tint,
  fishEmoji,
  delay,
}: {
  state: "caught" | "current" | "upcoming";
  tint: TintStyle;
  fishEmoji: string;
  delay: number;
}) {
  if (state === "current") {
    return (
      <div className="relative z-10 flex shrink-0 flex-col items-center justify-end">
        <span
          aria-hidden="true"
          className="scene-fishing-line-sway absolute -top-7 left-1/2 h-7 w-px -translate-x-1/2 bg-(--color-ink)/30"
          style={{ transformOrigin: "top center" }}
        />
        <span aria-hidden="true" className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm">
          🪝
        </span>
        <div
          className={`scene-fishing-jump relative flex size-16 items-center justify-center rounded-full border-[3px] bg-white text-3xl shadow-[0_4px_10px_-2px_rgba(46,42,33,0.3)] sm:size-20 sm:text-4xl ${tint.ring}`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-white/60"
            style={{ boxShadow: `0 0 0 6px ${tint.shadowDark}22` }}
          />
          <span className="relative">{fishEmoji}</span>
        </div>
        <div aria-hidden="true" className="relative -mt-1 h-3 w-14 rounded-full bg-sky-400/50 blur-[2px]" />
        <span className="mt-1 whitespace-nowrap text-[11px] font-extrabold text-(--color-mint-dark) sm:text-xs" style={{ color: tint.shadowDark }}>
          Đang cắn câu!
        </span>
      </div>
    );
  }

  if (state === "caught") {
    return (
      <div className="relative z-0 flex size-9 shrink-0 items-center justify-center self-center opacity-70 sm:size-10">
        <span
          aria-hidden="true"
          className="scene-fishing-bob flex size-9 items-center justify-center rounded-full bg-white/70 text-lg sm:size-10 sm:text-xl"
          style={{ animationDelay: `${delay * 0.3}s` }}
        >
          {fishEmoji}
        </span>
        <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-(--color-mint-dark) text-[9px] font-bold text-white sm:size-4.5">
          ✓
        </span>
      </div>
    );
  }

  return (
    <div className="relative z-0 flex size-11 shrink-0 items-center justify-center self-center sm:size-12">
      <span
        aria-hidden="true"
        className="scene-fishing-wiggle flex size-11 items-center justify-center rounded-full bg-white/50 text-xl opacity-80 sm:size-12 sm:text-2xl"
        style={{ animationDelay: `${delay * 0.25}s` }}
      >
        {fishEmoji}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trophy goal at the far end of the pond.
// ---------------------------------------------------------------------------

function TrophyGoal({ tint, finished, finishIcon }: { tint: TintStyle; finished: boolean; finishIcon: string }) {
  return (
    <div className="relative z-10 flex shrink-0 flex-col items-center justify-end gap-1 pb-1">
      <div
        className={`relative flex size-14 items-center justify-center rounded-full text-3xl shadow-[0_4px_10px_-2px_rgba(46,42,33,0.3)] sm:size-16 sm:text-4xl ${
          finished ? `${tint.bgLight}` : "bg-white"
        }`}
      >
        {finished && (
          <>
            <span
              aria-hidden="true"
              className="scene-fishing-splash-ring absolute inset-0 rounded-full border-2"
              style={{ borderColor: tint.shadowDark }}
            />
            <span
              aria-hidden="true"
              className="scene-fishing-ripple absolute inset-0 rounded-full border-2"
              style={{ borderColor: tint.shadowDark, animationDelay: "0.35s" }}
            />
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                aria-hidden="true"
                className="scene-fishing-droplet absolute top-1 text-xs"
                style={{ left: `${30 + d * 15}%`, animationDelay: `${d * 0.15}s`, "--dx": `${(d - 1) * 14}px` } as React.CSSProperties}
              >
                💧
              </span>
            ))}
          </>
        )}
        <span className={finished ? "scene-fishing-trophy relative" : "relative"}>{finished ? finishIcon : "🏁"}</span>
      </div>
      <span className="text-[10px] font-bold text-(--color-ink)/55 sm:text-[11px]">Đích</span>
    </div>
  );
}
