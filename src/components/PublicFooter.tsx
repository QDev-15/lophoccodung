import Link from "next/link";

const SUPPORT_EMAIL = "ho-tro@lophoccodung.vn";

export function PublicFooter() {
  return (
    <footer className="border-t border-(--color-cocoa)/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-(--color-cocoa)">
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-violet-400 to-pink-400 text-base">
              🧸
            </span>
            Lớp Học Cô Dung
          </Link>
          <p className="max-w-xs text-sm text-(--color-cocoa)/60">
            Không gian lớp học ấm áp cho thầy cô tiểu học — quản lý lớp, tạo đề, chấm điểm và chơi
            cùng học sinh.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-bold text-(--color-cocoa)">Khám phá</span>
          <Link href="/kho-hoc-lieu-so" className="text-(--color-cocoa)/70 hover:text-(--color-honey-dark)">
            Kho học liệu số
          </Link>
          <Link href="/bang-gia" className="text-(--color-cocoa)/70 hover:text-(--color-honey-dark)">
            Bảng giá
          </Link>
          <Link href="/huong-dan" className="text-(--color-cocoa)/70 hover:text-(--color-honey-dark)">
            Hướng dẫn sử dụng
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-bold text-(--color-cocoa)">Hỗ trợ &amp; liên hệ</span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-(--color-cocoa)/70 hover:text-(--color-honey-dark)">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-(--color-cocoa)/10 py-4 text-center text-xs text-(--color-cocoa)/50">
        © {new Date().getFullYear()} Lớp Học Cô Dung. Được tạo với 💛 cho thầy cô tiểu học.
      </div>
    </footer>
  );
}
