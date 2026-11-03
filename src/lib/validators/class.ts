import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên lớp").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export const addStudentSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  studentCode: z.string().trim().max(50).optional().or(z.literal("")),
  dateOfBirth: z.string().trim().optional().or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});
