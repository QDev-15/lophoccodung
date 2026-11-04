"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import {
  uploadResourceSchema,
  MAX_RESOURCE_FILE_SIZE,
  ALLOWED_RESOURCE_MIME_TYPES,
} from "@/lib/validators/resource";

export type UploadResourceState = { error: string | null };

export async function uploadResource(
  _prevState: UploadResourceState,
  formData: FormData,
): Promise<UploadResourceState> {
  const teacher = await requireTeacher();

  const parsed = uploadResourceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    category: formData.get("category") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Vui lòng chọn một file để tải lên" };
  }
  if (file.size > MAX_RESOURCE_FILE_SIZE) {
    return { error: "File vượt quá 20MB" };
  }
  if (!ALLOWED_RESOURCE_MIME_TYPES.has(file.type)) {
    return { error: "Định dạng file không được hỗ trợ" };
  }

  const blob = await put(`resources/${teacher.id}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  await prisma.resource.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      fileUrl: blob.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedById: teacher.id!,
    },
  });

  revalidatePath("/resources");
  revalidatePath("/kho-hoc-lieu-so");

  return { error: null };
}

export async function deleteResource(resourceId: string) {
  const teacher = await requireTeacher();

  const resource = await prisma.resource.findFirst({
    where: { id: resourceId, uploadedById: teacher.id! },
  });
  if (!resource) {
    throw new Error("Không tìm thấy tài liệu");
  }

  await del(resource.fileUrl);
  await prisma.resource.delete({ where: { id: resourceId } });

  revalidatePath("/resources");
  revalidatePath("/kho-hoc-lieu-so");
}
