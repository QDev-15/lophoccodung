"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { addStudentSchema, createClassSchema } from "@/lib/validators/class";

export async function createClass(formData: FormData) {
  const teacher = await requireTeacher();

  const parsed = createClassSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
  }

  const newClass = await prisma.class.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      teacherId: teacher.id!,
    },
  });

  revalidatePath("/classes");
  redirect(`/classes/${newClass.id}`);
}

export async function addStudent(classId: string, formData: FormData) {
  const teacher = await requireTeacher();

  const owned = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    select: { id: true },
  });
  if (!owned) {
    throw new Error("Không tìm thấy lớp học");
  }

  const parsed = addStudentSchema.safeParse({
    fullName: formData.get("fullName"),
    studentCode: formData.get("studentCode") || undefined,
    dateOfBirth: formData.get("dateOfBirth") || undefined,
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
  }

  await prisma.student.create({
    data: {
      classId,
      fullName: parsed.data.fullName,
      studentCode: parsed.data.studentCode || null,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
      note: parsed.data.note || null,
    },
  });

  revalidatePath(`/classes/${classId}`);
}

export async function deleteStudent(classId: string, studentId: string) {
  const teacher = await requireTeacher();

  const owned = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    select: { id: true },
  });
  if (!owned) {
    throw new Error("Không tìm thấy lớp học");
  }

  const student = await prisma.student.findFirst({
    where: { id: studentId, classId },
    select: { id: true },
  });
  if (!student) {
    throw new Error("Không tìm thấy học sinh");
  }

  await prisma.student.delete({ where: { id: studentId } });

  revalidatePath(`/classes/${classId}`);
}

export async function deleteClass(classId: string) {
  const teacher = await requireTeacher();

  const owned = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id! },
    select: { id: true },
  });
  if (!owned) {
    throw new Error("Không tìm thấy lớp học");
  }

  await prisma.class.delete({ where: { id: classId } });

  revalidatePath("/classes");
  redirect("/classes");
}
