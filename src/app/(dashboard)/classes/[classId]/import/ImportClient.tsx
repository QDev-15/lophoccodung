"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import type { ImportPreviewResult } from "@/lib/excel-import";

import { commitStudentImport, previewStudentImport } from "./actions";

const statusLabel: Record<string, string> = {
  ok: "Hợp lệ",
  warning: "Cảnh báo",
  error: "Lỗi",
};

const statusClass: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

export function ImportClient({ classId }: { classId: string }) {
  const router = useRouter();
  const previewAction = previewStudentImport.bind(null, classId);
  const [preview, formAction, isPreviewing] = useActionState<ImportPreviewResult | null, FormData>(
    previewAction,
    null,
  );
  const [isCommitting, setIsCommitting] = useState(false);
  const [committedCount, setCommittedCount] = useState<number | null>(null);

  async function handleConfirm() {
    if (!preview) return;
    setIsCommitting(true);
    try {
      const result = await commitStudentImport(classId, preview.rows);
      setCommittedCount(result.imported);
      router.push(`/classes/${classId}`);
    } finally {
      setIsCommitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex items-center gap-3">
        <input
          type="file"
          name="file"
          accept=".xlsx,.xls"
          required
          className="text-sm"
        />
        <button
          type="submit"
          disabled={isPreviewing}
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {isPreviewing ? "Đang xử lý..." : "Xem trước"}
        </button>
      </form>

      {preview && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600">
            {preview.okCount} hợp lệ · {preview.errorCount} lỗi (sẽ không được nhập)
          </p>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Dòng</th>
                  <th className="px-3 py-2">Họ và tên</th>
                  <th className="px-3 py-2">Mã HS</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  <th className="px-3 py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {preview.rows.map((row) => (
                  <tr key={row.rowNumber}>
                    <td className="px-3 py-2 text-zinc-500">{row.rowNumber}</td>
                    <td className="px-3 py-2">{row.fullName || "—"}</td>
                    <td className="px-3 py-2">{row.studentCode || "—"}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[row.status]}`}
                      >
                        {statusLabel[row.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-zinc-500">{row.messages.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isCommitting || preview.okCount === 0}
            className="w-fit rounded-full bg-sky-600 px-6 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {isCommitting ? "Đang nhập..." : `Xác nhận nhập ${preview.okCount} học sinh`}
          </button>

          {committedCount !== null && (
            <p className="text-sm text-emerald-600">Đã nhập {committedCount} học sinh.</p>
          )}
        </div>
      )}
    </div>
  );
}
