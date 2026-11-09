import { TINT_STYLES } from "@/lib/adventure-themes";

import type { BattleSceneProps } from "./types";

// "Đại Chiến Trí Tuệ" — two glowing brain-orbs face off across a crackling
// lightning divider; each orb's glow/size grows with that team's score.
// Distinct from the sibling "Leo đỉnh trí tuệ" (a climb) — this one is a
// static, electric face-off, no climbing.

function BrainOrb({
  score,
  total,
  color,
  glowVar,
  mascot,
  leading,
  delay,
}: {
  score: number;
  total: number;
  color: string;
  glowVar: string;
  mascot: string;
  leading: boolean;
  delay: string;
}) {
  const pct = total > 0 ? Math.max(0.35, Math.min(1, score / total)) : 0.35;
  const size = 56 + pct * 40;

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div
        className={`scene-brainbattle-pulse relative flex items-center justify-center rounded-full ${
          leading ? "scene-brainbattle-lead" : ""
        }`}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.8), ${color} 60%, rgba(0,0,0,.25) 100%)`,
          boxShadow: `0 0 ${12 + pct * 20}px ${glowVar}, 0 4px 10px -3px rgba(46,42,33,0.3)`,
          animationDelay: delay,
        }}
      >
        <span className="text-2xl sm:text-3xl" aria-hidden="true">
          🧠
        </span>
      </div>
      <span className="text-3xl sm:text-4xl" aria-hidden="true">
        {mascot}
      </span>
    </div>
  );
}

export function Scene({ theme, scoreA, scoreB, total }: BattleSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const leaderA = scoreA > scoreB;
  const leaderB = scoreB > scoreA;

  return (
    <div className="relative z-10 mt-5 overflow-hidden rounded-[2rem] bg-(--color-ink) p-5 shadow-[0_10px_28px_-14px_rgba(46,42,33,0.5)] sm:p-7">
      <style>{`
        @keyframes scene-brainbattle-pulse-kf {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
        @keyframes scene-brainbattle-lead-kf {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes scene-brainbattle-bolt {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
        .scene-brainbattle-pulse { animation: scene-brainbattle-pulse-kf 1.8s ease-in-out infinite; }
        .scene-brainbattle-lead { animation: scene-brainbattle-lead-kf 0.8s ease-in-out infinite; }
        .scene-brainbattle-bolt { animation: scene-brainbattle-bolt 0.5s ease-in-out infinite; display: inline-block; }
        @media (prefers-reduced-motion: reduce) {
          .scene-brainbattle-pulse, .scene-brainbattle-lead, .scene-brainbattle-bolt {
            animation: none !important;
          }
        }
      `}</style>

      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 opacity-20 ${tint.blob}`} />

      <div className="relative flex items-center justify-center gap-6 sm:gap-10">
        <BrainOrb
          score={scoreA}
          total={total}
          color="var(--color-mint)"
          glowVar="var(--color-mint)"
          mascot="🧒"
          leading={leaderA}
          delay="0s"
        />
        <span className="scene-brainbattle-bolt text-3xl sm:text-4xl" aria-hidden="true">
          ⚡
        </span>
        <BrainOrb
          score={scoreB}
          total={total}
          color="var(--color-lavender)"
          glowVar="var(--color-lavender)"
          mascot="👧"
          leading={leaderB}
          delay="0.3s"
        />
      </div>

      <p className="relative mt-4 text-center text-sm font-bold text-(--color-cloud)/80">
        {theme.emoji}{" "}
        {leaderA
          ? "Trí tuệ Đội A đang bùng cháy!"
          : leaderB
            ? "Trí tuệ Đội B đang bùng cháy!"
            : "Hai bộ não đang ngang sức!"}
      </p>
    </div>
  );
}
