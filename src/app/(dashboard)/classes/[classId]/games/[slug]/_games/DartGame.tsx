"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner, GAME_ACCENTS, candyButtonClass, GameStageBackdrop, CheerSquad } from "./RevealBanner";
import { IconChip } from "@/components/IconChip";
import type { PickerStudent } from "../../usePicker";

const accent = GAME_ACCENTS.mint;
// Pastel wedge colors cycle mint → lavender → peach, one per remaining student,
// so the board doubles as "how many are left" at a glance.
const WEDGE_COLORS = ["var(--color-mint)", "var(--color-lavender)", "var(--color-peach)"];
const START_POS = { x: -40, y: -40 };
const BOARD_CENTER = 128;
const LABEL_RADIUS = 100;
const DART_RADIUS = 90;

export function DartGame({ remaining, pick, isExhausted }: GameComponentProps) {
  const [throwing, setThrowing] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);
  const [dartPos, setDartPos] = useState<{ x: number; y: number } | null>(null);
  // Purely cosmetic: bumped on every throw so the flying dart's spin keyframe
  // (and the landing sparkle) remount and replay instead of being skipped by React.
  const [throwId, setThrowId] = useState(0);

  function handleThrow() {
    if (throwing || isExhausted) return;
    const result = pick();
    if (!result) return;
    const sliceAngle = 360 / result.poolSize;
    const angle = sliceAngle * result.index - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = DART_RADIUS;
    const target = { x: BOARD_CENTER + radius * Math.cos(rad), y: BOARD_CENTER + radius * Math.sin(rad) };

    setThrowId((id) => id + 1);
    setThrowing(true);
    setStudent(null);
    setDartPos(START_POS);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setDartPos(target));
    });
    setTimeout(() => {
      setThrowing(false);
      setStudent(result.student);
    }, 700);
  }

  const poolSize = remaining.length;
  const sliceAngle = poolSize > 0 ? 360 / poolSize : 360;
  const wedgeGradient =
    poolSize > 0
      ? `conic-gradient(from -90deg, ${remaining
          .map((_, i) => {
            const color = WEDGE_COLORS[i % WEDGE_COLORS.length];
            return `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
          })
          .join(", ")})`
      : "linear-gradient(145deg, var(--color-cloud), white)";

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-white to-(--color-cloud) p-6 shadow-[0_16px_40px_-16px_rgba(62,40,27,0.3),inset_0_2px_6px_rgba(255,255,255,0.5)] sm:p-8">
      <GameStageBackdrop accent={accent} />

      {/* Scoped to this file — every name/keyframe is prefixed "dartgame-" so it can
          never collide with another game's local <style> block. */}
      <style>{`
        @keyframes dartgame-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dartgame-ring-spin { animation: dartgame-ring-spin 24s linear infinite; }

        @keyframes dartgame-dart-flight {
          0% { transform: translate(-50%, -50%) scale(0.55) rotate(-35deg); }
          55% { transform: translate(-50%, -50%) scale(1.2) rotate(14deg); }
          80% { transform: translate(-50%, -50%) scale(0.92) rotate(-6deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        }
        .dartgame-dart {
          transition: left 0.62s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.62s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dartgame-dart-flying {
          animation: dartgame-dart-flight 0.62s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes dartgame-impact-burst {
          0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.4); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.4); }
        }
        .dartgame-impact { animation: dartgame-impact-burst 0.55s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .dartgame-ring-spin { animation: none; }
          .dartgame-dart { transition: none; }
          .dartgame-dart-flying,
          .dartgame-impact {
            animation-duration: 0.001ms;
            animation-iteration-count: 1;
          }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <IconChip icon="🐰" tint="peach" size="md" className="animate-float" />
          <p className="font-display rounded-full bg-white/85 px-4 py-1.5 text-center text-sm font-extrabold text-(--color-ink) shadow-[0_3px_10px_-3px_rgba(62,40,27,0.25)] sm:text-base">
            🎯 Ai sẽ trúng phi tiêu nào?
          </p>
          <IconChip icon="🐻" tint="lavender" size="md" className="animate-float [animation-delay:0.4s]" />
        </div>

        <div className="relative size-64">
          <div
            aria-hidden="true"
            className="dartgame-ring-spin absolute -inset-3 rounded-full border-4 border-dashed border-(--color-sun)/50"
          />
          <div
            className="relative size-64 overflow-hidden rounded-full border-[8px] border-white shadow-[0_14px_32px_-10px_rgba(62,40,27,0.4),inset_0_2px_4px_rgba(255,255,255,0.5)]"
            style={{ background: wedgeGradient }}
          >
            {remaining.map((s, i) => {
              const angle = sliceAngle * i - 90;
              const rad = (angle * Math.PI) / 180;
              const x = BOARD_CENTER + LABEL_RADIUS * Math.cos(rad);
              const y = BOARD_CENTER + LABEL_RADIUS * Math.sin(rad);
              return (
                <span
                  key={s.id}
                  className="absolute w-16 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/90 px-1 py-0.5 text-center text-[10px] font-extrabold leading-tight text-(--color-ink) shadow-sm"
                  style={{ left: x, top: y }}
                >
                  {s.fullName}
                </span>
              );
            })}

            {/* Bullseye: layered white / sun / mint-dark rings, like a classic dart target. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgba(62,40,27,0.35)]"
            >
              <div className="animate-glow absolute inset-[18%] rounded-full bg-(--color-sun) shadow-[inset_0_-2px_3px_rgba(0,0,0,0.2)]">
                <div className="absolute inset-[26%] rounded-full bg-(--color-mint-dark) shadow-[inset_0_-2px_3px_rgba(0,0,0,0.3),inset_0_2px_2px_rgba(255,255,255,0.4)]" />
              </div>
            </div>

            {dartPos && (
              <span
                key={throwId}
                className={`dartgame-dart absolute -translate-x-1/2 -translate-y-1/2 text-4xl drop-shadow-[0_3px_3px_rgba(62,40,27,0.4)] ${
                  throwing ? "dartgame-dart-flying" : ""
                }`}
                style={{ left: dartPos.x, top: dartPos.y }}
              >
                🎯
              </span>
            )}

            {!throwing && student && dartPos && (
              <span
                key={`impact-${throwId}`}
                aria-hidden="true"
                className="dartgame-impact absolute -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-(--color-sun)/60"
                style={{ left: dartPos.x, top: dartPos.y }}
              />
            )}
          </div>
        </div>

        {!throwing && !student && <CheerSquad seed={4} />}

        <button
          onClick={handleThrow}
          disabled={throwing || isExhausted}
          className={candyButtonClass(accent, throwing || isExhausted)}
        >
          <span className={`mr-1 inline-block ${!throwing && !isExhausted ? "animate-wiggle" : ""}`}>🎯</span>
          {throwing ? "Đang ném..." : "Ném phi tiêu!"}
        </button>

        {student && (
          <div className="relative flex w-full items-center justify-center gap-2">
            <IconChip icon="🐰" tint="peach" size="lg" className="animate-wiggle shrink-0" />
            <div className="min-w-0 flex-1">
              <RevealBanner student={student} />
            </div>
            <IconChip icon="🐻" tint="lavender" size="lg" className="animate-wiggle shrink-0 [animation-delay:0.15s]" />
          </div>
        )}
      </div>
    </div>
  );
}
