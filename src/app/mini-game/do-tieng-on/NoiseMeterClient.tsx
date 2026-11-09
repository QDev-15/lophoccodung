"use client";

import { useEffect, useRef, useState } from "react";

import { IconChip } from "@/components/IconChip";

type Zone = {
  label: string;
  emoji: string;
  textVar: string;
  barFrom: string;
  barTo: string;
  min: number;
};

const ZONES: Zone[] = [
  { label: "Quá ồn!", emoji: "🤯", textVar: "--color-bloom", barFrom: "--color-bloom", barTo: "#7a0e3a", min: 75 },
  { label: "Ồn", emoji: "😬", textVar: "--color-sun-dark", barFrom: "--color-sun", barTo: "--color-sun-dark", min: 50 },
  { label: "Vừa phải", emoji: "🙂", textVar: "--color-mint-dark", barFrom: "--color-mint", barTo: "--color-mint-dark", min: 25 },
  { label: "Yên tĩnh", emoji: "😴", textVar: "--color-lavender", barFrom: "--color-lavender", barTo: "#5b21b6", min: 0 },
];

function zoneFor(level: number): Zone {
  return ZONES.find((z) => level >= z.min) ?? ZONES[ZONES.length - 1];
}

export function NoiseMeterClient() {
  const [listening, setListening] = useState(false);
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  function stop() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setListening(false);
    setLevel(0);
  }

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      setPeak(0);
      setListening(true);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sumSquares = 0;
        for (let i = 0; i < data.length; i++) {
          const normalized = (data[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / data.length);
        const pct = Math.min(100, Math.round(rms * 100 * 3.2));
        setLevel(pct);
        setPeak((p) => Math.max(p * 0.985, pct));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Không thể truy cập micro. Hãy cho phép quyền micro trên trình duyệt rồi thử lại.");
      setListening(false);
    }
  }

  useEffect(() => stop, []);

  const zone = zoneFor(level);
  const tooLoud = listening && level >= 75;

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-(--color-cloud) p-6 shadow-[0_16px_40px_-16px_rgba(46,42,33,0.25)] sm:rounded-[2.5rem] sm:p-9">
      {/* Decorative ambient blobs — purely background color wash, no layout impact. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-(--color-lavender)/15 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 size-44 rounded-full bg-(--color-mint)/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Mascot intro badge */}
        <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-[0_2px_0_rgba(46,42,33,0.08),0_6px_14px_-4px_rgba(46,42,33,0.2)]">
          <IconChip icon="🐰" tint="mint" size="sm" />
          <span className="text-xs font-bold text-(--color-ink)/65 sm:text-sm">
            Thỏ Bông đang lắng nghe lớp mình
          </span>
        </div>

        {/* Reactive mascot */}
        <div className="relative flex flex-col items-center">
          {listening && (
            <>
              <span
                className="noisemeter2-pulse-ring absolute top-5 size-24 rounded-full border-2 border-(--color-mint-dark)/40 sm:size-28"
                aria-hidden="true"
              />
              <span
                className="noisemeter2-pulse-ring absolute top-5 size-24 rounded-full border-2 border-(--color-mint-dark)/25 sm:size-28"
                style={{ animationDelay: "0.7s" }}
                aria-hidden="true"
              />
            </>
          )}

          <div className="relative">
            <BunnyEars
              agitated={tooLoud}
              className="absolute -top-6 left-1/2 w-16 -translate-x-1/2 sm:-top-7 sm:w-20"
            />
            {tooLoud && (
              <span
                className="animate-wiggle absolute -left-3 bottom-1 text-xl sm:-left-4 sm:text-2xl"
                aria-hidden="true"
              >
                🙈
              </span>
            )}
            <div
              className={`relative z-10 flex size-24 items-center justify-center rounded-full text-5xl shadow-[0_8px_20px_-6px_rgba(46,42,33,0.3)] sm:size-28 sm:text-6xl ${
                tooLoud ? "animate-wiggle" : "animate-float"
              }`}
              style={{
                background: `color-mix(in srgb, var(${zone.textVar}) 20%, white)`,
              }}
            >
              {zone.emoji}
            </div>
            {tooLoud && (
              <span
                className="animate-wiggle absolute -right-3 bottom-1 text-xl sm:-right-4 sm:text-2xl"
                style={{ animationDelay: "0.2s" }}
                aria-hidden="true"
              >
                🙉
              </span>
            )}
          </div>
          <span className="mt-2 text-[11px] font-bold uppercase tracking-wide text-(--color-ink)/35">
            Thỏ Bông
          </span>
        </div>

        {/* Meter */}
        <div className="flex items-end gap-3">
          <div className="flex h-64 flex-col justify-between py-1 text-right text-[10px] font-bold text-(--color-ink)/40 sm:h-72">
            <span>100</span>
            {ZONES.map((z) => (
              <span key={z.label} className="inline-flex items-center justify-end gap-1">
                {z.min}
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: `var(${z.textVar})` }}
                />
              </span>
            ))}
          </div>

          <div className="relative flex h-64 w-32 flex-col items-center justify-end overflow-hidden rounded-[2.5rem] border-[3px] border-(--color-ink)/10 bg-white p-2 shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_8px_32px_-8px_rgba(62,40,27,0.18)] sm:h-72 sm:w-40">
            {/* Glass highlight streak */}
            <span
              aria-hidden="true"
              className="absolute left-2.5 top-3 bottom-3 w-2 rounded-full bg-white/60 blur-[1px]"
            />

            <div className="relative flex h-full w-full flex-1 flex-col-reverse overflow-hidden rounded-[2rem]">
              {/* zone band tint fills */}
              {ZONES.map((z, i) => {
                const top = i === 0 ? 100 : ZONES[i - 1].min;
                return (
                  <div
                    key={z.label}
                    aria-hidden="true"
                    className="absolute inset-x-0"
                    style={{
                      bottom: `${z.min}%`,
                      height: `${top - z.min}%`,
                      background: `color-mix(in srgb, var(${z.textVar}) 9%, transparent)`,
                    }}
                  />
                );
              })}
              {/* zone separators */}
              {ZONES.map((z) => (
                <div
                  key={`${z.label}-line`}
                  aria-hidden="true"
                  className="absolute inset-x-0 border-t border-dashed border-(--color-ink)/10"
                  style={{ bottom: `${z.min}%` }}
                />
              ))}

              <div
                className={`relative w-full rounded-t-[1.5rem] transition-[height] duration-150 ease-out ${
                  tooLoud ? "animate-glow" : ""
                }`}
                style={{
                  height: `${level}%`,
                  background: `linear-gradient(180deg, var(${zone.barFrom}), var(${zone.barTo}))`,
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.35), inset 0 -2px 6px rgba(0,0,0,0.15)",
                }}
              >
                <span className="absolute inset-x-2 top-1 h-1.5 rounded-full bg-white/40" />
              </div>

              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-(--color-ink)/25"
                style={{ bottom: `${Math.min(100, peak)}%` }}
              >
                <span className="absolute -right-1 -top-2.5 text-xs">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <span
            className="font-display inline-block rounded-full px-5 py-1.5 text-xl font-extrabold sm:text-2xl"
            style={{
              color: `var(${zone.textVar})`,
              background: `color-mix(in srgb, var(${zone.textVar}) 14%, white)`,
            }}
          >
            {listening ? zone.label : "Chưa bật micro"}
          </span>
          <p className="mt-2 text-sm text-(--color-ink)/60">
            Mức âm lượng: <span className="font-bold text-(--color-ink)">{listening ? level : 0}%</span>
          </p>
        </div>

        {error && (
          <div className="flex max-w-sm items-center gap-2 rounded-2xl border-2 border-(--color-bloom)/25 bg-(--color-bloom)/10 px-4 py-3 text-sm font-bold text-(--color-bloom)">
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={listening ? stop : start}
          className={`relative min-h-12 overflow-hidden rounded-full px-8 py-3 text-base font-extrabold transition active:translate-y-1 ${
            listening
              ? "border-2 border-(--color-ink)/15 bg-white text-(--color-ink) shadow-[0_4px_0_rgba(46,42,33,0.08),0_10px_20px_-6px_rgba(46,42,33,0.18)] active:shadow-[0_1px_0_rgba(46,42,33,0.08)]"
              : "animate-glow bg-(--color-mint) text-white shadow-[0_5px_0_var(--color-mint-dark),0_12px_24px_-8px_rgba(184,73,46,0.55)] active:shadow-[0_1px_0_var(--color-mint-dark)]"
          }`}
        >
          {!listening && (
            <span
              aria-hidden="true"
              className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30"
            />
          )}
          <span className="relative">{listening ? "⏹️ Tắt micro" : "🎙️ Bật micro & đo"}</span>
        </button>

        <p className="inline-flex max-w-sm items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-center text-xs text-(--color-ink)/50">
          <span aria-hidden="true">🔒</span>
          Âm thanh chỉ được xử lý ngay trên máy của bạn để hiển thị mức ồn — không được ghi âm hay
          gửi đi bất cứ đâu.
        </p>
      </div>

      <style>{`
        @keyframes noisemeter2-pulse-ring {
          0% {
            transform: scale(0.65);
            opacity: 0.55;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        .noisemeter2-pulse-ring {
          animation: noisemeter2-pulse-ring 1.8s ease-out infinite;
        }

        @keyframes noisemeter2-ear-flap {
          0%,
          100% {
            transform: rotate(-6deg);
          }
          50% {
            transform: rotate(6deg);
          }
        }
        .noisemeter2-ear-flap {
          animation: noisemeter2-ear-flap 0.22s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .noisemeter2-pulse-ring,
          .noisemeter2-ear-flap {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

// A small round-eared bunny head accent that sits behind the mascot's face chip.
// Hand-rolled inline SVG (no illustration assets in this codebase) — each ear flaps
// independently when the classroom gets too loud.
function BunnyEars({ agitated = false, className = "" }: { agitated?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 100 70" className={className} role="presentation" aria-hidden="true">
      <g
        className={agitated ? "noisemeter2-ear-flap" : ""}
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      >
        <ellipse
          cx="30"
          cy="30"
          rx="13"
          ry="30"
          fill="white"
          stroke="var(--color-ink)"
          strokeOpacity="0.12"
          strokeWidth="2"
          transform="rotate(-16 30 30)"
        />
        <ellipse cx="30" cy="34" rx="6.5" ry="20" fill="var(--color-mint-light)" transform="rotate(-16 30 30)" />
      </g>
      <g
        className={agitated ? "noisemeter2-ear-flap" : ""}
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animationDelay: "0.1s" }}
      >
        <ellipse
          cx="70"
          cy="30"
          rx="13"
          ry="30"
          fill="white"
          stroke="var(--color-ink)"
          strokeOpacity="0.12"
          strokeWidth="2"
          transform="rotate(16 70 30)"
        />
        <ellipse cx="70" cy="34" rx="6.5" ry="20" fill="var(--color-mint-light)" transform="rotate(16 70 30)" />
      </g>
    </svg>
  );
}
