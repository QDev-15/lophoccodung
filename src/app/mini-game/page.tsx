import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RANDOM_PICKER_GAMES } from "@/lib/games";
import { ADVENTURE_THEMES } from "@/lib/adventure-themes";
import { BATTLE_THEMES } from "@/lib/battle-themes";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { IconChip } from "@/components/IconChip";

export const metadata = {
  title: "Mini game - Lớp Học Cô Dung",
  description: "Các mini-game vui nhộn cho lớp học: gọi tên ngẫu nhiên, phiêu lưu tri thức, đối kháng tranh tài.",
};

function CategorySection({
  id,
  emoji,
  title,
  description,
  badge,
  children,
}: {
  id: string;
  emoji: string;
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-10">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <h2 className="font-display text-2xl font-extrabold text-(--color-ink)">
          {emoji} {title}
        </h2>
        {badge && (
          <span className="rounded-full bg-(--color-mint) px-3 py-1 text-xs font-bold text-white">
            {badge}
          </span>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-xl text-center text-(--color-ink)/65">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function MiniGamePage() {
  const session = await auth();
  let classId: string | null = null;
  if (session?.user?.id) {
    const latestClass = await prisma.class.findFirst({
      where: { teacherId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    classId = latestClass?.id ?? null;
  }

  function playHref(kind: "goi-len-bang" | "phieu-luu-tri-thuc" | "doi-khang-tranh-tai", slug: string) {
    if (!session) return "/signin";
    if (!classId) return "/classes/new";
    if (kind === "goi-len-bang") return `/classes/${classId}/games/${slug}`;
    return `/classes/${classId}/games/${kind}/${slug}`;
  }

  const categories = [
    { id: "goi-len-bang", label: "Gọi lên bảng" },
    { id: "phieu-luu-tri-thuc", label: "Phiêu lưu tri thức" },
    { id: "doi-khang-tranh-tai", label: "Đối kháng tranh tài" },
    { id: "tro-choi-dan-gian", label: "Trò chơi dân gian" },
    { id: "cong-cu", label: "Công cụ" },
    { id: "camera", label: "Camera" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="px-4 pb-4 pt-12 text-center md:px-6">
          <h1 className="font-display text-3xl font-extrabold text-(--color-ink) sm:text-4xl">
            🎲 Mini game cho lớp học
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-(--color-ink)/65">
            Game có khóa 🔒 cần đăng nhập để chơi cùng danh sách lớp hoặc đề kiểm tra thật của bạn.
            Ô ăn quan, Hẹn giờ, Đo tiếng ồn, Tập thể dục và Nghiêng đầu chơi được ngay, không cần
            đăng nhập.
          </p>
          <nav className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-(--color-ink)/70 hover:bg-(--color-mint-light) hover:text-(--color-mint-dark)"
              >
                {c.label}
              </a>
            ))}
          </nav>
        </section>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <CategorySection
            id="goi-len-bang"
            emoji="🎯"
            title="Gọi lên bảng"
            badge="Miễn phí"
            description={`${RANDOM_PICKER_GAMES.length} kiểu gọi tên ngẫu nhiên vui nhộn để chọn học sinh lên bảng.`}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {RANDOM_PICKER_GAMES.map((g, i) => (
                <GameCard
                  key={g.slug}
                  href={playHref("goi-len-bang", g.slug)}
                  locked={!session}
                  emoji={g.emoji}
                  name={g.name}
                  tint={TINTS[i % TINTS.length]}
                />
              ))}
              <ComingSoonCard emoji="🎲" name="Game mới" />
            </div>
          </CategorySection>

          <CategorySection
            id="phieu-luu-tri-thuc"
            emoji="🗺️"
            title="Phiêu lưu tri thức"
            badge="Miễn phí"
            description={`${ADVENTURE_THEMES.length} hành trình phiêu lưu, mỗi câu trả lời đúng giúp cả lớp tiến thêm một bước.`}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {ADVENTURE_THEMES.map((t) => (
                <GameCard
                  key={t.slug}
                  href={playHref("phieu-luu-tri-thuc", t.slug)}
                  locked={!session}
                  emoji={t.emoji}
                  name={t.name}
                  tint={t.tint}
                />
              ))}
              <ComingSoonCard emoji="🗺️" name="Game mới" />
            </div>
          </CategorySection>

          <CategorySection
            id="doi-khang-tranh-tai"
            emoji="⚔️"
            title="Đối kháng tranh tài"
            badge="Miễn phí"
            description={`${BATTLE_THEMES.length} kiểu thi đấu 2 đội, dùng chung một đề kiểm tra để so tài.`}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {BATTLE_THEMES.map((t) => (
                <GameCard
                  key={t.slug}
                  href={playHref("doi-khang-tranh-tai", t.slug)}
                  locked={!session}
                  emoji={t.emoji}
                  name={t.name}
                  tint={t.tint}
                />
              ))}
              <ComingSoonCard emoji="⚔️" name="Game mới" />
            </div>
          </CategorySection>

          <CategorySection
            id="tro-choi-dan-gian"
            emoji="🏺"
            title="Trò chơi dân gian"
            badge="Miễn phí · Không cần đăng nhập"
            description="Trò chơi dân gian Việt Nam kết hợp luyện tính nhẩm, chơi theo đội ngay trên lớp."
          >
            <div className="flex justify-center">
              <Link
                href="/mini-game/o-an-quan"
                className="flex w-48 flex-col items-center gap-2 rounded-3xl bg-white p-5 text-center shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1"
              >
                <IconChip icon="🟤" tint="peach" size="lg" />
                <span className="font-bold text-(--color-ink)">Ô ăn quan</span>
              </Link>
            </div>
          </CategorySection>

          <CategorySection
            id="cong-cu"
            emoji="🧰"
            title="Công cụ"
            badge="Miễn phí · Không cần đăng nhập"
            description="Công cụ hỗ trợ lớp học, dùng được ngay không cần tài khoản."
          >
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/mini-game/hen-gio"
                className="flex w-48 flex-col items-center gap-2 rounded-3xl bg-white p-5 text-center shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1"
              >
                <IconChip icon="⏰" tint="mint" size="lg" />
                <span className="font-bold text-(--color-ink)">Hẹn giờ lớp học</span>
              </Link>
              <Link
                href="/mini-game/do-tieng-on"
                className="relative flex w-48 flex-col items-center gap-2 rounded-3xl bg-white p-5 text-center shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] transition hover:-translate-y-1"
              >
                <span className="absolute -top-2 right-3 rounded-full bg-(--color-bloom) px-2 py-0.5 text-[10px] font-bold text-white">
                  Mới
                </span>
                <IconChip icon="🔊" tint="lavender" size="lg" />
                <span className="font-bold text-(--color-ink)">Đo tiếng ồn</span>
              </Link>
            </div>
          </CategorySection>

          <CategorySection
            id="camera"
            emoji="📷"
            title="Camera"
            badge="Miễn phí · Không cần đăng nhập"
            description="Trả lời bằng cử chỉ qua webcam, ngay trên trình duyệt."
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Link
                href="/mini-game/tap-the-duc"
                className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center transition hover:-translate-y-1"
              >
                <IconChip icon="🤸" tint="mint" size="md" />
                <span className="text-sm font-bold text-(--color-ink)">Tập thể dục</span>
              </Link>
              <Link
                href="/mini-game/nghieng-dau"
                className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center transition hover:-translate-y-1"
              >
                <IconChip icon="🙆" tint="lavender" size="md" />
                <span className="text-sm font-bold text-(--color-ink)">Nghiêng đầu</span>
              </Link>
              <ComingSoonCard emoji="🕺" name="Game mới" />
            </div>
          </CategorySection>
        </div>

        <section className="px-4 py-14 text-center md:px-6">
          {!session ? (
            <Link
              href="/signin"
              className="inline-block rounded-full bg-(--color-mint) px-8 py-3 text-base font-bold text-white transition hover:bg-(--color-mint-dark)"
            >
              Đăng nhập để chơi cùng lớp của bạn →
            </Link>
          ) : !classId ? (
            <Link
              href="/classes/new"
              className="inline-block rounded-full bg-(--color-mint) px-8 py-3 text-base font-bold text-white transition hover:bg-(--color-mint-dark)"
            >
              Tạo lớp học đầu tiên để chơi →
            </Link>
          ) : (
            <Link
              href={`/classes/${classId}/games`}
              className="inline-block rounded-full bg-(--color-mint) px-8 py-3 text-base font-bold text-white transition hover:bg-(--color-mint-dark)"
            >
              Vào Mini-game của lớp bạn →
            </Link>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

const TINTS = ["mint", "lavender", "peach"] as const;

function GameCard({
  href,
  locked,
  emoji,
  name,
  tint,
}: {
  href: string;
  locked?: boolean;
  emoji: string;
  name: string;
  tint: (typeof TINTS)[number];
}) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center transition hover:-translate-y-1"
    >
      {locked && (
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-(--color-ink)/80 text-xs text-white">
          🔒
        </span>
      )}
      <IconChip icon={emoji} tint={tint} size="md" />
      <span className="text-sm font-bold text-(--color-ink)">{name}</span>
    </Link>
  );
}

function ComingSoonCard({ emoji, name }: { emoji: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-(--color-cloud) p-5 text-center opacity-70">
      <span className="text-3xl grayscale">{emoji}</span>
      <span className="text-sm font-bold text-(--color-ink)/60">{name}</span>
      <span className="rounded-full bg-(--color-ink)/10 px-2 py-0.5 text-[10px] font-bold text-(--color-ink)/50">
        Sắp ra mắt
      </span>
    </div>
  );
}
