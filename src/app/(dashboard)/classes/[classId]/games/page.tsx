import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

export default async function ClassGamesPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const teacher = await requireTeacher();

  const classItem = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    select: { id: true, name: true },
  });

  if (!classItem) {
    notFound();
  }

  const categories = [
    {
      href: `/classes/${classId}/games/goi-len-bang`,
      emoji: "🎯",
      title: "Gọi lên bảng",
      description: "10 kiểu gọi tên ngẫu nhiên từ danh sách lớp.",
    },
    {
      href: `/classes/${classId}/games/phieu-luu-tri-thuc`,
      emoji: "🗺️",
      title: "Phiêu lưu tri thức",
      description: "9 hành trình trả lời câu hỏi theo đề kiểm tra của bạn.",
    },
    {
      href: `/classes/${classId}/games/doi-khang-tranh-tai`,
      emoji: "⚔️",
      title: "Đối kháng tranh tài",
      description: "5 kiểu thi đấu 2 đội theo đề kiểm tra của bạn.",
    },
    {
      href: "/mini-game/hen-gio",
      emoji: "🧰",
      title: "Công cụ: Hẹn giờ lớp học",
      description: "Mở công cụ hẹn giờ miễn phí, không cần chọn lớp.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-(--color-ink)">
            🎲 Mini-game
          </h1>
          <p className="mt-1 text-sm text-(--color-ink)/60">Lớp {classItem.name}</p>
        </div>
        <Link
          href={`/classes/${classId}`}
          className="rounded-full border-2 border-(--color-ink)/15 px-4 py-2 text-sm font-bold text-(--color-ink) hover:bg-white"
        >
          Quay lại lớp học
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="flex flex-col gap-2 rounded-3xl bg-white p-6 shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1"
          >
            <span className="text-3xl">{c.emoji}</span>
            <span className="font-display font-bold text-(--color-ink)">{c.title}</span>
            <span className="text-sm text-(--color-ink)/60">{c.description}</span>
          </Link>
        ))}

        <div className="flex flex-col gap-2 rounded-3xl bg-(--color-cloud) p-6 opacity-70">
          <span className="text-3xl grayscale">📷</span>
          <span className="font-display font-bold text-(--color-ink)/60">Camera</span>
          <span className="text-sm text-(--color-ink)/50">
            Trả lời bằng cử chỉ qua webcam — sắp ra mắt.
          </span>
        </div>
      </div>
    </div>
  );
}
