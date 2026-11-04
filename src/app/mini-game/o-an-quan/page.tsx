import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

import { OAnQuanGame } from "./OAnQuanGame";

export const metadata = {
  title: "Ô Ăn Quan - Lớp Học Cô Dung",
  description: "Trò chơi dân gian Ô Ăn Quan kết hợp luyện tính nhẩm, chơi theo đội, không cần đăng nhập.",
};

export default function OAnQuanPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6">
        <OAnQuanGame />
      </main>

      <PublicFooter />
    </div>
  );
}
