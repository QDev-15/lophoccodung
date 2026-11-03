import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { getGameMeta } from "@/lib/games";

import { GamePlayer } from "./GamePlayer";

export default async function GamePlayPage({
  params,
}: {
  params: Promise<{ classId: string; slug: string }>;
}) {
  const { classId, slug } = await params;
  const teacher = await requireTeacher();

  const game = getGameMeta(slug);
  if (!game) {
    notFound();
  }

  const classItem = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    include: { students: { orderBy: { fullName: "asc" } } },
  });

  if (!classItem) {
    notFound();
  }

  return (
    <GamePlayer
      classId={classId}
      className={classItem.name}
      game={game}
      students={classItem.students.map((s) => ({ id: s.id, fullName: s.fullName }))}
    />
  );
}
