"use client";

import { useRef, useState } from "react";

import { useCameraMotion } from "@/lib/useCameraMotion";
import { IconChip } from "@/components/IconChip";

const TOTAL_ROUNDS = 5;
const PROMPT_MS = 2200;
const REVEAL_MS = 1100;
const MIN_MOTION_TO_COUNT = 6;

type Direction = "left" | "right";
type Phase = "idle" | "get-ready" | "prompt" | "reveal" | "finished";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function medalFor(score: number) {
  if (score >= TOTAL_ROUNDS) return { emoji: "🏆", label: "Xuất sắc!", tint: "mint" as const };
  if (score >= Math.ceil(TOTAL_ROUNDS * 0.6)) return { emoji: "🥈", label: "Khá lắm!", tint: "lavender" as const };
  return { emoji: "🥉", label: "Cố lên nhé!", tint: "peach" as const };
}

// Small round-progress pips, shared by the in-game header strip and the finished
// recap: ✓/✕ for decided rounds, a pulsing amber dot for the round in progress,
// plain numbered circles for rounds that haven't happened yet.
function RoundDots({
  history,
  round,
  total,
  className = "",
}: {
  history: boolean[];
  round: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, i) => {
        const result = history[i];
        if (result === true) {
          return (
            <span
              key={i}
              className="flex size-6 items-center justify-center rounded-full bg-(--color-mint) text-[11px] font-extrabold text-white shadow-[0_2px_0_var(--color-mint-dark)] sm:size-7"
            >
              ✓
            </span>
          );
        }
        if (result === false) {
          return (
            <span
              key={i}
              className="flex size-6 items-center justify-center rounded-full bg-(--color-bloom) text-[11px] font-extrabold text-white shadow-[0_2px_0_rgba(107,17,61,0.6)] sm:size-7"
            >
              ✕
            </span>
          );
        }
        if (i === round) {
          return (
            <span
              key={i}
              className="headtilt-dot-pulse flex size-6 items-center justify-center rounded-full bg-(--color-sun) text-[11px] font-extrabold text-white sm:size-7"
            >
              {i + 1}
            </span>
          );
        }
        return (
          <span
            key={i}
            className="flex size-6 items-center justify-center rounded-full border-2 border-(--color-ink)/15 bg-white text-[11px] font-bold text-(--color-ink)/35 sm:size-7"
          >
            {i + 1}
          </span>
        );
      })}
    </div>
  );
}

export function HeadTiltClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState<Direction>("left");
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);

  const collectingRef = useRef(false);
  const leftSumRef = useRef(0);
  const rightSumRef = useRef(0);
  const cancelledRef = useRef(false);

  const { videoRef, start, stop, active, error } = useCameraMotion((frame) => {
    if (!collectingRef.current) return;
    leftSumRef.current += frame.left;
    rightSumRef.current += frame.right;
  });

  async function playRound(roundNumber: number) {
    const dir: Direction = Math.random() < 0.5 ? "left" : "right";
    setDirection(dir);
    setPhase("prompt");
    leftSumRef.current = 0;
    rightSumRef.current = 0;
    collectingRef.current = true;

    await sleep(PROMPT_MS);
    if (cancelledRef.current) return;
    collectingRef.current = false;

    // The preview video is CSS-mirrored (scale-x-[-1]) for a natural selfie
    // view, but motion is sampled from the raw, unmirrored frame — so the
    // raw left/right sums are swapped relative to what the player sees.
    const screenLeft = rightSumRef.current;
    const screenRight = leftSumRef.current;
    const movedEnough = Math.max(screenLeft, screenRight) > MIN_MOTION_TO_COUNT;
    const guessedSide: Direction = screenLeft >= screenRight ? "left" : "right";
    const correct = movedEnough && guessedSide === dir;

    setLastCorrect(correct);
    setHistory((h) => [...h, correct]);
    if (correct) setScore((s) => s + 1);
    setPhase("reveal");

    await sleep(REVEAL_MS);
    if (cancelledRef.current) return;

    if (roundNumber + 1 >= TOTAL_ROUNDS) {
      setPhase("finished");
      stop();
    } else {
      setRound(roundNumber + 1);
      playRound(roundNumber + 1);
    }
  }

  async function handleStart() {
    cancelledRef.current = false;
    setScore(0);
    setRound(0);
    setLastCorrect(null);
    setHistory([]);
    setPhase("get-ready");
    await start();
    await sleep(900);
    if (cancelledRef.current) return;
    playRound(0);
  }

  function handleStop() {
    cancelledRef.current = true;
    collectingRef.current = false;
    stop();
    setPhase("idle");
  }

  const medal = medalFor(score);

  const ringClass =
    phase === "prompt"
      ? direction === "left"
        ? "ring-4 ring-(--color-lavender)"
        : "ring-4 ring-(--color-mint)"
      : phase === "reveal"
        ? lastCorrect
          ? "ring-4 ring-(--color-mint)"
          : "ring-4 ring-(--color-bloom)"
        : "ring-4 ring-transparent";

  return (
    <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-(--color-cloud) p-6 shadow-[0_16px_40px_-16px_rgba(46,42,33,0.25)] sm:gap-6 sm:rounded-[2.5rem] sm:p-10">
      {(phase === "get-ready" || phase === "prompt" || phase === "reveal") && (
        <div className="flex w-72 items-center justify-between sm:w-80">
          <RoundDots history={history} round={round} total={TOTAL_ROUNDS} />
          <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-(--color-sun-dark) shadow-[0_3px_10px_-3px_rgba(46,42,33,0.18)]">
            ⭐ {score}
          </span>
        </div>
      )}

      <div
        className={`relative size-72 overflow-hidden rounded-[2.5rem] bg-(--color-ink)/90 shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08),0_8px_32px_-8px_rgba(62,40,27,0.4)] transition-all duration-300 sm:size-80 ${ringClass}`}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          className={`size-full scale-x-[-1] object-cover transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
        />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
            <IconChip
              icon="🐰"
              tint="lavender"
              size="2xl"
              className="animate-float shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)]"
            />
            <span className="text-sm font-bold">Camera đang tắt</span>
          </div>
        )}

        {phase === "get-ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 text-center">
            <IconChip
              icon="🙋"
              tint="mint"
              size="xl"
              className="animate-pop-in shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)]"
            />
            <span
              className="animate-pop-in font-display text-2xl font-extrabold text-white sm:text-3xl"
              style={{ animationDelay: "0.08s" }}
            >
              Chuẩn bị nhé...
            </span>
          </div>
        )}

        {phase === "prompt" && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black/35">
            <div
              key={direction + round}
              className={`headtilt-slide-in flex items-center gap-3 rounded-[1.75rem] px-6 py-4 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.5)] ${
                direction === "left"
                  ? "bg-gradient-to-r from-(--color-lavender) to-[#5b21b6]"
                  : "bg-gradient-to-l from-(--color-mint) to-(--color-mint-dark)"
              }`}
              style={{ "--slide-from": direction === "left" ? "60%" : "-60%" } as React.CSSProperties}
            >
              {direction === "left" && <span className="animate-wiggle text-6xl sm:text-7xl">⬅️</span>}
              <span className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {direction === "left" ? "TRÁI!" : "PHẢI!"}
              </span>
              {direction === "right" && <span className="animate-wiggle text-6xl sm:text-7xl">➡️</span>}
            </div>
          </div>
        )}

        {phase === "reveal" && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${lastCorrect ? "bg-(--color-mint)/35" : "bg-(--color-bloom)/35"}`}
          >
            <span className={`animate-pop-in text-8xl ${lastCorrect ? "" : "animate-wiggle"}`}>
              {lastCorrect ? "✅" : "❌"}
            </span>
            <span
              className="animate-pop-in font-display text-lg font-extrabold text-white drop-shadow-sm sm:text-xl"
              style={{ animationDelay: "0.05s" }}
            >
              {lastCorrect ? "Tuyệt vời! 🎉" : "Chưa đúng, cố lên nhé!"}
            </span>
          </div>
        )}

        {phase === "finished" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 px-4 text-center text-white">
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="animate-twinkle absolute left-[10%] top-6 text-2xl">🎊</span>
              <span className="animate-twinkle absolute right-[12%] top-9 text-2xl" style={{ animationDelay: "0.3s" }}>
                ✨
              </span>
              <span className="animate-twinkle absolute left-[16%] bottom-9 text-2xl" style={{ animationDelay: "0.6s" }}>
                🎉
              </span>
              <span className="animate-twinkle absolute right-[16%] bottom-11 text-2xl" style={{ animationDelay: "0.9s" }}>
                🎊
              </span>
              <span className="animate-twinkle absolute left-[6%] top-1/2 text-xl" style={{ animationDelay: "1.2s" }}>
                ⭐
              </span>
              <span className="animate-twinkle absolute right-[6%] top-[38%] text-xl" style={{ animationDelay: "1.5s" }}>
                ✨
              </span>
            </span>
            <div className="relative flex items-center gap-2">
              <span className="animate-wiggle text-5xl" style={{ animationDelay: "0.15s" }}>
                🧑‍🎓
              </span>
              <IconChip
                icon={medal.emoji}
                tint={medal.tint}
                size="2xl"
                className="animate-float shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)]"
              />
              <span className="animate-wiggle text-5xl" style={{ animationDelay: "0.35s" }}>
                👦
              </span>
            </div>
            <p className="font-display relative mt-1 text-2xl font-extrabold">{medal.label}</p>
            <p className="relative font-display text-xl font-extrabold">
              Đúng {score}/{TOTAL_ROUNDS}
            </p>
            <RoundDots history={history} round={TOTAL_ROUNDS} total={TOTAL_ROUNDS} className="relative mt-1" />
          </div>
        )}
      </div>

      {error && (
        <p className="flex max-w-sm items-center gap-2 rounded-full bg-white px-4 py-2 text-center text-sm font-bold text-(--color-bloom) shadow-[0_3px_10px_-3px_rgba(46,42,33,0.18)]">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}

      <div className="flex gap-3">
        {phase === "idle" || phase === "finished" ? (
          <button
            type="button"
            onClick={handleStart}
            className="animate-glow group relative min-h-12 overflow-hidden rounded-full bg-(--color-mint) px-8 py-3 text-base font-extrabold text-white shadow-[0_5px_0_var(--color-mint-dark),0_12px_24px_-8px_rgba(184,73,46,0.55)] transition active:translate-y-1 active:shadow-[0_1px_0_var(--color-mint-dark)]"
          >
            <span
              aria-hidden="true"
              className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30"
            />
            {phase === "idle" ? "🎥 Bắt đầu chơi" : "🔁 Chơi lại"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="min-h-12 rounded-full border-2 border-(--color-ink)/15 bg-white px-8 py-3 text-base font-extrabold text-(--color-ink) shadow-[0_4px_0_rgba(46,42,33,0.08),0_10px_20px_-6px_rgba(46,42,33,0.18)] transition active:translate-y-1 active:shadow-[0_1px_0_rgba(46,42,33,0.08)]"
          >
            Dừng
          </button>
        )}
      </div>

      <p className="flex max-w-sm items-start gap-2 rounded-2xl bg-white/60 p-3 text-left text-xs text-(--color-ink)/55">
        <span aria-hidden="true">🔒</span>
        <span>
          Khi có lệnh, hãy nghiêng người hoặc đưa tay về đúng phía được gọi. Camera chỉ xử lý ngay
          trên máy bạn để nhận diện chuyển động — không ghi hình hay gửi đi bất cứ đâu.
        </span>
      </p>

      <style>{`
        @keyframes headtilt-slide-in {
          0% { transform: translateX(var(--slide-from)) scale(0.6); opacity: 0; }
          60% { transform: translateX(0) scale(1.08); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .headtilt-slide-in {
          animation: headtilt-slide-in 0.4s var(--ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)) both;
        }

        @keyframes headtilt-dot-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217,119,6,0.35); }
          50% { transform: scale(1.18); box-shadow: 0 0 0 5px rgba(217,119,6,0.22); }
        }
        .headtilt-dot-pulse {
          animation: headtilt-dot-pulse 1s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .headtilt-slide-in,
          .headtilt-dot-pulse {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
