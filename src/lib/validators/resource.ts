import { z } from "zod";

export const uploadResourceSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tiêu đề").max(150),
  description: z.string().trim().max(500).optional(),
  category: z.string().trim().max(50).optional(),
});

export const MAX_RESOURCE_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const ALLOWED_RESOURCE_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/zip",
]);
