import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { RANDOM_PICKER_GAMES } from "@/lib/games";
import { IconChip } from "@/components/IconChip";

const TINTS = ["honey", "mint", "sky", "lavender"] as const;

export default async function PickerCategoryPage({
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
          <h1 className="font-display text-2xl font-extrabold text-(--color-cocoa)">
            🎯 Gọi lên bảng
          </h1>
          <p className="mt-1 text-sm text-(--color-cocoa)/60">Lớp {classItem.name}</p>
        </div>
        <Link
          href={`/classes/${classId}/games`}
          className="rounded-full border-2 border-(--color-cocoa)/15 px-4 py-2 text-sm font-bold text-(--color-cocoa) hover:bg-white"
        >
          Quay lại
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {RANDOM_PICKER_GAMES.map((game, i) => (
          <Link
            key={game.slug}
            href={`/classes/${classId}/games/${game.slug}`}
            className="flex flex-col gap-2 rounded-3xl bg-white p-5 shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)] transition hover:-translate-y-1"
          >
            <IconChip icon={game.emoji} tint={TINTS[i % 4]} size="lg" />
            <span className="font-display font-bold text-(--color-cocoa)">{game.name}</span>
            <span className="text-sm text-(--color-cocoa)/60">{game.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
