"use client";

import { useState, type CSSProperties } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { GAME_ACCENTS, candyButtonClass, GameStageBackdrop } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";
import { IconChip } from "@/components/IconChip";

// This component powers several differently-themed catalog entries ("Rút thẻ",
// "Stickman", ...) via GamePlayer's GAME_COMPONENTS map, so everything here is
// kept flavor-agnostic: no theme-specific copy, just a generic "mystery card" look.
const accent = GAME_ACCENTS.sun;

// Two cute animal friends who "hold" the deck and cheer when a card is revealed.
const MASCOT_LEFT = "🐰";
const MASCOT_RIGHT = "🦊";

// Deterministic radial layout for the confetti burst that plays on every reveal.
const BURST_OFFSETS: Array<[number, number]> = [
  [0, -62],
  [54, -30],
  [54, 32],
  [0, 64],
  [-54, 32],
  [-54, -30],
];
const BURST_EMOJI = ["✨", "⭐", "🎉", "✨", "⭐", "🎉"];

export function CardDrawGame({ pick, isExhausted }: GameComponentProps) {
  const [flipped, setFlipped] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);
  const [drawCount, setDrawCount] = useState(0);

  function handleDraw() {
    if (flipped || isExhausted) return;
    const result = pick();
    if (!result) return;
    setStudent(result.student);
    setFlipped(true);
    setDrawCount((n) => n + 1);
  }

  function handleReset() {
    setFlipped(false);
    setStudent(null);
  }

  const cardDisabled = flipped || isExhausted;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)] sm:p-8">
      <GameStageBackdrop accent={accent} />
      <span aria-hidden="true" className="animate-twinkle absolute left-5 top-4 text-xl text-(--color-sun-dark)/70">
        ✨
      </span>
      <span
        aria-hidden="true"
        className="animate-twinkle absolute right-6 top-9 text-base text-(--color-sun-dark)/60"
        style={{ animationDelay: "0.6s" }}
      >
        ⭐
      </span>

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 shadow-sm">
          <span className="text-lg">🃏</span>
          <span className="font-display text-xs font-extrabold uppercase tracking-wide text-(--color-sun-dark) sm:text-sm">
            Rút một thẻ bí mật
          </span>
        </div>

        <div className="relative flex h-60 w-full max-w-[20rem] items-center justify-center [perspective:1400px] sm:h-64">
          {/* Two cute animal friends "holding" the deck from behind. */}
          <IconChip
            icon={MASCOT_LEFT}
            tint="peach"
            size="lg"
            className={`absolute bottom-1 left-2 z-0 shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)] sm:left-4 ${flipped ? "animate-wiggle" : "animate-float"}`}
          />
          <IconChip
            icon={MASCOT_RIGHT}
            tint="lavender"
            size="lg"
            className={`absolute bottom-1 right-2 z-0 shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)] [animation-delay:0.3s] sm:right-4 ${flipped ? "animate-wiggle" : "animate-float"}`}
          />

          {/* Decorative fan of face-down cards, flanking the one real card — hidden
              once a card is drawn so the reveal stays uncluttered. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${flipped ? "opacity-0" : "opacity-100"}`}
          >
            <FanCard rotate={-11} offsetX={-48} delay="0s" />
            <FanCard rotate={11} offsetX={48} delay="0.5s" />
          </div>

          {/* The one real, interactive card. */}
          <button
            type="button"
            onClick={handleDraw}
            disabled={cardDisabled}
            aria-label={flipped ? "Thẻ đã được rút" : "Chạm để rút thẻ"}
            className={`relative z-20 h-52 w-36 shrink-0 [transform-style:preserve-3d] transition-transform duration-700 sm:h-60 sm:w-40 ${
              !flipped && !isExhausted ? "cursor-pointer hover:-translate-y-1" : "cursor-default"
            } ${!flipped && isExhausted ? "opacity-60" : ""}`}
            style={{
              transitionTimingFunction: "var(--ease-bounce)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* back face */}
            <span
              className={`absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br ${accent.gradient} text-white shadow-[0_14px_28px_-10px_rgba(217,119,6,0.5)] [backface-visibility:hidden]`}
            >
              <CardPatternBg />
              {!flipped && !isExhausted && (
                <span
                  aria-hidden="true"
                  className="animate-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/25"
                />
              )}
              <span className="relative text-6xl drop-shadow-sm sm:text-7xl">🂠</span>
              <span className="relative text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/85">Rút thẻ</span>
            </span>

            {/* front face (reveal) */}
            <span
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border-4 border-white bg-white p-3 text-center shadow-[0_14px_28px_-10px_rgba(46,42,33,0.3)] [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg)" }}
            >
              {student && (
                <span key={`${student.id}-${drawCount}`} className="relative flex flex-col items-center gap-2">
                  <BurstParticles />
                  <span className="animate-pop-in text-3xl">🎉</span>
                  <span
                    className={`animate-pop-in font-display text-lg font-extrabold leading-tight ${accent.text} sm:text-xl`}
                    style={{ animationDelay: "0.08s" }}
                  >
                    {student.fullName}
                  </span>
                </span>
              )}
            </span>
          </button>
        </div>

        {!flipped && (
          <p className="font-display text-sm font-bold text-(--color-ink)/60">
            👉 Chạm vào thẻ hoặc bấm nút để rút nhé!
          </p>
        )}

        <button
          onClick={flipped ? handleReset : handleDraw}
          disabled={!flipped && isExhausted}
          className={`${candyButtonClass(accent, !flipped && isExhausted)} ${!(!flipped && isExhausted) ? "animate-glow" : ""}`}
        >
          {flipped ? "🔄 Rút thẻ tiếp" : "🃏 Rút thẻ"}
        </button>
      </div>

      <style>{`
        @keyframes carddraw-deck-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .carddraw-deck-card {
          animation: carddraw-deck-bob 3.2s ease-in-out infinite;
        }
        @keyframes carddraw-burst {
          0% { transform: translate(0, 0) scale(0.2); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }
        .carddraw-burst-particle {
          animation: carddraw-burst 650ms ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .carddraw-deck-card {
            animation: none !important;
          }
          .carddraw-burst-particle {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

function FanCard({ rotate, offsetX, delay }: { rotate: number; offsetX: number; delay: string }) {
  return (
    <div className="absolute" style={{ transform: `translateX(${offsetX}px) rotate(${rotate}deg)` }}>
      <div
        className={`carddraw-deck-card flex h-48 w-32 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br ${accent.gradient} opacity-90 shadow-[0_10px_20px_-8px_rgba(217,119,6,0.4)] sm:h-56 sm:w-36`}
        style={{ animationDelay: delay }}
      >
        <span className="text-4xl text-white/70 sm:text-5xl">🂠</span>
      </div>
    </div>
  );
}

// Rendered as a <span> (not <div>) because it lives inside the card's <button>,
// whose content model only permits phrasing content.
function CardPatternBg() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, white 0, white 2px, transparent 2.5px), radial-gradient(circle at 80% 40%, white 0, white 2px, transparent 2.5px), radial-gradient(circle at 40% 70%, white 0, white 2px, transparent 2.5px), radial-gradient(circle at 70% 85%, white 0, white 2px, transparent 2.5px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

function BurstParticles() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {BURST_OFFSETS.map(([tx, ty], i) => (
        <span
          key={i}
          className="carddraw-burst-particle absolute left-1/2 top-1/2 -ml-2.5 -mt-2.5 text-lg"
          style={
            {
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
              animationDelay: `${i * 35}ms`,
            } as CSSProperties
          }
        >
          {BURST_EMOJI[i]}
        </span>
      ))}
    </span>
  );
}
