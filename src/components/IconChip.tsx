const TINT_STYLES = {
  honey: "bg-(--color-honey-light) text-(--color-honey-dark)",
  mint: "bg-(--color-mint-light) text-(--color-mint)",
  sky: "bg-(--color-sky-light) text-(--color-sky)",
  lavender: "bg-violet-100 text-(--color-lavender)",
} as const;

const SIZE_STYLES = {
  sm: "size-8 text-base",
  md: "size-11 text-xl",
  lg: "size-16 text-3xl",
} as const;

export const TINT_ROTATION = ["honey", "mint", "sky", "lavender"] as const;

export function IconChip({
  icon,
  tint = "honey",
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
