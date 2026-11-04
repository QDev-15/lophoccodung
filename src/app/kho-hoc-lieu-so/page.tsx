import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatFileSize, getFileTypeIcon } from "@/lib/format";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { IconChip, TINT_ROTATION } from "@/components/IconChip";

export const metadata = {
  title: "Kho học liệu số - Lớp Học Cô Dung",
  description: "Quiz thử trải nghiệm và tài liệu do giáo viên chia sẻ, miễn phí cho tất cả mọi người.",
};

export const dynamic = "force-dynamic";

export default async function ResourceLibraryPage() {
  const [sampleAssignments, resources] = await Promise.all([
    prisma.assignment.findMany({
      where: { isPublicSample: true, isActive: true },
      include: { quiz: { include: { _count: { select: { questions: true } } } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { name: true } } },
      take: 60,
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 md:px-6">
        <div className="text-center">
          <IconChip icon="📚" tint="mint" size="lg" className="mx-auto" />
          <h1 className="mt-4 font-display text-3xl font-extrabold text-(--color-ink)">
            Kho học liệu số
          </h1>
          <p className="mt-1 text-(--color-ink)/65">
            Miễn phí cho tất cả mọi người, không cần đăng nhập.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-(--color-ink)">
            Quiz thử trải nghiệm
          </h2>
          <p className="mt-1 text-sm text-(--color-ink)/60">
            Thử ngay một đề quiz mẫu để xem học sinh sẽ trải nghiệm làm bài như thế nào.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {sampleAssignments.map((a, i) => (
              <Link
                key={a.id}
                href={`/take/${a.token}`}
                className="flex flex-col gap-2 rounded-3xl bg-white p-5 shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1"
              >
                <IconChip icon="📝" tint={TINT_ROTATION[i % TINT_ROTATION.length]} size="md" />
                <span className="font-display font-bold text-(--color-ink)">{a.quiz.title}</span>
                {a.quiz.description && (
                  <span className="text-sm text-(--color-ink)/60">{a.quiz.description}</span>
                )}
                <span className="mt-1 text-xs font-bold text-(--color-mint-dark)">
                  {a.quiz._count.questions} câu hỏi · Làm thử ngay →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-(--color-ink)">
            Tài liệu chia sẻ từ giáo viên ({resources.length})
          </h2>
          {resources.length === 0 ? (
            <p className="mt-3 rounded-2xl bg-white p-5 text-sm text-(--color-ink)/60">
              Chưa có tài liệu nào được chia sẻ. Giáo viên có thể đăng nhập và tải tài liệu lên tại
              trang &quot;Học liệu&quot;.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-(--color-ink)/10 overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)]">
              {resources.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileTypeIcon(r.fileType)}</span>
                    <div>
                      <p className="font-bold text-(--color-ink)">{r.title}</p>
                      {r.description && (
                        <p className="text-xs text-(--color-ink)/55">{r.description}</p>
                      )}
                      <p className="text-xs text-(--color-ink)/45">
                        {r.category && <span className="mr-2">{r.category} ·</span>}
                        {formatFileSize(r.fileSize)} · chia sẻ bởi {r.uploadedBy.name ?? "Giáo viên"}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/resources/${r.id}/download`}
                    className="shrink-0 rounded-full bg-(--color-mint) px-4 py-1.5 text-xs font-bold text-white transition hover:bg-(--color-mint-dark)"
                  >
                    Tải xuống
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
