import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { getAdventureTheme } from "@/lib/adventure-themes";

import { QuizPicker } from "../../QuizPicker";
import { AdventurePlayer } from "./AdventurePlayer";

export default async function AdventureThemePage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string; theme: string }>;
  searchParams: Promise<{ quizId?: string }>;
}) {
  const { classId, theme: themeSlug } = await params;
  const { quizId } = await searchParams;
  const teacher = await requireTeacher();

  const theme = getAdventureTheme(themeSlug);
  if (!theme) {
    notFound();
  }

  const classItem = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    select: { id: true, name: true },
  });
  if (!classItem) {
    notFound();
  }

  const basePath = `/classes/${classId}/games/phieu-luu-tri-thuc/${themeSlug}`;

  let quiz: {
    id: string;
    title: string;
    questions: { id: string; type: string; prompt: string; points: number; data: unknown }[];
  } | null = null;

  if (quizId) {
    quiz = await prisma.quiz.findFirst({
      where: { id: quizId, teacherId: teacher.id! },
      select: {
        id: true,
        title: true,
        questions: { orderBy: { order: "asc" } },
      },
    });
    if (!quiz) {
      notFound();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-(--color-cocoa)">
            {theme.emoji} {theme.name}
          </h1>
          <p className="mt-1 text-sm text-(--color-cocoa)/60">Lớp {classItem.name}</p>
        </div>
        <Link
          href={`/classes/${classId}/games/phieu-luu-tri-thuc`}
          className="rounded-full border-2 border-(--color-cocoa)/15 px-4 py-2 text-sm font-bold text-(--color-cocoa) hover:bg-white"
        >
          Chọn game khác
        </Link>
      </div>

      <div className="mt-6">
        {quiz ? (
          <AdventurePlayer theme={theme} quiz={quiz} />
        ) : (
          <QuizPicker teacherId={teacher.id!} basePath={basePath} />
        )}
      </div>
    </div>
  );
}
