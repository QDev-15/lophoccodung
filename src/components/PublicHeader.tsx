import Link from "next/link";

const NAV_LINKS = [
  { href: "/mini-game", label: "Mini game", icon: "🎲", tint: "mint" },
  { href: "/kho-hoc-lieu-so", label: "Kho học liệu số", icon: "📚", tint: "lavender" },
  { href: "/bang-gia", label: "Bảng giá", icon: "💎", tint: "peach" },
  { href: "/huong-dan", label: "Hướng dẫn", icon: "🧭", tint: "mint" },
] as const;

const TINT_CLASSES: Record<(typeof NAV_LINKS)[number]["tint"], string> = {
  mint: "bg-(--color-mint-light) text-(--color-mint-dark)",
  lavender: "bg-violet-100 text-(--color-lavender)",
  peach: "bg-emerald-50 text-(--color-peach)",
};

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-(--color-ink)/10 bg-(--color-cloud)/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-(--color-ink)">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-lime-400 to-yellow-300 text-lg">
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
          className="rounded-full bg-(--color-mint) px-5 py-2 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(21,128,61,0.45)] transition hover:bg-(--color-mint-dark)"
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
