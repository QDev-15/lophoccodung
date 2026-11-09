"use client";

import Link from "next/link";
import { useState } from "react";

import type { AdventureTheme, Tint } from "@/lib/adventure-themes";
import { TINT_STYLES } from "@/lib/adventure-themes";
import { IconChip } from "@/components/IconChip";

import { QuestionReveal, type GameQuestion } from "../../QuestionReveal";
import { ADVENTURE_SCENES } from "./_scenes";

export function AdventurePlayer({
  theme,
  quiz,
}: {
  theme: AdventureTheme;
  quiz: { id: string; title: string; questions: GameQuestion[] };
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const total = quiz.questions.length;
  const finished = index >= total;
  const question = finished ? null : quiz.questions[index];
  const tint = TINT_STYLES[theme.tint];
  const progressPct = total > 0 ? Math.min(100, (index / total) * 100) : 0;
  const Scene = ADVENTURE_SCENES[theme.slug];

  function handleNext() {
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  function handleRestart() {
    setIndex(0);
    setRevealed(false);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-4 shadow-[0_16px_40px_-16px_rgba(46,42,33,0.3)] sm:p-6">
      <AdventureBackdrop theme={theme} tint={tint} />

      <div className="relative z-10 flex flex-col gap-5">
        <QuizHeader theme={theme} tint={tint} quizTitle={quiz.title} index={index} total={total} />

        {Scene ? (
          <Scene theme={theme} index={index} total={total} finished={finished} />
        ) : (
          <TrailPath theme={theme} tint={tint} total={total} index={index} finished={finished} />
        )}

        {finished ? (
          <FinishCard theme={theme} tint={tint} total={total} quizTitle={quiz.title} onRestart={handleRestart} />
        ) : (
          question && (
            <QuestionCard
              theme={theme}
              tint={tint}
              index={index}
              total={total}
              progressPct={progressPct}
              question={question}
              revealed={revealed}
              onReveal={() => setRevealed(true)}
              onNext={handleNext}
            />
          )
        )}
      </div>

      <style>{`
        @keyframes adv-ping {
          0% {
            transform: scale(0.85);
            opacity: 0.55;
          }
          70%, 100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        .adv-ping {
          animation: adv-ping 1.8s cubic-bezier(.34, 1.56, .64, 1) infinite;
        }

        @keyframes adv-bob-in {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.6);
          }
          60% {
            opacity: 1;
            transform: translateY(-4px) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .adv-bob-in {
          animation: adv-bob-in 0.55s cubic-bezier(.34, 1.56, .64, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .adv-ping {
            animation: none;
            opacity: 0;
          }
          .adv-bob-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header — theme chip + quiz title + progress pill, so a teacher mid-lesson
// always sees which adventure and which quiz is running without hunting.
// ---------------------------------------------------------------------------

function QuizHeader({
  theme,
  tint,
  quizTitle,
  index,
  total,
}: {
  theme: AdventureTheme;
  tint: (typeof TINT_STYLES)[Tint];
  quizTitle: string;
  index: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3 px-1">
      <IconChip icon={theme.emoji} tint={theme.tint} size="md" className="shadow-[0_4px_10px_-3px_rgba(46,42,33,0.3)]" />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-extrabold uppercase tracking-wide ${tint.text}`}>{theme.name}</p>
        <p className="truncate text-xs font-semibold text-(--color-ink)/45">{quizTitle}</p>
      </div>
      <span className="shrink-0 rounded-full bg-(--color-ink)/5 px-3 py-1.5 text-xs font-bold text-(--color-ink)/60">
        {Math.min(index, total)}/{total} câu
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Decorative backdrop — generic across every theme, tinted + lightly flavored
// by theme.emoji so it never needs per-theme illustration assets.
// ---------------------------------------------------------------------------

function AdventureBackdrop({ theme, tint }: { theme: AdventureTheme; tint: (typeof TINT_STYLES)[Tint] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div className={`absolute inset-0 bg-gradient-to-b ${tint.blob}/50 via-white to-(--color-cloud)`} />
      <div className={`absolute -right-10 -top-10 size-56 rounded-full ${tint.blob} opacity-70 blur-3xl`} />
      <div className={`absolute -left-14 top-1/3 size-48 rounded-full ${tint.blob} opacity-60 blur-3xl`} />
      <span className="animate-float absolute right-[6%] top-[8%] text-5xl opacity-20 sm:text-6xl">
        {theme.emoji}
      </span>
      <span
        className="animate-float absolute left-[4%] bottom-[10%] text-4xl opacity-15 sm:text-5xl"
        style={{ animationDelay: "0.8s" }}
      >
        {theme.stepIcon}
      </span>
      {/* Sparing sun-colored sparkle accents, per the "stars/sparkle" accent rule. */}
      <span className="animate-twinkle absolute left-[48%] top-[10%] text-xl text-(--color-sun) opacity-70" style={{ animationDelay: "1.1s" }}>
        ✨
      </span>
      <span className="animate-twinkle absolute right-[32%] bottom-[14%] text-lg text-(--color-sun) opacity-60" style={{ animationDelay: "1.6s" }}>
        ✨
      </span>
      {/* A little cheer squad watching from the sidelines — keeps the board feeling kid-populated even mid-game. */}
      <span className="animate-wiggle absolute left-[2%] top-[6%] text-4xl opacity-70 sm:text-5xl" style={{ animationDelay: "0.2s" }}>
        🙋‍♀️
      </span>
      <span className="animate-wiggle absolute right-[3%] bottom-[6%] text-4xl opacity-70 sm:text-5xl" style={{ animationDelay: "0.5s" }}>
        🙋‍♂️
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trail path — a winding row of stepping-stones. Completed steps show a
// checkmark, the current step carries the bouncing mascot (with a soft radar
// "ping" ring so small kids can always spot "we are here"), the rest show the
// theme's stepIcon. A tint-colored fill tracks real progress along the base
// line instead of a plain static dashed rule.
// ---------------------------------------------------------------------------

function TrailPath({
  theme,
  tint,
  total,
  index,
  finished,
}: {
  theme: AdventureTheme;
  tint: (typeof TINT_STYLES)[Tint];
  total: number;
  index: number;
  finished: boolean;
}) {
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
              <span className={`relative ${current ? "animate-float text-4xl sm:text-5xl" : done ? "text-xl" : "text-xl"}`}>
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

// ---------------------------------------------------------------------------
// Candy-3D button — one reusable pill for every clickable control in this
// engine (layered shadow + glossy top highlight + press-down feedback), so
// every button reads consistently "squishy" for small fingers.
// ---------------------------------------------------------------------------

function CandyButton({
  tone,
  tint,
  onClick,
  href,
  glow = false,
  shine = false,
  className = "",
  children,
}: {
  tone: "primary" | "neutral" | "outline";
  tint?: (typeof TINT_STYLES)[Tint];
  onClick?: () => void;
  href?: string;
  glow?: boolean;
  shine?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const base =
    "relative inline-flex min-h-12 items-center justify-center gap-1.5 overflow-hidden rounded-full px-7 text-sm font-extrabold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0.5";
  const toneClass =
    tone === "primary"
      ? `${tint?.bg ?? "bg-(--color-ink)"} text-white shadow-[0_4px_0_var(--shadow-dark),0_10px_20px_-6px_rgba(46,42,33,0.35)] active:shadow-[0_1px_0_var(--shadow-dark)]`
      : tone === "neutral"
        ? "bg-(--color-ink)/10 text-(--color-ink) shadow-[0_3px_0_rgba(46,42,33,0.15)] active:shadow-none"
        : "border-2 border-(--color-ink)/15 bg-white text-(--color-ink) shadow-none hover:bg-(--color-cloud) active:translate-y-0";
  const style = tone === "primary" ? ({ "--shadow-dark": tint?.shadowDark ?? "#000" } as React.CSSProperties) : undefined;

  const content = (
    <>
      {tone !== "outline" && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-t-full bg-white/25 blur-[1px]" />
      )}
      {shine && (
        <span aria-hidden="true" className="animate-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/35" />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </>
  );

  const classes = `${base} ${toneClass} ${glow ? "animate-glow" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} style={style}>
      {content}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Question card
// ---------------------------------------------------------------------------

function QuestionCard({
  theme,
  tint,
  index,
  total,
  progressPct,
  question,
  revealed,
  onReveal,
  onNext,
}: {
  theme: AdventureTheme;
  tint: (typeof TINT_STYLES)[Tint];
  index: number;
  total: number;
  progressPct: number;
  question: GameQuestion;
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
}) {
  return (
    <div
      key={question.id}
      className="animate-pop-in relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_12px_32px_-12px_rgba(46,42,33,0.25)]"
    >
      <span className="adv-bob-in pointer-events-none absolute -right-2 -top-3 z-10 text-4xl drop-shadow sm:text-5xl">
        {theme.mascot}
      </span>

      <div className={`flex items-center justify-between bg-gradient-to-r ${tint.gradient} px-5 py-3`}>
        <span className="flex items-center gap-2 text-sm font-extrabold text-white">
          <span className="text-2xl">{theme.stepIcon}</span> Câu {index + 1}/{total}
        </span>
        <span className="rounded-full bg-white/25 px-2.5 py-1 text-xs font-bold text-white">
          {question.points} điểm
        </span>
      </div>

      <div className="h-1.5 w-full bg-(--color-cloud)">
        <div
          className={`h-full bg-gradient-to-r ${tint.gradient} transition-[width] duration-300`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="p-6">
        <p className="font-display text-xl font-bold text-(--color-ink)">{question.prompt}</p>

        <QuestionReveal question={question} revealed={revealed} />

        <div className="mt-6 flex justify-end gap-3">
          {!revealed ? (
            <CandyButton tone="neutral" onClick={onReveal}>
              Hiện đáp án
            </CandyButton>
          ) : (
            <CandyButton tone="primary" tint={tint} onClick={onNext} glow shine>
              {index + 1 === total ? "Về đích →" : "Câu tiếp theo →"}
            </CandyButton>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Finish card
// ---------------------------------------------------------------------------

function FinishRibbon({ tint }: { tint: (typeof TINT_STYLES)[Tint] }) {
  return (
    <div className="relative mx-auto mt-5 inline-flex items-center">
      <span
        aria-hidden="true"
        className="h-0 w-0 border-y-[11px] border-r-[9px] border-y-transparent"
        style={{ borderRightColor: tint.shadowDark }}
      />
      <div className={`rounded-md bg-gradient-to-r ${tint.gradient} px-5 py-1.5 shadow-[0_6px_14px_-4px_rgba(46,42,33,0.4)]`}>
        <span className="font-display text-xs font-extrabold uppercase tracking-wider text-white sm:text-sm">
          Hoàn thành hành trình
        </span>
      </div>
      <span
        aria-hidden="true"
        className="h-0 w-0 border-y-[11px] border-l-[9px] border-y-transparent"
        style={{ borderLeftColor: tint.shadowDark }}
      />
    </div>
  );
}

function FinishCard({
  theme,
  tint,
  total,
  quizTitle,
  onRestart,
}: {
  theme: AdventureTheme;
  tint: (typeof TINT_STYLES)[Tint];
  total: number;
  quizTitle: string;
  onRestart: () => void;
}) {
  return (
    <div className="animate-pop-in relative overflow-hidden rounded-[1.75rem] bg-white px-6 py-12 text-center shadow-[0_16px_40px_-16px_rgba(46,42,33,0.3)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="animate-twinkle absolute left-[12%] top-6 text-4xl sm:text-5xl">🎊</span>
        <span className="animate-twinkle absolute right-[14%] top-8 text-4xl sm:text-5xl" style={{ animationDelay: "0.3s" }}>
          ✨
        </span>
        <span className="animate-twinkle absolute left-[20%] bottom-8 text-4xl sm:text-5xl" style={{ animationDelay: "0.6s" }}>
          🎉
        </span>
        <span className="animate-twinkle absolute right-[20%] bottom-10 text-4xl sm:text-5xl" style={{ animationDelay: "0.9s" }}>
          🎊
        </span>
        <span className="animate-float absolute left-[6%] top-1/2 text-3xl opacity-80 sm:text-4xl" style={{ animationDelay: "0.4s" }}>
          🌟
        </span>
        <span className="animate-float absolute right-[6%] top-1/2 text-3xl opacity-80 sm:text-4xl" style={{ animationDelay: "0.7s" }}>
          🌈
        </span>
        <span className="animate-twinkle absolute left-[36%] top-3 text-2xl sm:text-3xl" style={{ animationDelay: "1.1s" }}>
          🎈
        </span>
        <span className="animate-twinkle absolute right-[34%] top-5 text-2xl sm:text-3xl" style={{ animationDelay: "1.4s" }}>
          🪅
        </span>
      </div>

      <div className="relative mx-auto flex items-end justify-center gap-2">
        <span className="animate-wiggle text-5xl sm:text-6xl" style={{ animationDelay: "0.1s" }}>
          🙋‍♀️
        </span>
        <span className="relative inline-flex">
          <span
            aria-hidden="true"
            className="adv-ping absolute inset-0 rounded-full border-2"
            style={{ borderColor: tint.shadowDark }}
          />
          <IconChip
            icon={theme.finishIcon}
            tint={theme.tint}
            size="2xl"
            className="animate-float shadow-[0_10px_26px_-8px_rgba(46,42,33,0.35)]"
          />
        </span>
        <span className="animate-wiggle text-5xl sm:text-6xl" style={{ animationDelay: "0.4s" }}>
          🙋‍♂️
        </span>
      </div>

      <FinishRibbon tint={tint} />

      <h2 className="font-display relative mt-4 text-2xl font-extrabold text-(--color-ink) sm:text-3xl">
        🎉 {theme.mascot} Cả lớp mình giỏi quá! {theme.mascot} 🎉
      </h2>
      <p className="relative mt-2 text-sm text-(--color-ink)/60">
        Cả lớp đã trả lời xong {total} câu hỏi trong &quot;{quizTitle}&quot;.
      </p>

      <div className="relative mt-4 flex justify-center">
        <span className={`inline-flex items-center gap-1.5 rounded-full ${tint.bgLight} px-4 py-1.5 text-sm font-bold ${tint.text}`}>
          📚 {total} câu đã chinh phục
        </span>
      </div>

      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <CandyButton tone="primary" tint={tint} onClick={onRestart} glow shine>
          🔁 Chơi lại
        </CandyButton>
        <CandyButton tone="outline" href="../phieu-luu-tri-thuc">
          Chọn hành trình khác
        </CandyButton>
      </div>
    </div>
  );
}
