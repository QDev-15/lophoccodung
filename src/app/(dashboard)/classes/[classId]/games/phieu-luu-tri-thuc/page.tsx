import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { ADVENTURE_THEMES } from "@/lib/adventure-themes";
import { IconChip } from "@/components/IconChip";

export default async function AdventureCategoryPage({
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="animate-float text-5xl">🗺️</span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-(--color-ink)">
              Phiêu lưu tri thức
            </h1>
            <p className="mt-1 text-sm text-(--color-ink)/60">
              Lớp {classItem.name} · 🧒👧 Cùng cả lớp lên đường khám phá!
            </p>
          </div>
        </div>
        <Link
          href={`/classes/${classId}/games`}
          className="rounded-full border-2 border-(--color-ink)/15 px-4 py-2 text-sm font-bold text-(--color-ink) hover:bg-white"
        >
          Quay lại
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {ADVENTURE_THEMES.map((theme) => (
          <Link
            key={theme.slug}
            href={`/classes/${classId}/games/phieu-luu-tri-thuc/${theme.slug}`}
            className="group flex flex-col gap-2 overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_-10px_rgba(46,42,33,0.22)]"
          >
            <div
              className={`h-1.5 w-full ${
                theme.tint === "mint"
                  ? "bg-gradient-to-r from-(--color-mint) to-(--color-mint-dark)"
                  : theme.tint === "lavender"
                    ? "bg-gradient-to-r from-(--color-lavender) to-[#5b21b6]"
                    : "bg-gradient-to-r from-(--color-peach) to-[#065f46]"
              }`}
            />
            <div className="flex flex-col gap-2 p-5">
              <IconChip
                icon={theme.emoji}
                tint={theme.tint}
                size="xl"
                className="transition group-hover:scale-110"
              />
              <span className="font-display font-bold text-(--color-ink)">{theme.name}</span>
              <span className="text-sm text-(--color-ink)/60">{theme.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
