"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { GAME_ACCENTS, candyButtonClass, GameStageBackdrop } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";
import { IconChip } from "@/components/IconChip";

const accent = GAME_ACCENTS.peach;
const ROW_HEIGHT = 64;
const REPEAT = 4;

// Mascot pair flanking the reel — kept generic (no theme-specific wording) since
// this same component is reused under several flavored game entries.
const MASCOT_LEFT = "🐰";
const MASCOT_RIGHT = "🐻";

export function SlotReelGame({ remaining, pick, isExhausted }: GameComponentProps) {
  const [spinning, setSpinning] = useState(false);
  const [strip, setStrip] = useState<PickerStudent[]>(remaining);
  const [offset, setOffset] = useState(0);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleSpin() {
    if (spinning || isExhausted) return;
    const pool = remaining;
    const result = pick();
    if (!result) return;

    const filler: PickerStudent[] = [];
    for (let i = 0; i < REPEAT; i++) {
      filler.push(...pool);
    }
    filler.push(result.student);
    const finalIndex = filler.length - 1;

    setStrip(filler);
    setOffset(0);
    setStudent(null);
    setSpinning(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOffset(finalIndex * ROW_HEIGHT));
    });
    setTimeout(() => {
      setSpinning(false);
      setStudent(result.student);
    }, 1900);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)] sm:p-8">
      {/* Local, file-scoped keyframes — prefixed `slotreel-` so they can never
          collide with another game's inline <style> block. Only the mechanical
          "cabinet rumble" needs a custom keyframe; everything else reuses the
          shared float/wiggle/pop-in/twinkle/glow/shine utilities from globals.css. */}
      <style>{`
        @keyframes slotreel-cabinet-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-1.5px) rotate(-0.35deg); }
          75% { transform: translateX(1.5px) rotate(0.35deg); }
        }
        .slotreel-shake { animation: slotreel-cabinet-shake 0.16s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .slotreel-shake { animation: none; }
        }
      `}</style>

      <GameStageBackdrop accent={accent} />

      {/* sparing sparkle accents (sun = decoration only, never a fill) */}
      <span aria-hidden="true" className="animate-twinkle absolute left-6 top-5 text-xl text-(--color-sun)">
        ⭐
      </span>
      <span
        aria-hidden="true"
        className="animate-twinkle absolute right-7 top-9 text-base text-(--color-sun)"
        style={{ animationDelay: "0.5s" }}
      >
        ✨
      </span>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <IconChip
          icon="🎰"
          tint="peach"
          size="xl"
          className={spinning ? "animate-wiggle" : "animate-float"}
        />

        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <IconChip
            icon={MASCOT_LEFT}
            tint="mint"
            size="lg"
            className={`hidden shadow-[0_6px_14px_-4px_rgba(46,42,33,0.25)] sm:flex ${
              spinning ? "animate-wiggle" : "animate-float"
            }`}
          />

          {/* Slot cabinet */}
          <div
            className={`relative rounded-[1.75rem] border-[6px] border-white bg-gradient-to-b ${accent.gradient} p-3 shadow-[0_4px_0_rgba(0,0,0,0.12),0_16px_32px_-10px_rgba(21,128,61,0.45)] ${
              spinning ? "slotreel-shake" : ""
            }`}
          >
            {/* marquee bulbs */}
            <div aria-hidden="true" className="mb-2 flex items-center justify-center gap-2">
              <span className="animate-twinkle size-2 rounded-full bg-(--color-sun)" />
              <span className="animate-twinkle size-2 rounded-full bg-white" style={{ animationDelay: "0.2s" }} />
              <span className="animate-twinkle size-2 rounded-full bg-(--color-sun)" style={{ animationDelay: "0.4s" }} />
            </div>

            <div className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-xl text-(--color-sun-dark) drop-shadow-sm">
                ▶
              </span>

              <div
                className="relative w-56 overflow-hidden rounded-2xl border-4 border-(--color-ink)/10 bg-white shadow-[inset_0_3px_8px_rgba(46,42,33,0.25)] sm:w-64"
                style={{ height: ROW_HEIGHT }}
              >
                <div
                  style={{
                    transform: `translateY(-${offset}px)`,
                    transition: spinning ? "transform 1.8s cubic-bezier(0.12,0.7,0.2,1)" : "none",
                  }}
                >
                  {strip.map((s, i) => (
                    <div
                      key={`${s.id}-${i}`}
                      className="flex items-center justify-center bg-white px-2 text-center text-base font-extrabold leading-tight text-(--color-ink) sm:text-lg"
                      style={{ height: ROW_HEIGHT - 8, margin: "4px 5px" }}
                    >
                      {s.fullName}
                    </div>
                  ))}
                </div>

                {/* glass shine */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/45 via-transparent to-black/5"
                />

                {/* landing frame — the window shows exactly one row, so this simply
                    highlights that visible slot */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 rounded-2xl border-y-[3px] ${
                    spinning ? "border-(--color-sun-dark)/60" : "border-(--color-sun-dark)"
                  }`}
                />
              </div>

              <span aria-hidden="true" className="text-xl text-(--color-sun-dark) drop-shadow-sm">
                ◀
              </span>
            </div>
          </div>

          <span
            className={`hidden sm:inline-block ${spinning ? "animate-wiggle" : "animate-float"}`}
            style={{ animationDelay: "0.3s" }}
          >
            <IconChip
              icon={MASCOT_RIGHT}
              tint="lavender"
              size="lg"
              className="shadow-[0_6px_14px_-4px_rgba(46,42,33,0.25)]"
            />
          </span>
        </div>

        {!spinning && !student && (
          <p className="animate-pop-in rounded-full bg-white px-5 py-2.5 text-sm font-bold text-(--color-ink)/70 shadow-[0_4px_12px_-4px_rgba(46,42,33,0.2)]">
            {MASCOT_LEFT} Bấm quay để chọn một bạn nhé! {MASCOT_RIGHT}
          </p>
        )}

        <button
          onClick={handleSpin}
          disabled={spinning || isExhausted}
          className={`${candyButtonClass(accent, spinning || isExhausted)} group relative overflow-hidden text-lg`}
        >
          {!spinning && !isExhausted && (
            <span
              aria-hidden="true"
              className="animate-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30"
            />
          )}
          {spinning ? "🎰 Đang quay..." : "🎰 Quay số!"}
        </button>

        {student && !spinning && (
          <div
            aria-live="polite"
            className="animate-pop-in relative flex items-center gap-3 rounded-[1.5rem] bg-white px-6 py-4 text-center shadow-[0_10px_24px_-8px_rgba(46,42,33,0.3)]"
          >
            <span aria-hidden="true" className="animate-twinkle absolute -top-2 left-4 text-lg text-(--color-sun)">
              ✨
            </span>
            <span aria-hidden="true" className="animate-twinkle absolute -top-2 right-4 text-lg text-(--color-sun)" style={{ animationDelay: "0.4s" }}>
              🎊
            </span>
            <span aria-hidden="true" className="animate-wiggle text-3xl">
              {MASCOT_LEFT}
            </span>
            <p className="font-display text-lg font-extrabold text-(--color-ink) sm:text-xl">
              Đã gọi: <span className={accent.text}>{student.fullName}</span>
            </p>
            <span aria-hidden="true" className="animate-wiggle text-3xl" style={{ animationDelay: "0.2s" }}>
              {MASCOT_RIGHT}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
