import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

export default async function ClassesPage() {
  const teacher = await requireTeacher();
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id! },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { students: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Lớp học của tôi</h1>
        <Link
          href="/classes/new"
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          + Tạo lớp mới
        </Link>
      </div>

      {classes.length === 0 ? (
        <p className="mt-8 text-zinc-500">Bạn chưa có lớp nào. Hãy tạo lớp đầu tiên.</p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {classes.map((c) => (
            <li key={c.id}>
              <Link
                href={`/classes/${c.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-zinc-900">{c.name}</p>
                  {c.description && (
                    <p className="text-sm text-zinc-500">{c.description}</p>
                  )}
                </div>
                <span className="text-sm text-zinc-500">{c._count.students} học sinh</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
