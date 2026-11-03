import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

import { ImportClient } from "./ImportClient";

export default async function ImportPage({
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
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">
        Nhập học sinh từ Excel — {classItem.name}
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        File cần có cột <strong>Họ và tên</strong> (bắt buộc), và có thể có thêm{" "}
        <strong>Mã học sinh</strong>, <strong>Ngày sinh</strong>.
      </p>
      <div className="mt-6">
        <ImportClient classId={classId} />
      </div>
    </div>
  );
}
