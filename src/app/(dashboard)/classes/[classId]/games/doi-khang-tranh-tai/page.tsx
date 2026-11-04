import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { BATTLE_THEMES } from "@/lib/battle-themes";
import { IconChip } from "@/components/IconChip";

export default async function BattleCategoryPage({
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
        <div>
          <h1 className="font-display text-2xl font-extrabold text-(--color-ink)">
            ⚔️ Đối kháng tranh tài
          </h1>
          <p className="mt-1 text-sm text-(--color-ink)/60">Lớp {classItem.name}</p>
        </div>
        <Link
          href={`/classes/${classId}/games`}
          className="rounded-full border-2 border-(--color-ink)/15 px-4 py-2 text-sm font-bold text-(--color-ink) hover:bg-white"
        >
          Quay lại
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {BATTLE_THEMES.map((theme) => (
          <Link
            key={theme.slug}
            href={`/classes/${classId}/games/doi-khang-tranh-tai/${theme.slug}`}
            className="flex flex-col gap-2 rounded-3xl bg-white p-5 shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1"
          >
            <IconChip icon={theme.emoji} tint={theme.tint} size="lg" />
            <span className="font-display font-bold text-(--color-ink)">{theme.name}</span>
            <span className="text-sm text-(--color-ink)/60">{theme.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
