import { TINT_STYLES, type TintStyle, type AdventureTheme } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// "Anh Hùng Vượt Ải" — a row of shield-shaped stone gates the class's little
// superhero dashes through, one per correct answer. Locked gates stand plain
// and closed, the current gate glows and the hero is mid-dash (cape flowing)
// through its opening, passed gates are stamped with a shield badge, and the
// final golden gate bursts open into a crowning + confetti celebration.

const CONFETTI: Array<{ left: string; delay: string; icon: string }> = [
  { left: "6%", delay: "0s", icon: "🎉" },
  { left: "22%", delay: "0.35s", icon: "✨" },
  { left: "40%", delay: "0.1s", icon: "🎊" },
  { left: "58%", delay: "0.5s", icon: "✨" },
  { left: "76%", delay: "0.2s", icon: "🎉" },
  { left: "90%", delay: "0.45s", icon: "🎊" },
];

const CROWD = ["👏", "🙌", "🎉", "🙌", "👏"];

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const gates = Array.from({ length: total });
  const linePct = total > 0 ? Math.min(100, (index / total) * 100) : 0;

  return (
    <div className="relative overflow-x-auto rounded-3xl bg-gradient-to-b from-(--color-mint-light)/35 via-white to-(--color-cloud) px-5 py-7 shadow-[inset_0_2px_6px_rgba(46,42,33,0.08)]">
      <style>{`
        @keyframes scene-hero-dash { 0% { transform: translateX(-3px) translateY(0) rotate(-3deg); } 50% { transform: translateX(3px) translateY(-4px) rotate(3deg); } 100% { transform: translateX(-3px) translateY(0) rotate(-3deg); } }
        @keyframes scene-hero-cape-flap { 0% { transform: rotate(-6deg) scaleX(1); } 50% { transform: rotate(10deg) scaleX(1.18); } 100% { transform: rotate(-6deg) scaleX(1); } }
        @keyframes scene-hero-glow-pulse { 0%, 100% { opacity: .35; transform: scale(1); } 50% { opacity: .65; transform: scale(1.18); } }
        @keyframes scene-hero-seal-pop { 0% { transform: scale(0) rotate(-20deg); opacity: 0; } 60% { transform: scale(1.2) rotate(6deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes scene-hero-gate-pop { 0% { transform: scale(.85); } 60% { transform: scale(1.06); } 100% { transform: scale(1); } }
        @keyframes scene-hero-crown-pop { 0% { transform: translateY(10px) scale(.6); opacity: 0; } 70% { transform: translateY(-4px) scale(1.1); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes scene-hero-confetti-fall { 0% { transform: translateY(-10%) rotate(0deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateY(260%) rotate(360deg); opacity: 0; } }
        @keyframes scene-hero-crowd-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes scene-hero-ray-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .scene-hero-dash { animation: scene-hero-dash 700ms ease-in-out infinite; }
        .scene-hero-cape { animation: scene-hero-cape-flap 650ms ease-in-out infinite; }
        .scene-hero-glow-pulse { animation: scene-hero-glow-pulse 1.6s ease-in-out infinite; }
        .scene-hero-seal-pop { animation: scene-hero-seal-pop 420ms cubic-bezier(.34,1.56,.64,1) both; }
        .scene-hero-gate-pop { animation: scene-hero-gate-pop 380ms cubic-bezier(.34,1.56,.64,1) both; }
        .scene-hero-crown-pop { animation: scene-hero-crown-pop 480ms cubic-bezier(.34,1.56,.64,1) both; }
        .scene-hero-confetti-fall { animation: scene-hero-confetti-fall 2.1s linear infinite; }
        .scene-hero-crowd-bounce { animation: scene-hero-crowd-bounce 600ms ease-in-out infinite; }
        .scene-hero-ray-spin { animation: scene-hero-ray-spin 9s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .scene-hero-dash,
          .scene-hero-cape,
          .scene-hero-glow-pulse,
          .scene-hero-seal-pop,
          .scene-hero-gate-pop,
          .scene-hero-crown-pop,
          .scene-hero-confetti-fall,
          .scene-hero-crowd-bounce,
          .scene-hero-ray-spin {
            animation: none !important;
          }
        }
      `}</style>

      {/* festive bunting strip across the top of the courtyard */}
      <div aria-hidden="true" className="relative z-10 mb-1 flex min-w-max items-start gap-3 px-2 opacity-80">
        {Array.from({ length: Math.max(total + 1, 4) }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3.5 shrink-0 ${i % 2 === 0 ? tint.bg : "bg-(--color-sun)"}`}
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-w-max items-stretch gap-3 px-2 pt-6">
        {/* stone path with tinted progress fill, running beneath the gates */}
        <div
          aria-hidden="true"
          className="absolute left-4 right-4 bottom-5 h-2 overflow-hidden rounded-full bg-(--color-ink)/10 sm:bottom-6"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tint.gradient} transition-[width] duration-500 ease-out`}
            style={{ width: `${finished ? 100 : linePct}%` }}
          />
        </div>

        {gates.map((_, i) => {
          const status = i < index ? "passed" : i === index && !finished ? "current" : "locked";
          return <Gate key={i} i={i} status={status} theme={theme} tint={tint} />;
        })}

        <FinishGate finished={finished} theme={theme} tint={tint} />
      </div>
    </div>
  );
}

function Gate({
  i,
  status,
  theme,
  tint,
}: {
  i: number;
  status: "locked" | "current" | "passed";
  theme: AdventureTheme;
  tint: TintStyle;
}) {
  const locked = status === "locked";
  const current = status === "current";
  const passed = status === "passed";
  const gradId = `ahva-stone-${i}`;

  return (
    <div className="relative z-10 flex h-36 w-24 shrink-0 flex-col items-center justify-end pb-5 sm:h-44 sm:w-28 sm:pb-6">
      {current && (
        <span
          aria-hidden="true"
          className="scene-hero-glow-pulse absolute bottom-7 left-1/2 size-20 -translate-x-1/2 rounded-full blur-xl sm:bottom-8 sm:size-24"
          style={{ background: tint.shadowDark }}
        />
      )}

      <div
        className={`relative ${current ? "scene-hero-gate-pop" : ""}`}
        style={{ width: current ? "92%" : "80%", transformOrigin: "bottom center" }}
      >
        <div
          aria-hidden="true"
          className={`absolute left-[20%] right-[20%] top-[16%] bottom-[10%] rounded-t-[50%] rounded-b-[32%] transition-colors duration-300 ${
            locked ? "bg-(--color-ink)/15" : passed ? tint.bgLight : `bg-gradient-to-b ${tint.gradient}`
          }`}
        />

        <svg viewBox="0 0 100 124" className="relative block w-full drop-shadow-[0_6px_10px_rgba(62,40,27,0.25)]" role="presentation" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e4ddcd" />
              <stop offset="1" stopColor="#8c8372" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            d="M50 6 C74 6 90 16 90 16 L90 54 C90 88 72 108 50 118 C28 108 10 88 10 54 L10 16 C10 16 26 6 50 6 Z M50 24 C64 24 74 32 74 46 L74 84 C74 96 64 104 50 108 C36 104 26 96 26 84 L26 46 C26 32 36 24 50 24 Z"
            fill={`url(#${gradId})`}
            stroke="#6b6457"
            strokeWidth="2.5"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pb-2">
          {locked && (
            <span className="text-2xl opacity-45 sm:text-3xl" role="img" aria-label="Cửa ải chưa mở">
              🔒
            </span>
          )}
          {passed && (
            <span className="scene-hero-seal-pop text-2xl drop-shadow-[0_2px_2px_rgba(62,40,27,0.3)] sm:text-3xl" role="img" aria-label="Đã vượt ải">
              {theme.stepIcon}
            </span>
          )}
          {current && <HeroRunner mascot={theme.mascot} tint={tint} />}
        </div>

        {passed && (
          <span
            className="scene-hero-seal-pop absolute -top-1 -right-1 text-base drop-shadow-sm sm:text-lg"
            role="img"
            aria-label="Huy hiệu hoàn thành"
          >
            ⭐
          </span>
        )}
      </div>

      <span className="absolute bottom-0 flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-(--color-ink)/60 shadow-sm sm:size-6 sm:text-xs">
        {i + 1}
      </span>
    </div>
  );
}

function HeroRunner({ mascot, tint, size = "normal" }: { mascot: string; tint: TintStyle; size?: "normal" | "big" }) {
  const big = size === "big";
  return (
    <div className={`scene-hero-dash relative flex items-center justify-center ${big ? "text-6xl sm:text-7xl" : "text-4xl sm:text-5xl"}`}>
      <svg
        viewBox="0 0 60 60"
        role="presentation"
        aria-hidden="true"
        className={`scene-hero-cape absolute ${big ? "-left-6 h-16 w-14 sm:h-20 sm:w-16" : "-left-3 h-10 w-9 sm:h-12 sm:w-10"}`}
        style={{ transformOrigin: "80% 15%" }}
      >
        <path d="M40 4 C20 8 4 22 6 46 C14 36 26 30 40 34 C34 24 34 14 40 4 Z" fill={tint.shadowDark} opacity="0.85" />
      </svg>
      <span className="relative drop-shadow-[0_3px_4px_rgba(62,40,27,0.3)]" role="img" aria-label="Siêu nhân đang chạy">
        {mascot}
      </span>
      <span aria-hidden="true" className="absolute -left-2 top-[45%] h-0.5 w-3 -translate-y-1/2 rounded-full bg-white/70 sm:-left-3 sm:w-4" />
      <span aria-hidden="true" className="absolute -left-1 top-[62%] h-0.5 w-2 -translate-y-1/2 rounded-full bg-white/50" />
    </div>
  );
}

function FinishGate({ finished, theme, tint }: { finished: boolean; theme: AdventureTheme; tint: TintStyle }) {
  return (
    <div className="relative z-10 flex h-40 w-32 shrink-0 flex-col items-center justify-end pb-5 sm:h-48 sm:w-40 sm:pb-6">
      {finished && (
        <>
          <span
            aria-hidden="true"
            className="scene-hero-ray-spin absolute bottom-10 left-1/2 size-28 -translate-x-1/2 rounded-full opacity-40 sm:bottom-12 sm:size-32"
            style={{
              background:
                "conic-gradient(from 0deg, var(--color-sun), transparent, var(--color-sun), transparent, var(--color-sun))",
            }}
          />
          {CONFETTI.map((c, idx) => (
            <span
              key={idx}
              aria-hidden="true"
              className="scene-hero-confetti-fall absolute text-base sm:text-lg"
              style={{ left: c.left, top: "-6%", animationDelay: c.delay }}
            >
              {c.icon}
            </span>
          ))}
        </>
      )}

      <div className="relative" style={{ width: finished ? "100%" : "88%", transformOrigin: "bottom center" }}>
        <div
          aria-hidden="true"
          className={`absolute left-[16%] right-[16%] top-[14%] bottom-[8%] rounded-t-[50%] rounded-b-[30%] transition-colors duration-500 ${
            finished ? "bg-gradient-to-b from-(--color-sun) to-(--color-sun-dark)" : "bg-(--color-ink)/10"
          }`}
        />
        <svg viewBox="0 0 100 124" className="relative block w-full drop-shadow-[0_8px_14px_rgba(62,40,27,0.3)]" role="presentation" aria-hidden="true">
          <defs>
            <linearGradient id="ahva-finish-frame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={finished ? "#fde68a" : "#e4ddcd"} />
              <stop offset="1" stopColor={finished ? "var(--color-sun-dark)" : "#8c8372"} />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            d="M50 4 C78 4 94 15 94 15 L94 56 C94 92 74 112 50 122 C26 112 6 92 6 56 L6 15 C6 15 22 4 50 4 Z M50 23 C65 23 76 32 76 47 L76 86 C76 99 65 107 50 111 C35 107 24 99 24 86 L24 47 C24 32 35 23 50 23 Z"
            fill="url(#ahva-finish-frame)"
            stroke={finished ? "var(--color-sun-dark)" : "#6b6457"}
            strokeWidth="3"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pb-2">
          {finished ? (
            <div className="scene-hero-crown-pop relative flex flex-col items-center">
              <span className="absolute -top-7 text-3xl drop-shadow-[0_2px_2px_rgba(62,40,27,0.35)] sm:-top-8 sm:text-4xl" role="img" aria-label="Vương miện">
                {theme.finishIcon}
              </span>
              <HeroRunner mascot={theme.mascot} tint={tint} size="big" />
            </div>
          ) : (
            <span className="text-3xl opacity-45 sm:text-4xl" role="img" aria-label="Cửa ải cuối">
              {theme.finishIcon}
            </span>
          )}
        </div>
      </div>

      {finished && (
        <div
          aria-hidden="true"
          className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-1.5 text-lg sm:gap-2 sm:text-xl"
        >
          {CROWD.map((e, idx) => (
            <span key={idx} className="scene-hero-crowd-bounce inline-block" style={{ animationDelay: `${idx * 0.12}s` }}>
              {e}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
