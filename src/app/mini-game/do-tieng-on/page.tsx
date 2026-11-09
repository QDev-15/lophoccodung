import Link from "next/link";

import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

import { NoiseMeterClient } from "./NoiseMeterClient";

export const metadata = {
  title: "Đo tiếng ồn - Lớp Học Cô Dung",
  description: "Công cụ đo mức độ ồn của lớp học qua micro, miễn phí và không cần đăng nhập.",
};

export default function NoiseMeterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-12 md:px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-(--color-ink)">
            🔊 Đo tiếng ồn lớp học
          </h1>
          <p className="mt-2 text-(--color-ink)/65">
            Bật micro để theo dõi mức ồn của lớp theo thời gian thực — giúp giữ trật tự trong các
            hoạt động nhóm.
          </p>
        </div>

        <div className="mt-10">
          <NoiseMeterClient />
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
