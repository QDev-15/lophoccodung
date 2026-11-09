import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Đại Chiến Leo Núi" — each team climbs their own staircase of giant
// numbered math blocks (one block per correct answer so far), distinct from
// the percentage-of-shared-mountain-face scenes used by the other two
// mountain-climb battle themes: literal, countable blocks rather than a
// relative height on one shared slope.

const MAX_VISIBLE_BLOCKS = 6;

function BlockStack({
  score,
  bg,
  textClass,
  glowVar,
  mascot,
  leading,
  delay,
}: {
  score: number;
  bg: string;
  textClass: string;
  glowVar: string;
  mascot: string;
  leading: boolean;
  delay: string;
}) {
  const visible = Math.min(score, MAX_VISIBLE_BLOCKS);
  const extra = score - visible;

  return (
    <div className="relative flex flex-col-reverse items-center">
      <span
        className={`scene-mathclimb-climber mb-1 text-3xl sm:text-4xl ${leading ? "scene-mathclimb-lead" : ""}`}
        style={{ animationDelay: delay, filter: leading ? `drop-shadow(0 0 8px ${glowVar})` : undefined }}
        aria-hidden="true"
      >
        {mascot}
      </span>
      {Array.from({ length: visible }).map((_, i) => (
        <div
          key={i}
          className="scene-mathclimb-block-pop flex h-6 w-14 items-center justify-center rounded-md text-xs font-extrabold text-white shadow-[0_2px_0_rgba(46,42,33,0.25)] sm:h-7 sm:w-16 sm:text-sm"
          style={{ background: bg, animationDelay: `${i * 0.04}s` }}
        >
          {(i + 1) * 10}
        </div>
      ))}
      {extra > 0 && (
        <span className={`mb-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ${textClass} shadow-sm`}>
          +{extra}
        </span>
      )}
      <div className="h-2 w-16 rounded-full bg-(--color-ink)/15 sm:w-20" aria-hidden="true" />
    </div>
  );
}

export function Scene({ theme, scoreA, scoreB }: BattleSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const leaderA = scoreA > scoreB;
  const leaderB = scoreB > scoreA;

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[2rem] bg-gradient-to-b from-(--color-cloud) to-white p-4 shadow-[0_10px_28px_-14px_rgba(46,42,33,0.3)] sm:p-6">
      <style>{`
        @keyframes scene-mathclimb-pop {
          0% { transform: scale(.5) translateY(6px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes scene-mathclimb-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes scene-mathclimb-leadbounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.1); }
        }
        .scene-mathclimb-block-pop { animation: scene-mathclimb-pop 0.3s cubic-bezier(.34, 1.56, .64, 1) both; }
        .scene-mathclimb-climber { animation: scene-mathclimb-bob 1.4s ease-in-out infinite; display: inline-block; }
        .scene-mathclimb-lead { animation: scene-mathclimb-leadbounce 0.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .scene-mathclimb-block-pop, .scene-mathclimb-climber, .scene-mathclimb-lead {
            animation: none !important;
          }
        }
      `}</style>

      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${tint.blob} opacity-40`} />

      <p className="relative mb-3 text-center text-xs font-bold uppercase tracking-wide text-(--color-ink)/45">
        {theme.emoji} Leo núi bằng các phép cộng trong 100
      </p>

      <div className="relative flex items-end justify-center gap-10 sm:gap-16">
        <BlockStack
          score={scoreA}
          bg="var(--color-mint)"
          textClass="text-(--color-mint-dark)"
          glowVar="var(--color-mint)"
          mascot="🧒"
          leading={leaderA}
          delay="0s"
        />
        <BlockStack
          score={scoreB}
          bg="var(--color-lavender)"
          textClass="text-(--color-lavender)"
          glowVar="var(--color-lavender)"
          mascot="👧"
          leading={leaderB}
          delay="0.3s"
        />
      </div>

      <p className="relative mt-4 text-center text-sm font-bold text-(--color-ink)/60">
        {leaderA ? "Đội A đang leo cao hơn!" : leaderB ? "Đội B đang leo cao hơn!" : "Hai đội đang ngang tầng!"}
      </p>
    </div>
  );
}
