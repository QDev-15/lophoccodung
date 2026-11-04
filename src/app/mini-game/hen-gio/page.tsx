import Link from "next/link";

import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

import { TimerClient } from "./TimerClient";

export const metadata = {
  title: "Hẹn giờ lớp học - Lớp Học Cô Dung",
  description: "Công cụ hẹn giờ miễn phí cho lớp học, không cần đăng nhập.",
};

export default function TimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-12 md:px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-(--color-ink)">
            ⏰ Hẹn giờ lớp học
          </h1>
          <p className="mt-2 text-(--color-ink)/65">
            Công cụ hẹn giờ miễn phí, không cần đăng nhập — dùng cho hoạt động nhóm, kiểm tra nhanh.
          </p>
        </div>

        <div className="mt-10">
          <TimerClient />
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
