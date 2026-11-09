// Shared "candy" visual chrome for the random-picker mini-games, so each game
// (WheelGame, GiftBoxGame, ...) can match the polish level of the Ô Ăn Quan
// game — chunky pressable buttons, warm gradients, a consistent reveal card —
// without re-deriving the same shadow/gradient math in every file.

export type AccentKey = "mint" | "lavender" | "sun" | "peach";

export type GameAccent = {
  /** Solid brand bg, e.g. for the main CTA button. */
  bg: string;
  bgDark: string;
  bgLight: string;
  text: string;
  ring: string;
  border: string;
  gradient: string;
  /**
   * Full, static "candy" button class string (base state only — no
   * disabled/hover toggle). Every bracket value is written out literally so
   * Tailwind's source scanner can find it: building these via template-string
   * interpolation would produce a class name that exists only at runtime,
   * which Tailwind (a static analyzer, not a runtime) would never generate
   * CSS for.
   */
  candy: string;
};

export const GAME_ACCENTS: Record<AccentKey, GameAccent> = {
  mint: {
    bg: "bg-(--color-mint)",
    bgDark: "bg-(--color-mint-dark)",
    bgLight: "bg-(--color-mint-light)",
    text: "text-(--color-mint-dark)",
    ring: "ring-(--color-mint-dark)",
    border: "border-(--color-mint-dark)",
    gradient: "from-(--color-mint) to-(--color-mint-dark)",
    candy:
      "bg-(--color-mint-dark) shadow-[0_5px_0_#b8492e,0_12px_24px_-8px_rgba(184,73,46,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#b8492e]",
  },
  lavender: {
    bg: "bg-(--color-lavender)",
    bgDark: "bg-[#5b21b6]",
    bgLight: "bg-violet-100",
    text: "text-(--color-lavender)",
    ring: "ring-(--color-lavender)",
    border: "border-(--color-lavender)",
    gradient: "from-(--color-lavender) to-[#5b21b6]",
    candy:
      "bg-[#5b21b6] shadow-[0_5px_0_#3b0f7a,0_12px_24px_-8px_rgba(139,92,246,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#3b0f7a]",
  },
  sun: {
    bg: "bg-(--color-sun)",
    bgDark: "bg-(--color-sun-dark)",
    bgLight: "bg-amber-50",
    text: "text-(--color-sun-dark)",
    ring: "ring-(--color-sun-dark)",
    border: "border-(--color-sun-dark)",
    gradient: "from-(--color-sun) to-(--color-sun-dark)",
    candy:
      "bg-(--color-sun-dark) shadow-[0_5px_0_#92400e,0_12px_24px_-8px_rgba(217,119,6,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#92400e]",
  },
  peach: {
    bg: "bg-(--color-peach)",
    bgDark: "bg-[#14532d]",
    bgLight: "bg-emerald-50",
    text: "text-(--color-peach)",
    ring: "ring-(--color-peach)",
    border: "border-(--color-peach)",
    gradient: "from-(--color-peach) to-[#14532d]",
    candy:
      "bg-[#14532d] shadow-[0_5px_0_#0b2f19,0_12px_24px_-8px_rgba(21,128,61,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#0b2f19]",
  },
};

/** Chunky pressable "candy" button, matching the Ô Ăn Quan press-and-bounce feel. */
export function candyButtonClass(accent: GameAccent, disabled = false) {
  return `min-h-12 rounded-full px-8 py-3 text-base font-extrabold text-white transition ${accent.candy} ${disabled ? "pointer-events-none opacity-50" : ""}`;
}

/** Soft outline "secondary" button, e.g. reset/play-again actions. */
export function ghostButtonClass() {
  return "min-h-12 rounded-full border-2 border-(--color-ink)/15 px-8 py-3 text-base font-bold text-(--color-ink) transition hover:bg-white active:translate-y-0.5";
}

/** Decorative blurred color blobs + wood-grain wash behind a game's stage. */
export function GameStageBackdrop({ accent }: { accent: GameAccent }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
      <div className={`absolute -right-10 -top-10 size-40 rounded-full opacity-30 blur-3xl ${accent.bg}`} />
      <div className={`absolute -bottom-12 -left-10 size-44 rounded-full opacity-20 blur-3xl ${accent.bg}`} />
    </div>
  );
}

const KID_FACES = ["🧒", "👧", "👦", "🙋‍♀️", "🙋‍♂️", "🧑‍🎓"];

/**
 * A small row of big, bouncing kid emoji — the site's recurring "cute
 * classroom" motif. Pass a seed so different games/instances land on a
 * different pair of faces instead of all showing the same two kids.
 */
export function CheerSquad({
  size = "text-4xl",
  seed = 0,
  className = "",
}: {
  size?: string;
  seed?: number;
  className?: string;
}) {
  const faces = [KID_FACES[seed % KID_FACES.length], KID_FACES[(seed + 2) % KID_FACES.length]];
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      <span className={`${size} animate-wiggle`}>{faces[0]}</span>
      <span className={`${size} animate-float`} style={{ animationDelay: "0.4s" }}>
        {faces[1]}
      </span>
    </div>
  );
}

export function RevealBanner({ student }: { student: { fullName: string } | null }) {
  if (!student) return null;

  return (
    <div className="animate-pop-in relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-(--color-sun)/20 via-white to-(--color-mint-light)/40 px-8 py-6 text-center shadow-[0_8px_24px_-8px_rgba(62,40,27,0.25)]">
      <span aria-hidden="true" className="animate-twinkle absolute left-3 top-2 text-2xl">
        🎊
      </span>
      <span aria-hidden="true" className="animate-twinkle absolute right-3 top-3 text-xl" style={{ animationDelay: "0.3s" }}>
        ✨
      </span>
      <div className="flex items-center justify-center gap-3">
        <span className="animate-wiggle text-5xl">🧒</span>
        <p className="font-display text-3xl font-extrabold text-(--color-ink)">🎉 {student.fullName}</p>
        <span className="animate-wiggle text-5xl" style={{ animationDelay: "0.2s" }}>
          👧
        </span>
      </div>
    </div>
  );
}
