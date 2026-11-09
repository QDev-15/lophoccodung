"use client";

import { useState } from "react";

import type { GameComponentProps } from "../GamePlayer";
import { RevealBanner, GAME_ACCENTS, candyButtonClass, GameStageBackdrop, CheerSquad } from "./RevealBanner";
import type { PickerStudent } from "../../usePicker";

const accent = GAME_ACCENTS.lavender;

export function TreasureChestGame({ pick, isExhausted }: GameComponentProps) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [student, setStudent] = useState<PickerStudent | null>(null);

  function handleOpen() {
    if (opening || isExhausted) return;
    const result = pick();
    if (!result) return;
    setOpening(true);
    setOpened(false);
    setStudent(null);
    setTimeout(() => {
      setOpening(false);
      setOpened(true);
      setStudent(result.student);
    }, 900);
  }

  function handleReset() {
    setOpened(false);
    setStudent(null);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)]">
      {/* Local, file-scoped keyframes for the chest's lid-flip / coin-pop flourish.
          Every name is prefixed `treasurechest-` so it can never collide with
          another game's local <style> block. */}
      <style>{`
        @keyframes treasurechest-lid-open {
          0% { transform: rotate(0deg) translate(0, 0); }
          65% { transform: rotate(-56deg) translate(-9px, -14px); }
          100% { transform: rotate(-46deg) translate(-7px, -11px); }
        }
        .treasurechest-lid-opened {
          animation: treasurechest-lid-open 0.5s var(--ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)) both;
        }
        @keyframes treasurechest-shadow-pulse {
          0%, 100% { transform: translateY(0) scaleX(1); opacity: 0.6; }
          50% { transform: translateY(2px) scaleX(0.94); opacity: 0.4; }
        }
        .treasurechest-shadow-pulse {
          animation: treasurechest-shadow-pulse 0.35s ease-in-out infinite;
        }
        @keyframes treasurechest-coin-pop {
          0% { opacity: 0; transform: translateY(8px) scale(0.3) rotate(-10deg); }
          60% { opacity: 1; transform: translateY(-10px) scale(1.2) rotate(8deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }
        .treasurechest-coin {
          animation: treasurechest-coin-pop 0.55s var(--ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)) both;
        }
        @keyframes treasurechest-ray-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .treasurechest-rays {
          animation: treasurechest-ray-spin 14s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .treasurechest-lid-opened,
          .treasurechest-shadow-pulse,
          .treasurechest-coin,
          .treasurechest-rays {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <GameStageBackdrop accent={accent} />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <TreasureChestVisual opening={opening} opened={opened} />

        {!opened && !opening && <CheerSquad seed={3} />}

        {!opened ? (
          <button onClick={handleOpen} disabled={opening || isExhausted} className={candyButtonClass(accent, opening || isExhausted)}>
            {opening ? "✨ Đang mở..." : "🔓 Mở rương!"}
          </button>
        ) : (
          <button onClick={handleReset} disabled={isExhausted} className={candyButtonClass(accent, isExhausted)}>
            🔁 Mở rương khác
          </button>
        )}

        <RevealBanner student={student} />
      </div>
    </div>
  );
}

/** The chest itself: a layered wood-and-gold SVG body with a lid that flips
 * open, plus a halo of light rays, floating coins and two cheering animal
 * mascots once a student has been revealed. Purely presentational — no game
 * state lives here. */
function TreasureChestVisual({ opening, opened }: { opening: boolean; opened: boolean }) {
  return (
    <div className="relative flex h-44 w-52 items-end justify-center">
      {opened && (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="treasurechest-rays pointer-events-none absolute left-1/2 top-[38%] size-56 -translate-x-1/2 -translate-y-1/2 opacity-50"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x="96" y="4" width="8" height="58" rx="4" fill="var(--color-sun)" transform={`rotate(${i * 45} 100 100)`} />
            ))}
          </svg>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[36%] size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-sun)/50 blur-2xl"
          />
        </>
      )}

      {/* ground shadow */}
      <div
        aria-hidden="true"
        className={`absolute bottom-2 h-5 w-32 rounded-full bg-(--color-ink)/15 blur-sm ${opening ? "treasurechest-shadow-pulse" : ""}`}
      />

      <div className={`relative size-36 ${opening ? "animate-chest-shake" : !opened ? "animate-float" : ""}`}>
        <ChestBody />
        <div className={`absolute inset-0 origin-[50%_54%] ${opened ? "treasurechest-lid-opened" : ""}`}>
          <ChestLid />
        </div>
      </div>

      {opened && (
        <>
          <span aria-hidden="true" className="treasurechest-coin absolute left-2 top-7 text-2xl">
            🪙
          </span>
          <span aria-hidden="true" className="treasurechest-coin absolute right-3 top-3 text-3xl" style={{ animationDelay: "0.08s" }}>
            💰
          </span>
          <span aria-hidden="true" className="treasurechest-coin absolute left-1/2 top-0 -translate-x-1/2 text-2xl" style={{ animationDelay: "0.16s" }}>
            ✨
          </span>
          <span aria-hidden="true" className="animate-wiggle absolute -left-9 bottom-3 text-4xl">
            🐰
          </span>
          <span aria-hidden="true" className="animate-float absolute -right-9 bottom-3 text-4xl" style={{ animationDelay: "0.3s" }}>
            🐻
          </span>
        </>
      )}
    </div>
  );
}

function ChestBody() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 130"
      className="absolute inset-0 size-full drop-shadow-[0_10px_16px_rgba(46,42,33,0.35)]"
    >
      <defs>
        <linearGradient id="treasurechest-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c88a4a" />
          <stop offset="100%" stopColor="#8a5a28" />
        </linearGradient>
        <linearGradient id="treasurechest-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sun)" />
          <stop offset="100%" stopColor="var(--color-sun-dark)" />
        </linearGradient>
      </defs>
      <rect x="6" y="112" width="18" height="12" rx="4" fill="#6b3f14" />
      <rect x="116" y="112" width="18" height="12" rx="4" fill="#6b3f14" />
      <rect x="10" y="58" width="120" height="62" rx="14" fill="url(#treasurechest-wood)" stroke="#6b3f14" strokeWidth="3" />
      <rect x="10" y="58" width="120" height="13" fill="url(#treasurechest-gold)" opacity="0.9" />
      <rect x="60" y="58" width="20" height="62" fill="url(#treasurechest-gold)" opacity="0.9" />
      <circle cx="70" cy="86" r="13" fill="url(#treasurechest-gold)" stroke="#92400e" strokeWidth="2" />
      <rect x="66" y="88" width="8" height="10" rx="2" fill="#6b3f14" />
      <circle cx="70" cy="86" r="4" fill="#6b3f14" />
    </svg>
  );
}

function ChestLid() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 130"
      className="absolute inset-0 size-full drop-shadow-[0_6px_10px_rgba(46,42,33,0.3)]"
    >
      <defs>
        <linearGradient id="treasurechest-lid-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3a968" />
          <stop offset="100%" stopColor="#b9792f" />
        </linearGradient>
      </defs>
      <path
        d="M8 70 C8 34 28 12 70 12 C112 12 132 34 132 70 L132 76 L8 76 Z"
        fill="url(#treasurechest-lid-wood)"
        stroke="#6b3f14"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M8 70 C8 34 28 12 70 12 C112 12 132 34 132 70" fill="none" stroke="#fde8c9" strokeWidth="3" opacity="0.5" />
      <rect x="60" y="12" width="20" height="64" fill="var(--color-sun)" opacity="0.85" />
      <circle cx="70" cy="68" r="8" fill="var(--color-sun)" stroke="#92400e" strokeWidth="2" />
    </svg>
  );
}
