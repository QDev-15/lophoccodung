import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { RANDOM_PICKER_GAMES } from "@/lib/games";

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

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Gọi tên ngẫu nhiên</h1>
          <p className="mt-1 text-sm text-zinc-500">Lớp {classItem.name}</p>
        </div>
        <Link
          href={`/classes/${classId}`}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Quay lại lớp học
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {RANDOM_PICKER_GAMES.map((game) => (
          <Link
            key={game.slug}
            href={`/classes/${classId}/games/${game.slug}`}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-sky-400 hover:shadow-sm"
          >
            <span className="text-3xl">{game.emoji}</span>
            <span className="font-semibold text-zinc-900">{game.name}</span>
            <span className="text-sm text-zinc-500">{game.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
