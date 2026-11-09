import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { RANDOM_PICKER_GAMES } from "@/lib/games";
import { ADVENTURE_THEMES } from "@/lib/adventure-themes";
import { BATTLE_THEMES } from "@/lib/battle-themes";

const PREVIEW_COUNT = 6;

function PreviewRow({ emojis, total }: { emojis: string[]; total: number }) {
  const extra = total - emojis.length;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5">
      {emojis.map((e, i) => (
        <span
          key={i}
          className="flex size-8 items-center justify-center rounded-full bg-(--color-cloud) text-base"
        >
          {e}
        </span>
      ))}
      {extra > 0 && (
        <span className="flex h-8 items-center rounded-full bg-(--color-ink)/8 px-2 text-xs font-bold text-(--color-ink)/60">
          +{extra}
        </span>
      )}
    </div>
  );
}

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
      description: `${RANDOM_PICKER_GAMES.length} kiểu gọi tên ngẫu nhiên từ danh sách lớp.`,
      preview: RANDOM_PICKER_GAMES.slice(0, PREVIEW_COUNT).map((g) => g.emoji),
      total: RANDOM_PICKER_GAMES.length,
    },
    {
      href: `/classes/${classId}/games/phieu-luu-tri-thuc`,
      emoji: "🗺️",
      title: "Phiêu lưu tri thức",
      description: `${ADVENTURE_THEMES.length} hành trình trả lời câu hỏi theo đề kiểm tra của bạn.`,
      preview: ADVENTURE_THEMES.slice(0, PREVIEW_COUNT).map((t) => t.emoji),
      total: ADVENTURE_THEMES.length,
    },
    {
      href: `/classes/${classId}/games/doi-khang-tranh-tai`,
      emoji: "⚔️",
      title: "Đối kháng tranh tài",
      description: `${BATTLE_THEMES.length} kiểu thi đấu 2 đội theo đề kiểm tra của bạn.`,
      preview: BATTLE_THEMES.slice(0, PREVIEW_COUNT).map((t) => t.emoji),
      total: BATTLE_THEMES.length,
    },
    {
      href: "/mini-game/hen-gio",
      emoji: "🧰",
      title: "Công cụ: Hẹn giờ & Đo tiếng ồn",
      description: "Mở công cụ hẹn giờ, đo tiếng ồn miễn phí, không cần chọn lớp.",
      preview: ["⏰", "🔊"],
      total: 2,
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
            <PreviewRow emojis={c.preview} total={c.total} />
          </Link>
        ))}

        <Link
          href="/mini-game/tap-the-duc"
          className="flex flex-col gap-2 rounded-3xl bg-white p-6 shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1"
        >
          <span className="text-3xl">📷</span>
          <span className="font-display font-bold text-(--color-ink)">Camera</span>
          <span className="text-sm text-(--color-ink)/60">
            Trả lời bằng cử chỉ qua webcam: Tập thể dục, Nghiêng đầu.
          </span>
          <PreviewRow emojis={["🤸", "🙆"]} total={2} />
        </Link>
      </div>
    </div>
  );
}
