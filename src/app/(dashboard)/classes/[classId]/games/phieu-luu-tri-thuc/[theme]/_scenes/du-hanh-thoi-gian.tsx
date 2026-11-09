import { TINT_STYLES, type TintStyle } from "@/lib/adventure-themes";

import type { AdventureSceneProps } from "./types";

// Bespoke scene for "Du Hành Thời Gian" (Time Travel): a row of clock-portals
// linked by a trail of tiny gears/hourglasses. The current portal swirls open
// mid-jump, passed portals show a frozen, stamped clock face, upcoming ones
// are faint & dormant, and the finish line is a swirling starfield the
// traveler lands in.

// Deterministic "stopped at a random time" hand angles so frozen clock faces
// don't all look identical, without re-randomizing on every render.
function handAngle(seed: number, offset: number) {
  return (seed * 53 + offset) % 360;
}

function ClockHands({ seed, spin, tint }: { seed: number; spin: boolean; tint: TintStyle }) {
  const hourAngle = handAngle(seed, 15);
  const minuteAngle = handAngle(seed, 140);
  return (
    <span className={`absolute inset-[3px] ${spin ? "scene-time-spin-fast" : ""}`} aria-hidden="true">
      <span
        className="absolute left-1/2 h-[2px] w-[26%] origin-left rounded-full bg-(--color-ink)/50"
        style={{ top: "calc(50% - 1px)", transform: `rotate(${hourAngle}deg)` }}
      />
      <span
        className="absolute left-1/2 h-[2px] w-[36%] origin-left rounded-full"
        style={{ top: "calc(50% - 1px)", transform: `rotate(${minuteAngle}deg)`, backgroundColor: tint.shadowDark }}
      />
    </span>
  );
}

function PortalNode({
  i,
  state,
  tint,
  stepIcon,
}: {
  i: number;
  state: "current" | "done" | "dormant";
  tint: TintStyle;
  stepIcon: string;
}) {
  const current = state === "current";
  const done = state === "done";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
        current ? "size-16 sm:size-20" : "size-11 sm:size-12"
      }`}
    >
      {current && (
        <span
          aria-hidden="true"
          className="scene-time-glow absolute inset-[-6px] rounded-full"
          style={{ boxShadow: `0 0 0 4px ${tint.shadowDark}33, 0 0 22px 6px ${tint.shadowDark}55` }}
        />
      )}

      {(current || done) && (
        <span
          className={`absolute inset-0 overflow-hidden rounded-full border-2 shadow-[0_3px_8px_-2px_rgba(46,42,33,0.25)] ${
            current ? `border-transparent ring-2 ${tint.ring}` : "border-transparent"
          }`}
        >
          <span
            className={`absolute inset-0 bg-gradient-to-br ${tint.gradient} ${
              current ? "scene-time-spin opacity-90" : "opacity-35 grayscale"
            }`}
          />
          {current && (
            <span
              aria-hidden="true"
              className="scene-time-spin-rev absolute inset-0 bg-gradient-to-tl from-white/60 via-transparent to-transparent"
            />
          )}
          <span className="absolute inset-[3px] rounded-full bg-white/85" />
          <ClockHands seed={i} spin={current} tint={tint} />
        </span>
      )}

      {state === "dormant" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-dashed border-(--color-ink)/15 bg-white/50"
        />
      )}

      <span className="relative z-10 flex items-center justify-center text-xl sm:text-2xl">
        {current ? (
          <span className="scene-time-jump inline-block drop-shadow-sm" aria-hidden="true">
            🧒
          </span>
        ) : done ? (
          <span
            aria-hidden="true"
            className="scene-time-pop flex size-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-sm sm:size-8"
            style={{ backgroundColor: tint.shadowDark }}
          >
            ✓
          </span>
        ) : (
          <span aria-hidden="true" className="text-base opacity-40 sm:text-lg">
            {stepIcon}
          </span>
        )}
      </span>
    </div>
  );
}

function Connector({ traveled, tint, flip }: { traveled: boolean; tint: TintStyle; flip: boolean }) {
  return (
    <span aria-hidden="true" className="relative mx-1 flex h-5 w-5 shrink-0 items-center justify-center sm:mx-2">
      {flip ? (
        <span className={`text-sm transition-opacity ${traveled ? "opacity-70" : "opacity-20"}`}>⌛</span>
      ) : (
        <span
          className={`block size-3 rounded-full border-2 border-dashed transition-opacity ${
            traveled ? "scene-time-spin opacity-90" : "opacity-25"
          }`}
          style={{ borderColor: traveled ? tint.shadowDark : "var(--color-ink)" }}
        />
      )}
    </span>
  );
}

export function Scene({ theme, index, total, finished }: AdventureSceneProps) {
  const tint = TINT_STYLES[theme.tint];
  const steps = Array.from({ length: total });
  const linePct = total > 0 ? Math.min(100, (index / total) * 100) : 0;

  return (
    <div className="relative overflow-x-auto rounded-3xl bg-white/70 px-5 py-6 shadow-[inset_0_2px_6px_rgba(46,42,33,0.06)]">
      <style>{`
        @keyframes scene-time-spin { to { transform: rotate(360deg); } }
        @keyframes scene-time-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes scene-time-glow-pulse {
          0%, 100% { opacity: .55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes scene-time-jump {
          0% { transform: translateY(6px) rotate(-8deg) scale(.92); }
          50% { transform: translateY(-8px) rotate(6deg) scale(1.06); }
          100% { transform: translateY(6px) rotate(-8deg) scale(.92); }
        }
        @keyframes scene-time-sparkle {
          0%, 100% { opacity: .2; transform: scale(.6); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes scene-time-orbit { to { transform: rotate(360deg); } }
        @keyframes scene-time-pop {
          0% { transform: scale(.4) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(-10deg); opacity: 1; }
        }
        .scene-time-spin { animation: scene-time-spin 7s linear infinite; }
        .scene-time-spin-rev { animation: scene-time-spin-rev 9s linear infinite; }
        .scene-time-spin-fast { animation: scene-time-spin 2.2s linear infinite; }
        .scene-time-glow { animation: scene-time-glow-pulse 1.8s ease-in-out infinite; }
        .scene-time-jump { animation: scene-time-jump 1.3s cubic-bezier(.34,1.56,.64,1) infinite; }
        .scene-time-sparkle { animation: scene-time-sparkle 1.6s ease-in-out infinite; }
        .scene-time-orbit { animation: scene-time-orbit 11s linear infinite; }
        .scene-time-pop { animation: scene-time-pop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .scene-time-spin, .scene-time-spin-rev, .scene-time-spin-fast,
          .scene-time-glow, .scene-time-jump, .scene-time-sparkle,
          .scene-time-orbit, .scene-time-pop {
            animation: none !important;
          }
        }
      `}</style>

      {/* faint cosmic dust backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.35) 1px, transparent 1.4px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative flex min-w-max items-center gap-0 px-2">
        {/* time-stream track */}
        <div
          aria-hidden="true"
          className="absolute left-2 right-2 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-(--color-ink)/10"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tint.gradient} transition-[width] duration-500 ease-out`}
            style={{ width: `${finished ? 100 : linePct}%` }}
          />
        </div>

        {steps.map((_, i) => {
          const done = i < index;
          const current = i === index && !finished;
          const state = current ? "current" : done ? "done" : "dormant";
          return (
            <div key={i} className="relative z-10 flex shrink-0 items-center">
              <PortalNode i={i} state={state} tint={tint} stepIcon={theme.stepIcon} />
              {i < total - 1 && <Connector traveled={i < index} tint={tint} flip={i % 2 === 1} />}
            </div>
          );
        })}

        {/* galaxy finale */}
        <span className="relative z-10 ml-2 flex shrink-0 items-center justify-center">
          <span
            className={`relative flex items-center justify-center rounded-full shadow-[0_3px_10px_-2px_rgba(46,42,33,0.3)] transition-all duration-300 ${
              finished ? "size-16 sm:size-20" : "size-14 sm:size-16"
            }`}
          >
            {finished && (
              <>
                <span
                  aria-hidden="true"
                  className="scene-time-glow absolute inset-[-8px] rounded-full"
                  style={{ boxShadow: `0 0 0 5px ${tint.shadowDark}33, 0 0 28px 8px ${tint.shadowDark}66` }}
                />
                <span aria-hidden="true" className="scene-time-orbit absolute inset-[-16px]">
                  <span className="scene-time-sparkle absolute left-0 top-1/2 text-xs">✦</span>
                  <span className="scene-time-sparkle absolute right-0 top-1/2 text-xs" style={{ animationDelay: ".4s" }}>
                    ✦
                  </span>
                  <span className="scene-time-sparkle absolute left-1/2 top-0 text-xs" style={{ animationDelay: ".8s" }}>
                    ✧
                  </span>
                  <span className="scene-time-sparkle absolute bottom-0 left-1/2 text-xs" style={{ animationDelay: "1.2s" }}>
                    ✧
                  </span>
                </span>
              </>
            )}
            <span
              aria-hidden="true"
              className={`absolute inset-0 overflow-hidden rounded-full border-2 ${
                finished ? "border-transparent" : "border-dashed border-(--color-ink)/15"
              }`}
            >
              <span className={`absolute inset-0 bg-gradient-to-br ${tint.gradient} ${finished ? "opacity-95" : "opacity-15"}`} />
              {finished && (
                <span className="scene-time-spin-rev absolute inset-0 bg-gradient-to-tl from-white/50 via-transparent to-transparent" />
              )}
              {finished && (
                <>
                  <span className="scene-time-sparkle absolute left-[30%] top-[35%] size-[3px] rounded-full bg-white" />
                  <span
                    className="scene-time-sparkle absolute left-[65%] top-[55%] size-[2px] rounded-full bg-white"
                    style={{ animationDelay: ".5s" }}
                  />
                  <span
                    className="scene-time-sparkle absolute left-[50%] top-[25%] size-[2px] rounded-full bg-white"
                    style={{ animationDelay: "1s" }}
                  />
                </>
              )}
            </span>
            <span className="relative z-10 text-2xl sm:text-3xl">
              <span className={finished ? "scene-time-pop inline-block" : "inline-block opacity-50"} aria-hidden="true">
                {theme.finishIcon}
              </span>
            </span>
            {finished && (
              <span
                aria-hidden="true"
                className="scene-time-jump absolute -bottom-1 -right-1 z-20 text-base drop-shadow sm:text-lg"
              >
                🧒
              </span>
            )}
          </span>
        </span>
      </div>

      <span className="sr-only" role="status">
        {finished
          ? `Nhà du hành đã đến thiên hà cuối cùng`
          : `Đang ở mốc thời gian ${index + 1} trên ${total}`}
      </span>
    </div>
  );
}
