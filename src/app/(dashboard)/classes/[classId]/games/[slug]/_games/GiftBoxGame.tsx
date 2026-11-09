"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner, GAME_ACCENTS, ghostButtonClass, GameStageBackdrop, CheerSquad, type AccentKey } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";
import { IconChip } from "@/components/IconChip";

const accent = GAME_ACCENTS.lavender;
const BOX_COUNT = 6;

// Flavor-agnostic gift boxes — this component is reused under several themed
// catalog entries ("Hộp quà", "Cây cầu sinh tồn", ...), so the box art here
// stays generic rather than tied to one theme's name. Boxes cycle through the
// mint → lavender → peach accent rotation since they're "several equal items."
const BOX_ACCENT_ORDER: AccentKey[] = ["mint", "lavender", "peach"];

export function GiftBoxGame({ pick, isExhausted }: GameComponentProps) {
  const [openedBox, setOpenedBox] = useState<number | null>(null);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleBoxClick(boxIndex: number) {
    if (openedBox !== null || isExhausted) return;
    const result = pick();
    if (!result) return;
    setOpenedBox(boxIndex);
    setStudent(result.student);
  }

  function handleReset() {
    setOpenedBox(null);
    setStudent(null);
  }

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
        {openedBox === null && (
          <span className="animate-pop-in inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-(--color-ink)/75 shadow-[0_3px_10px_-3px_rgba(46,42,33,0.25)]">
            🎁 Có một bạn đang trốn trong hộp quà... chọn thử nhé!
          </span>
        )}

        <div className="grid grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: BOX_COUNT }).map((_, i) => {
            const isOpen = openedBox === i;
            const locked = openedBox !== null && !isOpen;
            const boxAccent = GAME_ACCENTS[BOX_ACCENT_ORDER[i % BOX_ACCENT_ORDER.length]];
            const state: "open" | "locked" | "disabled" | "idle" = isOpen
              ? "open"
              : locked
                ? "locked"
                : isExhausted
                  ? "disabled"
                  : "idle";

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleBoxClick(i)}
                disabled={openedBox !== null || isExhausted}
                aria-label={isOpen ? `Hộp quà số ${i + 1} đã mở` : `Mở hộp quà số ${i + 1}`}
                style={state === "idle" ? { animationDelay: `${i * 0.18}s` } : undefined}
                className={`relative flex h-24 w-24 flex-col items-center justify-center rounded-3xl text-center transition-transform duration-200 disabled:cursor-not-allowed sm:h-28 sm:w-28 ${
                  state === "open"
                    ? `giftbox-burst border-4 ${boxAccent.border} ${boxAccent.bgLight}`
                    : state === "locked"
                      ? "border-4 border-(--color-ink)/10 bg-white opacity-30"
                      : state === "disabled"
                        ? `${boxAccent.candy} opacity-40`
                        : `giftbox-idle ${boxAccent.candy}`
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xl drop-shadow-sm sm:text-2xl ${
                    state === "open" ? "giftbox-bow" : ""
                  }`}
                >
                  🎀
                </span>

                {state === "open" ? (
                  <>
                    <span aria-hidden="true" className="animate-twinkle absolute -right-1 -top-1 text-base">
                      ✨
                    </span>
                    <span className="text-4xl sm:text-5xl">🎉</span>
                    <span className={`mt-0.5 px-1 text-[10px] font-extrabold uppercase tracking-wide sm:text-[11px] ${boxAccent.text}`}>
                      Trúng rồi!
                    </span>
                  </>
                ) : (
                  <span className="text-5xl drop-shadow-[0_3px_3px_rgba(46,42,33,0.3)] sm:text-6xl">🎁</span>
                )}
              </button>
            );
          })}
        </div>

        {openedBox !== null && student ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <IconChip icon="🐰" tint="mint" size="lg" className="animate-wiggle shrink-0 shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)]" />
              <RevealBanner student={student} />
              <div className="animate-wiggle shrink-0" style={{ animationDelay: "0.2s" }}>
                <IconChip icon="🐻" tint="peach" size="lg" className="shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)]" />
              </div>
            </div>
            <button onClick={handleReset} disabled={isExhausted} className={ghostButtonClass()}>
              🔁 Chơi tiếp
            </button>
          </div>
        ) : (
          <CheerSquad seed={1} />
        )}
      </div>

      <style>{`
        @keyframes giftbox-idle-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(-1.5deg); }
        }
        .giftbox-idle { animation: giftbox-idle-bob 2.8s ease-in-out infinite; }

        @keyframes giftbox-burst {
          0% { transform: scale(0.7) rotate(-8deg); opacity: 0.4; }
          55% { transform: scale(1.16) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .giftbox-burst { animation: giftbox-burst 0.5s cubic-bezier(.34,1.56,.64,1) both; }

        @keyframes giftbox-bow-pop {
          0% { opacity: 0; transform: translateX(-50%) scale(0.4) translateY(4px); }
          60% { opacity: 1; transform: translateX(-50%) scale(1.3) translateY(-3px); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
        .giftbox-bow { animation: giftbox-bow-pop 0.45s cubic-bezier(.34,1.56,.64,1) both; }

        @media (prefers-reduced-motion: reduce) {
          .giftbox-idle,
          .giftbox-burst,
          .giftbox-bow {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
