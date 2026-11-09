"use client";

import { useRef, useState } from "react";

import { IconChip } from "@/components/IconChip";
import type { BattleTheme } from "@/lib/battle-themes";

import { QuestionReveal, type GameQuestion } from "../../QuestionReveal";
import { BATTLE_SCENES } from "./_scenes";

type TeamId = "A" | "B";

const TEAM_TINT: Record<
  TeamId,
  {
    name: string;
    mascot: string;
    chip: "mint" | "lavender";
    text: string;
    ring: string;
    bgLight: string;
    gradient: string;
    pressShadow: string;
    pressShadowHex: string;
  }
> = {
  A: {
    name: "Đội A",
    mascot: "🧒",
    chip: "mint",
    text: "text-(--color-mint-dark)",
    ring: "ring-(--color-mint-dark)",
    bgLight: "bg-(--color-mint-light)",
    gradient: "from-(--color-mint) to-(--color-mint-dark)",
    pressShadow: "shadow-[0_5px_0_#b8492e,0_12px_24px_-8px_rgba(184,73,46,0.5)]",
    pressShadowHex: "#b8492e",
  },
  B: {
    name: "Đội B",
    mascot: "👧",
    chip: "lavender",
    text: "text-(--color-lavender)",
    ring: "ring-(--color-lavender)",
    bgLight: "bg-violet-100",
    gradient: "from-(--color-lavender) to-[#5b21b6]",
    pressShadow: "shadow-[0_5px_0_#5b21b6,0_12px_24px_-8px_rgba(139,92,246,0.5)]",
    pressShadowHex: "#5b21b6",
  },
};

// Per-theme accent (the theme's own tint, independent of the two fixed team colors) —
// used only for sparing ambient decoration (header glow + the little title chip) so
// each of the 9 battle themes still reads as visually distinct from the others.
const THEME_ACCENT: Record<
  BattleTheme["tint"],
  { blob: string; chip: "mint" | "lavender" | "peach"; text: string }
> = {
  mint: { blob: "bg-(--color-mint-light)", chip: "mint", text: "text-(--color-mint-dark)" },
  lavender: { blob: "bg-violet-100", chip: "lavender", text: "text-(--color-lavender)" },
  peach: { blob: "bg-emerald-50", chip: "peach", text: "text-(--color-peach)" },
};

// Deterministic confetti burst (left offset %, fall delay, drift direction, emoji) —
// hand-tossed rather than randomized every render, same spirit as the Ô Ăn Quan board.
const CONFETTI = [
  { left: 8, delay: 0, drift: -18, icon: "🎉" },
  { left: 20, delay: 0.12, drift: 10, icon: "✨" },
  { left: 33, delay: 0.05, drift: -8, icon: "🎊" },
  { left: 47, delay: 0.2, drift: 16, icon: "⭐" },
  { left: 60, delay: 0.08, drift: -14, icon: "🎉" },
  { left: 72, delay: 0.25, drift: 8, icon: "🎊" },
  { left: 85, delay: 0.1, drift: -10, icon: "✨" },
  { left: 94, delay: 0.3, drift: 14, icon: "⭐" },
];

// A little crowd of classmates cheering from the sidelines — purely decorative,
// makes the VS banner and victory screen read as "a whole class", not 2 icons.
const CHEER_SQUAD = [
  { icon: "🙋‍♀️", anim: "animate-float", delay: "0s" },
  { icon: "🧒", anim: "animate-wiggle", delay: "0.2s" },
  { icon: "👧", anim: "animate-float", delay: "0.5s" },
  { icon: "🙋‍♂️", anim: "animate-wiggle", delay: "0.1s" },
  { icon: "🧑‍🎓", anim: "animate-float", delay: "0.35s" },
];

function CheerSquad({ className = "", size = "text-2xl" }: { className?: string; size?: string }) {
  return (
    <div className={`pointer-events-none flex items-center justify-center gap-1 ${className}`} aria-hidden="true">
      {CHEER_SQUAD.map((c, i) => (
        <span key={i} className={`${c.anim} ${size}`} style={{ animationDelay: c.delay }}>
          {c.icon}
        </span>
      ))}
    </div>
  );
}

export function BattlePlayer({
  theme,
  quiz,
}: {
  theme: BattleTheme;
  quiz: { id: string; title: string; questions: GameQuestion[] };
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [awarded, setAwarded] = useState(false);
  const [pulse, setPulse] = useState<TeamId | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = quiz.questions.length;
  const finished = index >= total;
  const question = finished ? null : quiz.questions[index];
  const accent = THEME_ACCENT[theme.tint];
  const Scene = BATTLE_SCENES[theme.slug];

  function bump(team: TeamId) {
    setPulse(team);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(null), 600);
  }

  function award(team: TeamId | "tie") {
    if (awarded) return;
    if (team === "A") {
      setScoreA((s) => s + 1);
      bump("A");
    }
    if (team === "B") {
      setScoreB((s) => s + 1);
      bump("B");
    }
    setAwarded(true);
  }

  function handleNext() {
    setIndex((i) => i + 1);
    setRevealed(false);
    setAwarded(false);
  }

  function handleRestart() {
    setIndex(0);
    setRevealed(false);
    setAwarded(false);
    setScoreA(0);
    setScoreB(0);
    setPulse(null);
  }

  const winner = scoreA === scoreB ? null : scoreA > scoreB ? "A" : "B";

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-4 shadow-[0_16px_40px_-16px_rgba(46,42,33,0.3)] sm:p-6">
      <style>{`
        @keyframes battle-score-pop {
          0% { transform: scale(1) rotate(0deg); }
          40% { transform: scale(1.4) rotate(-6deg); }
          70% { transform: scale(0.96) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .battle-score-pop { animation: battle-score-pop 0.55s cubic-bezier(.34,1.56,.64,1); }

        @keyframes battle-vs-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .battle-vs-badge { animation: battle-vs-pulse 2.2s ease-in-out infinite; }

        @keyframes battle-confetti-fall {
          0% { transform: translateY(-10%) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(420%) translateX(var(--drift, 0px)) rotate(240deg); opacity: 0; }
        }
        .battle-confetti { animation: battle-confetti-fall 1.9s ease-in forwards; }

        @keyframes bat2-starburst-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .bat2-starburst { animation: bat2-starburst-spin 16s linear infinite; }

        @keyframes bat2-runner-bounce {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-6px) rotate(4deg); }
        }
        .bat2-runner { animation: bat2-runner-bounce 0.7s ease-in-out infinite; }

        @keyframes bat2-progress-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.35); }
          50% { box-shadow: 0 0 0 5px rgba(217,119,6,0.3), 0 2px 8px rgba(217,119,6,0.4); }
        }
        .bat2-progress-glow { animation: bat2-progress-glow 1.6s ease-in-out infinite; }

        @keyframes bat2-crown-bounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(-8deg); }
        }
        .bat2-crown { animation: bat2-crown-bounce 1.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .bat2-starburst, .bat2-runner, .bat2-progress-glow, .bat2-crown {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full ${accent.blob} opacity-50 blur-3xl`}
      />

      {/* Theme title chip — gives this specific battle its own identity up top */}
      <div className="relative z-10 mb-2 flex justify-center">
        <div className="animate-pop-in inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-[0_2px_0_rgba(46,42,33,0.08),0_6px_14px_-4px_rgba(46,42,33,0.3)]">
          <IconChip icon={theme.emoji} tint={accent.chip} size="sm" />
          <span className={`font-display text-xs font-extrabold sm:text-sm ${accent.text}`}>{theme.name}</span>
        </div>
      </div>

      {/* Cheering classmates watching from the sidelines */}
      <CheerSquad className="relative z-10 mb-2" size="text-2xl sm:text-3xl" />

      {/* VS battle banner */}
      <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6">
        <TeamScoreCard tint={TEAM_TINT.A} score={scoreA} pulsing={pulse === "A"} winner={finished && winner === "A"} />

        <div className="relative flex flex-col items-center gap-1">
          <span
            aria-hidden="true"
            className="bat2-starburst pointer-events-none absolute left-1/2 top-6 -z-10 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 sm:size-20"
            style={{ background: "repeating-conic-gradient(var(--color-sun) 0deg 8deg, transparent 8deg 24deg)" }}
          />
          <span className="animate-twinkle absolute -left-3 -top-1 text-xs sm:-left-4 sm:text-sm" aria-hidden="true">
            ✨
          </span>
          <span
            className="animate-twinkle absolute -right-3 -top-1 text-xs sm:-right-4 sm:text-sm"
            style={{ animationDelay: "0.4s" }}
            aria-hidden="true"
          >
            ✨
          </span>
          <span className="battle-vs-badge relative flex size-12 items-center justify-center rounded-full bg-(--color-ink) font-display text-sm font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(46,42,33,0.5)] sm:size-14 sm:text-base">
            VS
          </span>
          <span className="relative text-2xl sm:text-3xl">{theme.emoji}</span>
        </div>

        <TeamScoreCard tint={TEAM_TINT.B} score={scoreB} pulsing={pulse === "B"} winner={finished && winner === "B"} />
      </div>

      {!finished &&
        (Scene ? (
          <Scene theme={theme} index={index} total={total} scoreA={scoreA} scoreB={scoreB} finished={finished} />
        ) : (
          <DefaultBattleScene theme={theme} index={index} total={total} scoreA={scoreA} scoreB={scoreB} finished={finished} />
        ))}

      {finished ? (
        <FinishedPanel theme={theme} teamA={scoreA} teamB={scoreB} winner={winner} onRestart={handleRestart} />
      ) : (
        question && (
          <div className="relative z-10 mt-5 overflow-hidden rounded-[1.75rem] border-4 border-white/70 bg-white p-6 shadow-[0_8px_24px_-8px_rgba(46,42,33,0.15)] sm:p-7">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-4 select-none text-8xl opacity-[0.06] sm:text-9xl"
            >
              {theme.emoji}
            </span>

            <p className="relative inline-flex items-center gap-1 rounded-full bg-(--color-cloud) px-3 py-1 text-xs font-bold uppercase tracking-wide text-(--color-ink)/50">
              Câu {index + 1}/{total}
            </p>
            <p className="font-display relative mt-2 text-xl font-bold text-(--color-ink)">{question.prompt}</p>

            <QuestionReveal question={question} revealed={revealed} />

            {!revealed ? (
              <div className="relative mt-6 flex justify-center">
                <button
                  onClick={() => setRevealed(true)}
                  className="group relative min-h-12 overflow-hidden rounded-full bg-(--color-sun-dark) px-8 py-3 text-base font-extrabold text-white shadow-[0_5px_0_#92400e,0_12px_24px_-8px_rgba(217,119,6,0.5)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#92400e]"
                >
                  <span aria-hidden="true" className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30" />
                  👁️ Hiện đáp án
                </button>
              </div>
            ) : !awarded ? (
              <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => award("A")}
                  className={`min-h-12 rounded-full bg-gradient-to-b ${TEAM_TINT.A.gradient} px-6 py-3 text-base font-extrabold text-white transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none ${TEAM_TINT.A.pressShadow}`}
                >
                  {TEAM_TINT.A.mascot} +1 Đội A
                </button>
                <button
                  onClick={() => award("tie")}
                  className="min-h-12 rounded-full border-2 border-(--color-ink)/15 bg-white px-5 py-3 text-sm font-bold text-(--color-ink)/70 transition hover:-translate-y-0.5 hover:bg-(--color-cloud) active:translate-y-0.5"
                >
                  🤷 Không ai đúng
                </button>
                <button
                  onClick={() => award("B")}
                  className={`min-h-12 rounded-full bg-gradient-to-b ${TEAM_TINT.B.gradient} px-6 py-3 text-base font-extrabold text-white transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none ${TEAM_TINT.B.pressShadow}`}
                >
                  {TEAM_TINT.B.mascot} +1 Đội B
                </button>
              </div>
            ) : (
              <div className="relative mt-6 flex justify-center">
                <button
                  onClick={handleNext}
                  className="group relative min-h-12 overflow-hidden rounded-full bg-(--color-mint) px-8 py-3 text-base font-extrabold text-white shadow-[0_5px_0_#b8492e,0_12px_24px_-8px_rgba(184,73,46,0.5)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <span aria-hidden="true" className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30" />
                  {index + 1 === total ? "🏁 Xem kết quả" : "Câu tiếp theo →"}
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

// Fallback scene — the original generic question-progress dots. Used as a
// starting point for any theme that hasn't gotten a bespoke scene yet.
function DefaultBattleScene({ index, total }: { theme: BattleTheme; index: number; total: number; scoreA: number; scoreB: number; finished: boolean }) {
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

function TeamScoreCard({
  tint,
  score,
  pulsing,
  winner,
}: {
  tint: (typeof TEAM_TINT)[TeamId];
  score: number;
  pulsing: boolean;
  winner: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center gap-1.5 rounded-[1.5rem] bg-white p-3 shadow-[0_3px_0_rgba(46,42,33,0.06),0_8px_18px_-6px_rgba(46,42,33,0.22)] transition sm:p-4 ${
        winner ? `animate-pop-in ring-[3px] ${tint.ring}` : ""
      }`}
    >
      <IconChip
        icon={tint.mascot}
        tint={tint.chip}
        size="xl"
        className={`shadow-[0_4px_10px_-2px_rgba(46,42,33,0.25)] ${pulsing ? "animate-wiggle" : ""}`}
      />
      <span className={`text-xs font-extrabold uppercase tracking-wide sm:text-sm ${tint.text}`}>{tint.name}</span>
      <span
        className={`font-display text-3xl font-extrabold sm:text-4xl ${tint.text} ${pulsing ? "battle-score-pop" : ""}`}
      >
        {score}
      </span>
      {winner && <span className="bat2-crown inline-block text-xl">🥇</span>}
    </div>
  );
}

function FinishedPanel({
  theme,
  teamA,
  teamB,
  winner,
  onRestart,
}: {
  theme: BattleTheme;
  teamA: number;
  teamB: number;
  winner: TeamId | null;
  onRestart: () => void;
}) {
  const winnerTint = winner ? TEAM_TINT[winner] : null;
  const ribbonGradient = winnerTint ? winnerTint.gradient : "from-(--color-sun) to-(--color-sun-dark)";
  const ribbonTail = winnerTint ? winnerTint.pressShadowHex : "#92400e";

  return (
    <div className="animate-pop-in relative z-10 mt-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-(--color-sun)/20 to-white px-6 py-10 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="battle-confetti absolute top-0 text-2xl"
            style={{ left: `${c.left}%`, animationDelay: `${c.delay}s`, "--drift": `${c.drift}px` } as React.CSSProperties}
          >
            {c.icon}
          </span>
        ))}
      </div>

      <CheerSquad className="relative mb-2" size="text-3xl sm:text-4xl" />

      {/* Winner mascot flanked by cheering classmates, right beside the trophy */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-5">
        <span className="animate-wiggle text-3xl sm:text-4xl" style={{ animationDelay: "0.1s" }} aria-hidden="true">
          🙋‍♂️
        </span>
        <div className="relative inline-block">
          <IconChip
            icon={winner === null ? "🤝" : winnerTint!.mascot}
            tint={winner === null ? "mint" : winnerTint!.chip}
            size="2xl"
            className="animate-float shadow-[0_10px_26px_-10px_rgba(46,42,33,0.35)]"
          />
          <span className="bat2-crown absolute -bottom-2 -right-2 inline-block text-4xl sm:-right-3 sm:text-5xl">
            {winner === null ? "🤝" : "🏆"}
          </span>
        </div>
        <span className="animate-wiggle text-3xl sm:text-4xl" style={{ animationDelay: "0.3s" }} aria-hidden="true">
          🙋‍♀️
        </span>
      </div>

      <div className="relative mt-4 inline-block">
        <div
          className={`animate-banner-sway relative rounded-2xl bg-gradient-to-b ${ribbonGradient} px-7 py-3 shadow-[0_12px_28px_-10px_rgba(46,42,33,0.5)] sm:px-10`}
          style={{ transformOrigin: "top center" }}
        >
          <h2
            className="font-display text-xl font-extrabold text-white sm:text-2xl"
            style={{ textShadow: "0 2px 0 rgba(0,0,0,0.25), 0 6px 12px rgba(46,42,33,0.3)" }}
          >
            {winner === null ? "HAI ĐỘI HÒA NHAU!" : `${winnerTint?.name.toUpperCase()} CHIẾN THẮNG!`}
          </h2>
          <span
            className="absolute -bottom-2 left-3 h-0 w-0 border-x-[9px] border-t-[9px] border-x-transparent"
            style={{ borderTopColor: ribbonTail }}
          />
          <span
            className="absolute -bottom-2 right-3 h-0 w-0 border-x-[9px] border-t-[9px] border-x-transparent"
            style={{ borderTopColor: ribbonTail }}
          />
        </div>
      </div>

      <p className="relative mt-4 text-sm text-(--color-ink)/60">
        {theme.emoji} {theme.name} · Tỉ số cuối {teamA} - {teamB}
      </p>

      <div className="relative mx-auto mt-6 flex max-w-xs flex-col gap-3">
        <ScoreRow label={TEAM_TINT.A.name} tint={TEAM_TINT.A} score={teamA} highlight={winner === "A"} />
        <ScoreRow label={TEAM_TINT.B.name} tint={TEAM_TINT.B} score={teamB} highlight={winner === "B"} />
      </div>

      <button
        onClick={onRestart}
        className="group relative mt-8 min-h-12 overflow-hidden rounded-full bg-(--color-sun-dark) px-8 py-3 text-base font-extrabold text-white shadow-[0_5px_0_#92400e,0_12px_24px_-8px_rgba(217,119,6,0.5)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#92400e]"
      >
        <span aria-hidden="true" className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30" />
        🔁 Chơi lại
      </button>
    </div>
  );
}

function ScoreRow({
  label,
  tint,
  score,
  highlight,
}: {
  label: string;
  tint: (typeof TEAM_TINT)[TeamId];
  score: number;
  highlight: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-[0_3px_0_rgba(46,42,33,0.05),0_6px_14px_-4px_rgba(46,42,33,0.18)] ${
        highlight ? `ring-[3px] ${tint.ring}` : ""
      }`}
    >
      <span className={`flex items-center gap-2 font-display font-bold ${tint.text}`}>
        {highlight && <span aria-hidden="true">🥇</span>}
        <IconChip icon={tint.mascot} tint={tint.chip} size="sm" />
        {label}
      </span>
      <span className="font-extrabold text-(--color-ink)">{score} điểm</span>
    </div>
  );
}
