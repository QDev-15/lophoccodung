import Link from "next/link";

const NAV_LINKS = [
  { href: "/mini-game", label: "Mini game", icon: "🎲", tint: "honey" },
  { href: "/kho-hoc-lieu-so", label: "Kho học liệu số", icon: "📚", tint: "mint" },
  { href: "/bang-gia", label: "Bảng giá", icon: "💎", tint: "sky" },
  { href: "/huong-dan", label: "Hướng dẫn", icon: "🧭", tint: "lavender" },
] as const;

const TINT_CLASSES: Record<(typeof NAV_LINKS)[number]["tint"], string> = {
  honey: "bg-(--color-honey-light) text-(--color-honey-dark)",
  mint: "bg-(--color-mint-light) text-(--color-mint)",
  sky: "bg-(--color-sky-light) text-(--color-sky)",
  lavender: "bg-violet-100 text-(--color-lavender)",
};

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-(--color-cocoa)/10 bg-(--color-cream)/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-(--color-cocoa)">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-violet-400 to-pink-400 text-lg">
            🧸
          </span>
          Lớp Học Cô Dung
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold transition hover:brightness-95 ${TINT_CLASSES[item.tint]}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/signin"
          className="rounded-full bg-(--color-honey) px-5 py-2 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.45)] transition hover:bg-(--color-honey-dark)"
        >
          Đăng nhập
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${TINT_CLASSES[item.tint]}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
