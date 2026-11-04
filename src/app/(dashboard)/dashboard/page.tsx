import Link from "next/link";
import { auth } from "@/lib/auth";

const SHORTCUTS = [
  {
    href: "/classes",
    icon: "🧑‍🤝‍🧑",
    tint: "bg-(--color-honey-light) text-(--color-honey-dark)",
    title: "Lớp học",
    desc: "Tạo lớp, cập nhật thông tin và danh sách học sinh.",
  },
  {
    href: "/quizzes",
    icon: "📝",
    tint: "bg-(--color-mint-light) text-(--color-mint)",
    title: "Đề kiểm tra",
    desc: "Soạn đề trắc nghiệm riêng để giao cho học sinh.",
  },
  {
    href: "/assignments",
    icon: "📨",
    tint: "bg-(--color-sky-light) text-(--color-sky)",
    title: "Bài đã giao",
    desc: "Giao bài qua liên kết và xem kết quả học sinh.",
  },
  {
    href: "/resources",
    icon: "📚",
    tint: "bg-violet-100 text-(--color-lavender)",
    title: "Học liệu",
    desc: "Kho tài liệu và mẫu đề dùng chung cho lớp.",
  },
] as const;

export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? "thầy cô";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="flex items-center gap-3">
        <span className="animate-float flex size-12 items-center justify-center rounded-full bg-(--color-honey-light) text-2xl">
          👋
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-(--color-cocoa)">
            Xin chào, {name}!
          </h1>
          <p className="text-sm text-(--color-cocoa)/60">
            Hôm nay thầy cô muốn bắt đầu từ đâu?
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm font-bold text-(--color-cocoa)/50">
        Lối tắt
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-3xl bg-white p-5 shadow-[0_10px_30px_-14px_rgba(62,40,27,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgba(234,88,12,0.25)]"
          >
            <span
              className={`flex size-11 items-center justify-center rounded-full text-xl ${item.tint}`}
            >
              {item.icon}
            </span>
            <p className="mt-3 flex items-center gap-1 font-display font-bold text-(--color-cocoa)">
              {item.title}
              <span className="transition group-hover:translate-x-0.5">
                →
              </span>
            </p>
            <p className="mt-1 text-sm text-(--color-cocoa)/60">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
