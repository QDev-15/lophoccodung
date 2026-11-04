"use client";

import { useActionState } from "react";

import { uploadResource, type UploadResourceState } from "./actions";

const initialState: UploadResourceState = { error: null };

export function ResourceUploadForm() {
  const [state, formAction, isSubmitting] = useActionState(uploadResource, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="font-semibold text-zinc-900">Tải tài liệu lên</h2>
      <input
        name="title"
        required
        placeholder="Tiêu đề tài liệu"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
      />
      <input
        name="category"
        placeholder="Danh mục (ví dụ: Phiếu bài tập, Giáo án...)"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
      />
      <textarea
        name="description"
        rows={2}
        placeholder="Mô tả ngắn (không bắt buộc)"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
      />
      <input
        type="file"
        name="file"
        required
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.zip"
        className="text-sm"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-sky-600 px-6 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {isSubmitting ? "Đang tải lên..." : "Tải lên & chia sẻ"}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
