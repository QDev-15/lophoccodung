const TINT_STYLES = {
  mint: "bg-(--color-mint-light) text-(--color-mint-dark)",
  lavender: "bg-violet-100 text-(--color-lavender)",
  peach: "bg-orange-50 text-(--color-peach)",
} as const;

const SIZE_STYLES = {
  sm: "size-8 text-base",
  md: "size-11 text-xl",
  lg: "size-16 text-3xl",
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
