import Link from "next/link";

import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

import { HeadTiltClient } from "./HeadTiltClient";

export const metadata = {
  title: "Nghiêng đầu - Lớp Học Cô Dung",
  description: "Game phản xạ qua camera, miễn phí và không cần đăng nhập.",
};

export default function HeadTiltPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-12 md:px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-(--color-ink)">
            🙆 Nghiêng đầu
          </h1>
          <p className="mt-2 text-(--color-ink)/65">
            Bật camera, lắng nghe lệnh và nghiêng người đúng hướng trước khi hết giờ mỗi lượt.
          </p>
        </div>

        <div className="mt-10">
          <HeadTiltClient />
        </div>

        <Link
          href="/mini-game"
          className="mt-10 text-sm font-bold text-(--color-ink)/60 hover:text-(--color-mint-dark)"
        >
          ← Xem tất cả mini-game
        </Link>
      </main>

      <PublicFooter />
    </div>
  );
}
