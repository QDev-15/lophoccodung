const TINT_STYLES = {
  mint: "bg-(--color-mint-light) text-(--color-mint-dark)",
  lavender: "bg-violet-100 text-(--color-lavender)",
  peach: "bg-emerald-50 text-(--color-peach)",
} as const;

const SIZE_STYLES = {
  sm: "size-10 text-xl",
  md: "size-14 text-2xl",
  lg: "size-20 text-4xl",
  xl: "size-24 text-5xl",
  "2xl": "size-32 text-6xl",
} as const;

export const TINT_ROTATION = ["mint", "lavender", "peach"] as const;

export function IconChip({
  icon,
  tint = "mint",
  size = "md",
  className = "",
}: {
  icon: string;
  tint?: keyof typeof TINT_STYLES;
  size?: keyof typeof SIZE_STYLES;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${TINT_STYLES[tint]} ${SIZE_STYLES[size]} ${className}`}
    >
      {icon}
    </span>
  );
}
