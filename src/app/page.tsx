import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { RANDOM_PICKER_GAMES } from "@/lib/games";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { IconChip, TINT_ROTATION } from "@/components/IconChip";

const FEATURES = [
  {
    icon: "🧑‍🤝‍🧑",
    title: "Quản lý lớp & học sinh",
    description: "Thêm học sinh thủ công hoặc nhập nhanh từ file Excel, có xem trước trước khi lưu.",
  },
  {
    icon: "📥",
    title: "Nhập danh sách từ Excel",
    description: "Tải lên một file, hệ thống tự kiểm tra dòng lỗi và trùng mã trước khi nhập.",
  },
  {
    icon: "📝",
    title: "Tạo đề kiểm tra đa dạng",
    description: "Trắc nghiệm, đúng/sai, điền từ — tự đặt thời gian và xáo trộn câu hỏi.",
  },
  {
    icon: "✅",
    title: "Giao bài & chấm điểm tự động",
    description: "Học sinh làm bài qua một đường link, điểm được tính ngay khi nộp bài.",
  },
];

export default async function Home() {
  const sampleAssignments = await prisma.assignment.findMany({
    where: { isPublicSample: true, isActive: true },
    include: { quiz: { include: { _count: { select: { questions: true } } } } },
    orderBy: { createdAt: "asc" },
    take: 3,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-14 md:px-6 md:pt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-[32rem] rounded-full bg-(--color-honey-light) opacity-60 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-40 size-96 rounded-full bg-(--color-mint-light) opacity-70 blur-3xl"
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <span className="animate-pop-in rounded-full bg-(--color-honey-light) px-4 py-1.5 text-sm font-bold text-(--color-honey-dark)">
              🎉 Miễn phí cho giáo viên tiểu học
            </span>

            <h1 className="font-display text-4xl font-extrabold leading-tight text-(--color-cocoa) sm:text-5xl">
              Lớp học{" "}
              <span className="text-(--color-honey-dark)">rộn ràng niềm vui</span>,<br />
              thầy cô nhẹ gánh mỗi ngày
            </h1>

            <p className="max-w-xl text-lg text-(--color-cocoa)/70">
              Quản lý lớp, tạo đề kiểm tra, giao bài và chấm điểm tự động — cùng những mini-game
              gọi tên vui nhộn để lớp học luôn rộn ràng.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signin"
                className="animate-glow group relative overflow-hidden rounded-full bg-(--color-honey) px-8 py-3 text-base font-bold text-white transition hover:bg-(--color-honey-dark) active:scale-95"
                style={{ transitionTimingFunction: "var(--ease-bounce)" }}
              >
                <span
                  aria-hidden="true"
                  className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30"
                />
                Bắt đầu miễn phí với Google
              </Link>
              <Link
                href="/mini-game"
                className="rounded-full border-2 border-(--color-cocoa)/15 px-8 py-3 text-base font-bold text-(--color-cocoa) transition hover:bg-white"
              >
                Khám phá mini-game 🎲
              </Link>
            </div>

            <div className="relative mt-4 flex w-full max-w-md justify-center gap-6 text-4xl">
              <span className="animate-float" style={{ animationDelay: "0s" }}>🎨</span>
              <span className="animate-float" style={{ animationDelay: "0.6s" }}>✏️</span>
              <span className="animate-twinkle" style={{ animationDelay: "0.3s" }}>🌟</span>
              <span className="animate-float" style={{ animationDelay: "1.1s" }}>🎈</span>
              <span className="animate-twinkle" style={{ animationDelay: "0.9s" }}>✨</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <h2 className="text-center font-display text-2xl font-extrabold text-(--color-cocoa) sm:text-3xl">
            Tiện ích cho lớp học
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)] transition hover:-translate-y-1"
              >
                <IconChip icon={f.icon} tint={TINT_ROTATION[i % 4]} size="lg" />
                <h3 className="font-display text-lg font-bold text-(--color-cocoa)">{f.title}</h3>
                <p className="text-sm text-(--color-cocoa)/65">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mini-game teaser */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <h2 className="font-display text-2xl font-extrabold text-(--color-cocoa) sm:text-3xl">
                🎲 Mini-game: Gọi tên ngẫu nhiên
              </h2>
              <span className="rounded-full bg-(--color-mint) px-3 py-1 text-xs font-bold text-white">
                Miễn phí
              </span>
            </div>
            <p className="mx-auto mt-2 max-w-xl text-center text-(--color-cocoa)/65">
              10 kiểu gọi tên vui nhộn để chọn học sinh lên bảng, dựa trên danh sách lớp thật của
              bạn.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {RANDOM_PICKER_GAMES.map((game, i) => (
                <div
                  key={game.slug}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-(--color-cream) p-4 text-center transition hover:-translate-y-1"
                >
                  <IconChip icon={game.emoji} tint={TINT_ROTATION[i % 4]} size="md" />
                  <span className="text-sm font-bold text-(--color-cocoa)">{game.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/mini-game"
                className="rounded-full border-2 border-(--color-cocoa)/15 px-6 py-2.5 text-sm font-bold text-(--color-cocoa) transition hover:bg-(--color-cream)"
              >
                Xem tất cả mini-game →
              </Link>
              <Link
                href="/signin"
                className="rounded-full bg-(--color-cocoa) px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                Đăng nhập để chơi cùng lớp của bạn →
              </Link>
            </div>
          </div>
        </section>

        {/* Kho học liệu số teaser */}
        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h2 className="font-display text-2xl font-extrabold text-(--color-cocoa) sm:text-3xl">
              📚 Kho học liệu số
            </h2>
            <span className="rounded-full bg-(--color-cream) px-3 py-1 text-xs font-medium text-(--color-cocoa)/60">
              Miễn phí, không cần đăng nhập
            </span>
          </div>
          <p className="mx-auto mt-2 max-w-xl text-center text-(--color-cocoa)/65">
            Thử ngay một đề quiz mẫu, hoặc tải tài liệu do các thầy cô khác chia sẻ.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {sampleAssignments.map((a, i) => (
              <Link
                key={a.id}
                href={`/take/${a.token}`}
                className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-[0_8px_24px_-8px_rgba(62,40,27,0.12)] transition hover:-translate-y-1"
              >
                <IconChip icon="📝" tint={TINT_ROTATION[i % 4]} size="md" />
                <h3 className="font-display font-bold text-(--color-cocoa)">{a.quiz.title}</h3>
                {a.quiz.description && (
                  <p className="text-sm text-(--color-cocoa)/65">{a.quiz.description}</p>
                )}
                <span className="mt-auto text-sm font-bold text-(--color-honey-dark)">
                  {a.quiz._count.questions} câu hỏi · Làm thử ngay →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/kho-hoc-lieu-so"
              className="rounded-full border-2 border-(--color-cocoa)/15 px-6 py-2.5 text-sm font-bold text-(--color-cocoa) transition hover:bg-white"
            >
              Xem toàn bộ kho học liệu số →
            </Link>
          </div>
        </section>

        {/* Promo banner */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
          <div className="animate-gradient-pan relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-honey),var(--color-bloom),var(--color-honey))] px-8 py-10 text-center text-white sm:px-14">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              Sẵn sàng cho một lớp học rộn ràng hơn?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-white/90">
              Tạo tài khoản miễn phí trong 30 giây, không cần thẻ thanh toán.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-base font-bold text-(--color-honey-dark) transition hover:scale-105"
              style={{ transitionTimingFunction: "var(--ease-bounce)" }}
            >
              Bắt đầu miễn phí ngay
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
