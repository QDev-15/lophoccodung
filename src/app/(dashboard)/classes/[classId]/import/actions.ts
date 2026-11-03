"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import {
  parseStudentExcelBuffer,
  validateStudentRows,
  type ImportPreviewResult,
  type ImportPreviewRow,
} from "@/lib/excel-import";

async function assertOwnsClass(classId: string) {
  const teacher = await requireTeacher();
  const owned = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    select: { id: true },
  });
  if (!owned) {
    throw new Error("Không tìm thấy lớp học");
  }
}

export async function previewStudentImport(
  classId: string,
  _prevState: ImportPreviewResult | null,
  formData: FormData,
): Promise<ImportPreviewResult> {
  await assertOwnsClass(classId);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { rows: [], okCount: 0, warningCount: 0, errorCount: 1 };
  }

  const buffer = await file.arrayBuffer();
  const rawRows = parseStudentExcelBuffer(buffer);

  const existing = await prisma.student.findMany({
    where: { classId, studentCode: { not: null } },
    select: { studentCode: true },
  });
  const existingCodes = new Set(existing.map((s) => s.studentCode!).filter(Boolean));

  return validateStudentRows(rawRows, existingCodes);
}

export async function commitStudentImport(classId: string, rows: ImportPreviewRow[]) {
  await assertOwnsClass(classId);

  const validRows = rows.filter((r) => r.status !== "error");

  if (validRows.length > 0) {
    await prisma.student.createMany({
      data: validRows.map((r) => ({
        classId,
        fullName: r.fullName,
        studentCode: r.studentCode || null,
        dateOfBirth: r.dateOfBirth ? new Date(r.dateOfBirth) : null,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath(`/classes/${classId}`);

  return { imported: validRows.length };
}
