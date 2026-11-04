import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";
import { formatFileSize, getFileTypeIcon } from "@/lib/format";

import { ResourceUploadForm } from "./ResourceUploadForm";
import { deleteResource } from "./actions";

export default async function ResourcesPage() {
  const teacher = await requireTeacher();

  const resources = await prisma.resource.findMany({
    where: { uploadedById: teacher.id! },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Tài liệu của tôi</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Tải tài liệu lên để chia sẻ cho mọi giáo viên trong Kho học liệu số.
          </p>
        </div>
        <Link
          href="/kho-hoc-lieu-so"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Xem kho học liệu
        </Link>
      </div>

      <div className="mt-6">
        <ResourceUploadForm />
      </div>

      <section className="mt-8">
        <h2 className="font-semibold text-zinc-900">
          Tài liệu đã tải lên ({resources.length})
        </h2>
        {resources.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Bạn chưa tải lên tài liệu nào.</p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
            {resources.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileTypeIcon(r.fileType)}</span>
                  <div>
                    <p className="font-medium text-zinc-900">{r.title}</p>
                    <p className="text-xs text-zinc-500">
                      {r.category && <span className="mr-2">{r.category} ·</span>}
                      {formatFileSize(r.fileSize)} · {r.downloadCount} lượt tải
                    </p>
                  </div>
                </div>
                <form action={deleteResource.bind(null, r.id)}>
                  <button type="submit" className="text-zinc-400 hover:text-red-600">
                    Xóa
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
