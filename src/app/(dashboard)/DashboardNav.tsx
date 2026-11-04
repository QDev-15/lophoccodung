"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: "🏠", tint: "mint" },
  { href: "/classes", label: "Lớp học", icon: "🧑‍🤝‍🧑", tint: "lavender" },
  { href: "/quizzes", label: "Đề kiểm tra", icon: "📝", tint: "peach" },
  { href: "/assignments", label: "Bài đã giao", icon: "📨", tint: "mint" },
  { href: "/resources", label: "Học liệu", icon: "📚", tint: "lavender" },
] as const;

const TINT_CLASSES: Record<(typeof NAV_ITEMS)[number]["tint"], string> = {
  mint: "bg-(--color-mint-light) text-(--color-mint-dark)",
  lavender: "bg-violet-100 text-(--color-lavender)",
  peach: "bg-orange-50 text-(--color-peach)",
};

export function DashboardNav({ layout }: { layout: "sidebar" | "mobile" }) {
  const pathname = usePathname();

  return (
    <nav
      className={
        layout === "sidebar"
          ? "flex flex-col gap-1 p-3"
          : "flex gap-2 overflow-x-auto px-3 py-2"
      }
    >
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl font-bold transition ${
              layout === "sidebar"
                ? "px-3 py-2.5 text-sm"
                : "shrink-0 flex-col gap-1 px-3 py-1.5 text-center text-[11px]"
            } ${
              active
                ? "bg-(--color-mint-light) text-(--color-mint-dark)"
                : "text-(--color-ink)/70 hover:bg-(--color-ink)/5"
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-base ${TINT_CLASSES[item.tint]}`}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
