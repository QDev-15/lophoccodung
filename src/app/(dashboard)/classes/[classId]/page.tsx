import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

import { addStudent, deleteStudent } from "../actions";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const teacher = await requireTeacher();

  const classItem = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    include: { students: { orderBy: { fullName: "asc" } } },
  });

  if (!classItem) {
    notFound();
  }

  const addStudentToClass = addStudent.bind(null, classId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{classItem.name}</h1>
          {classItem.description && (
            <p className="mt-1 text-sm text-zinc-500">{classItem.description}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href={`/classes/${classId}/games`}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            🎲 Mini-game
          </Link>
          <Link
            href={`/classes/${classId}/import`}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Nhập từ Excel
          </Link>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-semibold text-zinc-900">
          Danh sách học sinh ({classItem.students.length})
        </h2>
        {classItem.students.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Chưa có học sinh nào.</p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
            {classItem.students.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium text-zinc-900">{s.fullName}</span>
                  {s.studentCode && (
                    <span className="ml-2 text-zinc-500">#{s.studentCode}</span>
                  )}
                </div>
                <form action={deleteStudent.bind(null, classId, s.id)}>
                  <button
                    type="submit"
                    className="text-zinc-400 hover:text-red-600"
                  >
                    Xóa
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-zinc-900">Thêm học sinh</h2>
        <form action={addStudentToClass} className="mt-3 flex flex-wrap gap-3">
          <input
            name="fullName"
            required
            placeholder="Họ và tên"
            className="min-w-[180px] flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
          />
          <input
            name="studentCode"
            placeholder="Mã học sinh (không bắt buộc)"
            className="w-48 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Thêm
          </button>
        </form>
      </section>
    </div>
  );
}
