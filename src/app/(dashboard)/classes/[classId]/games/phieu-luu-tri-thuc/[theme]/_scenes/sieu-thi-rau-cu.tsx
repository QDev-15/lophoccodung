import { TINT_STYLES } from "@/lib/adventure-themes";
import type { AdventureTheme, TintStyle } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Siêu Thị Rau Củ 4.0" — a futuristic smart-supermarket aisle. A little
// robot rolls its cart down a row of veggie shelves, scanning + grabbing one
// basket per correct answer: passed shelves go empty with a ✓ (the item is
// now in the cart shown filling up above the aisle), the current shelf glows
// with a "pick me" halo while the robot grabs it, and upcoming shelves stay
// full and untouched. On "finished" the robot checks out at a sparkly
// register. No illustration assets exist in this codebase, so the robot is a
// small hand-rolled inline SVG; everything else is layered CSS/Tailwind.
const VEGGIES = ["🥦", "🥕", "🍅", "🌽", "🍆", "🫑", "🥬", "🧄", "🧅", "🥒"];

function veggieAt(i: number) {
  return VEGGIES[i % VEGGIES.length];
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const collected = total > 0 ? Math.min(finished ? total : index, total) : 0;
  const linePct = total > 0 ? Math.min(100, (index / total) * 100) : 0;

  return (
    <div className="relative overflow-x-auto rounded-3xl bg-gradient-to-b from-white to-(--color-mint-light)/35 px-5 pb-5 pt-4 shadow-[inset_0_2px_6px_rgba(46,42,33,0.06)]">
      {/* Futuristic backdrop: a soft diagonal shimmer sweep + a faint scanner-grid
          floor strip, built from background-position animation so it stays correct
          no matter how wide the aisle grows for long quizzes. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="scene-market-scan absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-[repeating-linear-gradient(90deg,var(--color-mint-dark)_0px,var(--color-mint-dark)_1.5px,transparent_1.5px,transparent_26px)] opacity-10" />
      </div>

      <CartStatus collected={collected} total={total} tint={tint} />

      <div className="relative mt-4 flex min-w-max items-end gap-3 px-1 pb-1">
        <div
          aria-hidden="true"
          className="absolute inset-x-1 bottom-6 h-2 overflow-hidden rounded-full bg-(--color-ink)/10"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tint.gradient} transition-[width] duration-500 ease-out`}
            style={{ width: `${finished ? 100 : linePct}%` }}
          />
        </div>

        {steps.map((_, i) => {
          const done = i < index || finished;
          const current = i === index && !finished;
          return <Stall key={i} n={i + 1} veggie={veggieAt(i)} done={done} current={current} tint={tint} />;
        })}

        <CheckoutStall finished={finished} tint={tint} theme={theme} />
      </div>

      <style>{`
        .scene-market-scan {
          background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.65) 50%, transparent 80%);
          background-size: 220% 100%;
          animation: scene-market-scan-move 4s linear infinite;
        }
        @keyframes scene-market-scan-move {
          0% { background-position: 160% 0; }
          100% { background-position: -60% 0; }
        }

        @keyframes scene-market-ping {
          0% { transform: scale(0.85); opacity: 0.55; }
          70%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .scene-market-ping {
          animation: scene-market-ping 1.6s cubic-bezier(.34, 1.56, .64, 1) infinite;
        }

        @keyframes scene-market-pick {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-8deg) scale(1.06); }
          55% { transform: rotate(6deg) scale(0.97); }
        }
        .scene-market-pick {
          animation: scene-market-pick 1.1s cubic-bezier(.34, 1.56, .64, 1) infinite;
        }

        @keyframes scene-market-cart-pop {
          0% { transform: scale(0.3) translateY(6px); opacity: 0; }
          70% { transform: scale(1.15) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .scene-market-cart-pop {
          animation: scene-market-cart-pop 0.4s cubic-bezier(.34, 1.56, .64, 1) both;
        }

        @keyframes scene-market-banner {
          0% { transform: translate(-50%, 8px) scale(0.7); opacity: 0; }
          60% { transform: translate(-50%, -3px) scale(1.08); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .scene-market-banner {
          animation: scene-market-banner 0.5s cubic-bezier(.34, 1.56, .64, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .scene-market-scan,
          .scene-market-ping,
          .scene-market-pick,
          .scene-market-cart-pop,
          .scene-market-banner {
            animation: none;
          }
          .scene-market-ping {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cart status chip — a running receipt of what's already in the robot's
// basket, so the "collect a basket per correct answer" idea reads clearly
// even before a child looks at the aisle below.
// ---------------------------------------------------------------------------

function CartStatus({ collected, total, tint }: { collected: number; total: number; tint: TintStyle }) {
  const shown = Math.min(collected, 6);
  const overflow = collected - shown;
  return (
    <div className="relative z-10 flex w-fit items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-[0_3px_10px_-3px_rgba(46,42,33,0.2)]">
      <span aria-hidden="true" className="text-lg">
        🛒
      </span>
      <div className="flex min-h-6 items-center -space-x-1.5">
        {shown === 0 ? (
          <span className="text-xs font-semibold text-(--color-ink)/40">Giỏ trống</span>
        ) : (
          Array.from({ length: shown }).map((_, k) => (
            <span
              key={k}
              className="scene-market-cart-pop flex size-6 items-center justify-center rounded-full bg-white text-sm shadow ring-1 ring-white"
              style={{ animationDelay: `${k * 0.05}s` }}
            >
              {veggieAt(k)}
            </span>
          ))
        )}
        {overflow > 0 && (
          <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-extrabold text-white ${tint.bg}`}>
            +{overflow}
          </span>
        )}
      </div>
      <span className={`text-xs font-extrabold ${tint.text}`}>
        {collected}/{total}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A single smart-shelf stall. Untouched = full shelf with its veggie. Current
// = glowing "pick me" halo with the robot cart parked in front, grabbing.
// Done = emptied shelf (bars only) with a stamped checkmark.
// ---------------------------------------------------------------------------

function Stall({
  n,
  veggie,
  done,
  current,
  tint,
}: {
  n: number;
  veggie: string;
  done: boolean;
  current: boolean;
  tint: TintStyle;
}) {
  return (
    <div className="relative z-10 flex shrink-0 flex-col items-center gap-1">
      {current && (
        <span
          aria-hidden="true"
          className="scene-market-banner absolute -top-8 left-1/2 whitespace-nowrap rounded-full bg-(--color-ink) px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md"
        >
          ✨ Chọn mình đi!
        </span>
      )}
      <div
        className={`relative flex items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
          current ? "size-20 -translate-y-1 scale-105 sm:size-24" : "size-14 sm:size-16"
        } ${
          done
            ? "border-(--color-ink)/10 bg-(--color-ink)/5 shadow-[inset_0_2px_4px_rgba(46,42,33,0.08)]"
            : current
              ? `${tint.bgLight} border-white shadow-[0_4px_14px_-4px_rgba(46,42,33,0.3)]`
              : "border-(--color-ink)/10 bg-white shadow-[0_2px_6px_-2px_rgba(46,42,33,0.18)]"
        }`}
      >
        {/* shelf canopy stripe */}
        <span
          aria-hidden="true"
          className={`absolute -top-1.5 left-1/2 h-1.5 w-[68%] -translate-x-1/2 rounded-full bg-gradient-to-r ${tint.gradient} ${
            done ? "opacity-30" : "opacity-90"
          }`}
        />

        {current && (
          <span
            aria-hidden="true"
            className="scene-market-ping absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: tint.shadowDark }}
          />
        )}

        {done ? (
          <>
            {/* empty shelf bars — the veggie moved out, into the cart above */}
            <span aria-hidden="true" className="absolute inset-x-2.5 top-[42%] h-0.5 rounded bg-(--color-ink)/10" />
            <span aria-hidden="true" className="absolute inset-x-2.5 top-[62%] h-0.5 rounded bg-(--color-ink)/10" />
            <span className="animate-pop-in flex size-6 items-center justify-center rounded-full bg-(--color-mint-dark) text-xs font-extrabold text-white shadow-sm sm:size-7">
              ✓
            </span>
          </>
        ) : current ? (
          <RobotCart className="scene-market-pick h-10 w-10 sm:h-12 sm:w-12" />
        ) : (
          <span className="text-2xl sm:text-3xl">{veggie}</span>
        )}
      </div>
      <span className="text-[10px] font-bold text-(--color-ink)/35">#{n}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkout register — the aisle's final stop. Idle it's just a tidy register
// icon; once "finished" it sparkles with a "Mua sắm thành công!" banner.
// ---------------------------------------------------------------------------

function CheckoutStall({ finished, tint, theme }: { finished: boolean; tint: TintStyle; theme: AdventureTheme }) {
  return (
    <div className="relative z-10 flex shrink-0 flex-col items-center gap-1">
      {finished && (
        <span
          aria-hidden="true"
          className={`scene-market-banner absolute -top-9 left-1/2 whitespace-nowrap rounded-full bg-gradient-to-r ${tint.gradient} px-3 py-1 text-[11px] font-extrabold text-white shadow-md`}
        >
          🎉 Mua sắm thành công!
        </span>
      )}
      <div
        className={`relative flex size-16 items-center justify-center rounded-2xl text-3xl shadow-[0_2px_6px_-2px_rgba(46,42,33,0.2)] sm:size-20 sm:text-4xl ${
          finished ? `${tint.bgLight} animate-glow` : "bg-white"
        }`}
      >
        {finished && (
          <span
            aria-hidden="true"
            className="scene-market-ping absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: tint.shadowDark }}
          />
        )}
        <span aria-hidden="true" className={finished ? "animate-pop-in" : ""}>
          {finished ? "🏪" : theme.finishIcon}
        </span>
        {finished && (
          <span aria-hidden="true" className="animate-twinkle absolute -right-1 -top-1 text-sm">
            ✨
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold text-(--color-ink)/35">Thu ngân</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hand-rolled robot + cart, standing in for the theme's mascot at the current
// shelf. Drawn flat/outlined to match the hand-rolled art style already used
// elsewhere in the codebase (e.g. the Ô Ăn Quan hut/basket SVGs).
// ---------------------------------------------------------------------------

function RobotCart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" className={`${className} text-(--color-mint-dark)`} role="presentation" aria-hidden="true">
      {/* cart handle + basket */}
      <path d="M3 17 H13 L19 39 H45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 21 H43 L40 37 H22 Z" fill="white" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="23" y1="21" x2="20.5" y2="37" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <line x1="31" y1="21" x2="30.5" y2="37" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <line x1="39" y1="21" x2="40" y2="37" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <circle cx="23" cy="43" r="3.2" fill="currentColor" />
      <circle cx="39" cy="43" r="3.2" fill="currentColor" />

      {/* robot pushing from behind */}
      <rect x="39" y="9" width="21" height="18" rx="6" fill="white" stroke="currentColor" strokeWidth="3" />
      <circle cx="46" cy="18" r="2.3" fill="currentColor" />
      <circle cx="54" cy="18" r="2.3" fill="currentColor" />
      <path d="M46 23 Q50 26 54 23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="49.5" y1="9" x2="49.5" y2="3.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="49.5" cy="3" r="2.6" fill="var(--color-sun)" stroke="currentColor" strokeWidth="1.4" />
      <rect x="35" y="19" width="7" height="9" rx="3" fill="white" stroke="currentColor" strokeWidth="2.3" />
    </svg>
  );
}
