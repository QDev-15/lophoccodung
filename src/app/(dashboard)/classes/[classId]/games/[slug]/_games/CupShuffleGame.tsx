"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner, GAME_ACCENTS, candyButtonClass, GameStageBackdrop, CheerSquad } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";
import { IconChip } from "@/components/IconChip";

const accent = GAME_ACCENTS.peach;

// Flavor-agnostic cup visuals — this component is reused under several themed
// catalog entries ("Xóc đĩa", "Hồ lô biến hình", ...), so the mascot/cup art
// here stays generic rather than tied to one theme's name.
const CUP_LANES = [
  { emoji: "🥤", dance: "cupshuffle-dance-left" },
  { emoji: "🥤", dance: "cupshuffle-dance-mid" },
  { emoji: "🥤", dance: "cupshuffle-dance-right" },
];

export function CupShuffleGame({ pick, isExhausted }: GameComponentProps) {
  const [shuffling, setShuffling] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleShuffle() {
    if (shuffling || isExhausted) return;
    const result = pick();
    if (!result) return;
    setShuffling(true);
    setStudent(null);
    setTimeout(() => {
      setShuffling(false);
      setStudent(result.student);
    }, 1200);
  }

  const idle = !shuffling && !student;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)]">
      <GameStageBackdrop accent={accent} />

      {/* Ambient corner mascots — purely decorative, generic critters (not tied to any one theme). */}
      <span aria-hidden="true" className="animate-float absolute left-3 top-3 text-3xl opacity-60 sm:text-4xl">
        🐿️
      </span>
      <span
        aria-hidden="true"
        className="animate-float absolute right-3 top-3 text-3xl opacity-60 sm:text-4xl"
        style={{ animationDelay: "0.6s" }}
      >
        🦊
      </span>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="animate-pop-in inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-(--color-peach) shadow-[0_3px_10px_-3px_rgba(21,128,61,0.25)]">
          🎲 Xóc xóc xóc... ai sẽ được gọi tên?
        </span>

        {/* Tray + cups */}
        <div className="relative flex flex-col items-center">
          <div
            aria-hidden="true"
            className={`absolute bottom-1 h-6 w-56 rounded-[50%] bg-(--color-ink)/15 blur-md transition-opacity sm:w-64 ${
              shuffling ? "cupshuffle-dust opacity-80" : "opacity-50"
            }`}
          />

          <div className="relative flex items-end gap-5 rounded-[2rem] border-2 border-white/60 bg-gradient-to-b from-white/80 to-white/50 px-8 py-7 shadow-[inset_0_2px_6px_rgba(46,42,33,0.08),0_10px_24px_-10px_rgba(46,42,33,0.25)] sm:gap-7 sm:px-10">
            {shuffling && (
              <>
                <span className="animate-twinkle absolute -top-3 left-4 text-xl">✨</span>
                <span className="animate-twinkle absolute -top-2 right-6 text-lg" style={{ animationDelay: "0.3s" }}>
                  ⭐
                </span>
                <span className="animate-twinkle absolute -right-2 top-6 text-base" style={{ animationDelay: "0.5s" }}>
                  ✨
                </span>
              </>
            )}

            {CUP_LANES.map((lane, i) => (
              <div key={i} className="relative flex flex-col items-center">
                <span
                  className={`flex size-5 items-center justify-center rounded-full bg-(--color-peach) text-[10px] font-extrabold text-white shadow-sm sm:size-6 sm:text-xs ${
                    shuffling ? "opacity-70" : ""
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`-mt-1 text-6xl drop-shadow-[0_8px_8px_rgba(46,42,33,0.28)] sm:text-7xl ${
                    shuffling ? lane.dance : idle ? "animate-float" : ""
                  }`}
                  style={!shuffling && idle ? { animationDelay: `${i * 0.2}s` } : undefined}
                >
                  {lane.emoji}
                </span>
                <div aria-hidden="true" className="-mt-2 h-2 w-10 rounded-[50%] bg-(--color-ink)/10 blur-[2px] sm:w-12" />
              </div>
            ))}
          </div>
        </div>

        {idle && (
          <div className="flex flex-col items-center gap-2">
            <p className="rounded-2xl bg-white/80 px-4 py-2 text-base font-bold text-(--color-ink)/70 shadow-[0_3px_10px_-3px_rgba(46,42,33,0.15)]">
              Có một bạn đang trốn dưới ly đó! 🙈
            </p>
            <CheerSquad seed={3} />
          </div>
        )}

        <button
          onClick={handleShuffle}
          disabled={shuffling || isExhausted}
          className={`${candyButtonClass(accent, shuffling || isExhausted)} ${
            !shuffling && !isExhausted ? "animate-glow" : ""
          }`}
        >
          {shuffling ? "🥤 Đang xóc..." : student ? "🔄 Xóc tiếp nào!" : "🥤 Xóc đĩa!"}
        </button>

        {student && (
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <IconChip icon="🐰" tint="peach" size="lg" className="animate-wiggle shrink-0 shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)]" />
            <RevealBanner student={student} />
            <div className="animate-wiggle shrink-0" style={{ animationDelay: "0.2s" }}>
              <IconChip icon="🐻" tint="lavender" size="lg" className="shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)]" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cupshuffle-dance-left {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          15% { transform: translateX(58px) translateY(-14px) rotate(10deg); }
          35% { transform: translateX(96px) translateY(2px) rotate(-6deg); }
          55% { transform: translateX(28px) translateY(-16px) rotate(8deg); }
          75% { transform: translateX(-70px) translateY(0px) rotate(-10deg); }
          90% { transform: translateX(-18px) translateY(-10px) rotate(4deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        .cupshuffle-dance-left { animation: cupshuffle-dance-left 1.2s cubic-bezier(.34,1.56,.64,1) both; }

        @keyframes cupshuffle-dance-mid {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          20% { transform: translateX(-46px) translateY(-10px) rotate(-8deg); }
          40% { transform: translateX(42px) translateY(-18px) rotate(9deg); }
          60% { transform: translateX(-30px) translateY(-2px) rotate(-6deg); }
          80% { transform: translateX(20px) translateY(-12px) rotate(5deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        .cupshuffle-dance-mid { animation: cupshuffle-dance-mid 1.2s cubic-bezier(.34,1.56,.64,1) both; }

        @keyframes cupshuffle-dance-right {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          15% { transform: translateX(-60px) translateY(-12px) rotate(-10deg); }
          35% { transform: translateX(-98px) translateY(4px) rotate(6deg); }
          55% { transform: translateX(-26px) translateY(-16px) rotate(-8deg); }
          75% { transform: translateX(72px) translateY(0px) rotate(10deg); }
          90% { transform: translateX(18px) translateY(-10px) rotate(-4deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        .cupshuffle-dance-right { animation: cupshuffle-dance-right 1.2s cubic-bezier(.34,1.56,.64,1) both; }

        @keyframes cupshuffle-dust {
          0%, 100% { transform: scaleX(1); opacity: 0.5; }
          50% { transform: scaleX(1.3); opacity: 0.85; }
        }
        .cupshuffle-dust { animation: cupshuffle-dust 0.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cupshuffle-dance-left,
          .cupshuffle-dance-mid,
          .cupshuffle-dance-right,
          .cupshuffle-dust {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
