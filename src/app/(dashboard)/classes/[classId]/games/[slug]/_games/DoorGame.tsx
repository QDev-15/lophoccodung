"use client";

import { useState, type CSSProperties } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { GAME_ACCENTS, candyButtonClass, GameStageBackdrop } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";
import { IconChip } from "@/components/IconChip";

// This component powers several differently-themed catalog entries ("Ô cửa bí
// ẩn", "Cá sấu lên bờ", "UFO", ...) via GamePlayer's GAME_COMPONENTS map, so
// everything here stays flavor-agnostic: a generic row of mystery doors, no
// theme-specific copy or art.
const accent = GAME_ACCENTS.lavender;
const DOOR_COUNT = 6;

// Doors are "several equal items" until one is opened, so each one cycles
// through the project's mint → lavender → peach rotation instead of a single
// flat color repeated six times.
const DOOR_ACCENTS = [GAME_ACCENTS.mint, GAME_ACCENTS.lavender, GAME_ACCENTS.peach];

// Two cute animal friends peeking out beside the doors — the same pair used on
// the card-draw picker game, so the whole random-picker catalog reads as one
// family.
const MASCOT_LEFT = "🐰";
const MASCOT_RIGHT = "🦊";

// Small radial confetti burst that plays inside whichever door was just opened.
const DOOR_BURST_OFFSETS: Array<[number, number]> = [
  [0, -32],
  [28, -12],
  [26, 20],
  [0, 34],
  [-26, 20],
  [-28, -12],
];
const DOOR_BURST_EMOJI = ["✨", "⭐", "🎊", "✨", "⭐", "🎊"];

export function DoorGame({ pick, isExhausted }: GameComponentProps) {
  const [openedDoor, setOpenedDoor] = useState<number | null>(null);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleDoorClick(i: number) {
    if (openedDoor !== null || isExhausted) return;
    const result = pick();
    if (!result) return;
    setOpenedDoor(i);
    setStudent(result.student);
  }

  function handleReset() {
    setOpenedDoor(null);
    setStudent(null);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)] sm:p-8">
      <GameStageBackdrop accent={accent} />
      <span aria-hidden="true" className="animate-twinkle absolute left-6 top-4 text-xl">
        ✨
      </span>
      <span aria-hidden="true" className="animate-twinkle absolute right-8 top-7 text-lg" style={{ animationDelay: "0.5s" }}>
        ⭐
      </span>

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 shadow-sm">
          <span className="text-lg">🔑</span>
          <span className="font-display text-xs font-extrabold uppercase tracking-wide text-(--color-lavender) sm:text-sm">
            Mở một trong {DOOR_COUNT} ô cửa
          </span>
        </div>

        <div className="relative flex w-full max-w-sm items-center justify-center py-1 [perspective:1400px]">
          <IconChip
            icon={MASCOT_LEFT}
            tint="peach"
            size="md"
            className={`absolute -left-1 bottom-0 z-0 shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)] sm:-left-3 ${
              openedDoor === null ? "animate-float" : "animate-wiggle"
            }`}
          />
          <span
            className={`absolute -right-1 bottom-0 z-0 inline-block sm:-right-3 ${
              openedDoor === null ? "animate-float" : "animate-wiggle"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            <IconChip
              icon={MASCOT_RIGHT}
              tint="lavender"
              size="md"
              className="shadow-[0_6px_14px_-4px_rgba(46,42,33,0.3)]"
            />
          </span>

          <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: DOOR_COUNT }).map((_, i) => {
              const isOpen = openedDoor === i;
              const locked = openedDoor !== null && !isOpen;
              const doorAccent = DOOR_ACCENTS[i % DOOR_ACCENTS.length];

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDoorClick(i)}
                  disabled={openedDoor !== null || isExhausted}
                  aria-label={isOpen && student ? `Cửa số ${i + 1}, đã mở: ${student.fullName}` : `Mở cửa số ${i + 1}`}
                  className={`relative h-32 w-24 [transform-style:preserve-3d] transition-transform duration-700 disabled:cursor-not-allowed sm:h-36 sm:w-28 ${
                    openedDoor === null && !isExhausted ? "cursor-pointer hover:-translate-y-1" : "cursor-default"
                  } ${locked ? "opacity-35" : ""}`}
                  style={{
                    transitionTimingFunction: "var(--ease-bounce)",
                    transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* front face: the closed door */}
                  <span
                    className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-t-[2.5rem] rounded-b-2xl border-[3px] border-white bg-gradient-to-b ${doorAccent.gradient} shadow-[0_5px_0_rgba(46,42,33,0.18),0_10px_20px_-8px_rgba(46,42,33,0.35)] [backface-visibility:hidden]`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold ${doorAccent.text} shadow-sm`}
                    >
                      {i + 1}
                    </span>
                    <span aria-hidden="true" className="absolute inset-x-3 top-3 h-9 rounded-xl border-2 border-white/35 sm:h-11" />
                    <span aria-hidden="true" className="absolute inset-x-3 bottom-3 h-11 rounded-xl border-2 border-white/35 sm:h-14" />
                    <span
                      aria-hidden="true"
                      className="absolute right-2.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-(--color-sun) shadow-[inset_-1px_-1px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.35)]"
                    />
                    {openedDoor === null && !isExhausted && (
                      <span
                        aria-hidden="true"
                        className="doorgame-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/25"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    )}
                    <span className="relative text-5xl drop-shadow-[0_3px_3px_rgba(46,42,33,0.25)]">🚪</span>
                  </span>

                  {/* back face: the room behind the door, revealed once opened */}
                  <span
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-t-[2.5rem] rounded-b-2xl border-[3px] border-white p-1.5 text-center shadow-[0_8px_16px_-6px_rgba(46,42,33,0.3)] [backface-visibility:hidden] ${doorAccent.bgLight}`}
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    {isOpen && student && (
                      <span className="relative flex flex-col items-center gap-1">
                        <DoorBurst />
                        <span className="animate-pop-in text-2xl">🎉</span>
                        <span
                          className={`animate-pop-in text-[11px] font-extrabold leading-tight ${doorAccent.text} sm:text-xs`}
                          style={{ animationDelay: "0.08s" }}
                        >
                          {student.fullName}
                        </span>
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {openedDoor !== null ? (
          <button
            onClick={handleReset}
            disabled={isExhausted}
            className={`${candyButtonClass(accent, isExhausted)} ${!isExhausted ? "animate-glow" : ""}`}
          >
            🔁 Mở lại các cửa
          </button>
        ) : (
          <p className="font-display text-sm font-bold text-(--color-ink)/60 sm:text-base">
            👉 Chọn một ô cửa để mở nhé!
          </p>
        )}
      </div>

      <style>{`
        @keyframes doorgame-shine {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .doorgame-shine { animation: doorgame-shine 1.1s ease-out; }
        @keyframes doorgame-burst {
          0% { transform: translate(0, 0) scale(0.2); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }
        .doorgame-burst-particle { animation: doorgame-burst 600ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .doorgame-shine { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
          .doorgame-burst-particle { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function DoorBurst() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {DOOR_BURST_OFFSETS.map(([tx, ty], i) => (
        <span
          key={i}
          className="doorgame-burst-particle absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 text-xs"
          style={
            {
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
              animationDelay: `${i * 35}ms`,
            } as CSSProperties
          }
        >
          {DOOR_BURST_EMOJI[i]}
        </span>
      ))}
    </span>
  );
}
