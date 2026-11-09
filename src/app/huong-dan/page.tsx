import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { IconChip } from "@/components/IconChip";

export const metadata = {
  title: "Hướng dẫn sử dụng - Lớp Học Cô Dung",
  description: "Hướng dẫn từng bước sử dụng Lớp Học Cô Dung.",
};

type Guide = { title: string; steps: string[] };
type Group = { id: string; title: string; icon: string; guides: Guide[] };

const GROUPS: Group[] = [
  {
    id: "bat-dau",
    title: "Bắt đầu",
    icon: "🚪",
    guides: [
      {
        title: "Đăng nhập bằng tài khoản Google",
        steps: [
          "Vào trang chủ, bấm \"Đăng nhập\"",
          "Chọn tài khoản Google của bạn",
          "Cho phép ứng dụng truy cập để tạo tài khoản giáo viên",
          "Bạn sẽ được chuyển vào trang Tổng quan",
        ],
      },
      {
        title: "Làm quen với giao diện",
        steps: [
          "\"Lớp học\": quản lý danh sách lớp và học sinh",
          "\"Đề kiểm tra\": tạo và chỉnh sửa bộ đề",
          "\"Bài đã giao\": theo dõi bài đã giao và kết quả",
          "\"Học liệu\": tải lên và quản lý tài liệu chia sẻ",
        ],
      },
    ],
  },
  {
    id: "lop-hoc-sinh",
    title: "Lớp và học sinh",
    icon: "🧑‍🤝‍🧑",
    guides: [
      {
        title: "Tạo lớp học mới",
        steps: [
          "Vào \"Lớp học\" → bấm \"Tạo lớp mới\"",
          "Nhập tên lớp, mô tả (không bắt buộc)",
          "Bấm \"Tạo lớp\" để hoàn tất",
        ],
      },
      {
        title: "Thêm học sinh thủ công",
        steps: [
          "Vào trang chi tiết lớp",
          "Nhập họ tên và mã học sinh (không bắt buộc) ở mục \"Thêm học sinh\"",
          "Bấm \"Thêm\"",
        ],
      },
      {
        title: "Nhập danh sách học sinh từ Excel",
        steps: [
          "Vào trang chi tiết lớp → bấm \"Nhập từ Excel\"",
          "Chọn file Excel (.xlsx, .xls) và bấm \"Xem trước\"",
          "Kiểm tra các dòng hợp lệ/lỗi trong bảng xem trước",
          "Bấm \"Xác nhận nhập\" để thêm các học sinh hợp lệ vào lớp",
        ],
      },
    ],
  },
  {
    id: "bo-de-bai-giao",
    title: "Bộ đề và bài giao",
    icon: "📝",
    guides: [
      {
        title: "Tạo đề kiểm tra",
        steps: [
          "Vào \"Đề kiểm tra\" → bấm \"Tạo đề mới\"",
          "Đặt tên đề, thời gian làm bài (không bắt buộc)",
          "Thêm câu hỏi: trắc nghiệm, đúng/sai, hoặc điền từ",
          "Bấm \"Lưu đề\"",
        ],
      },
      {
        title: "Giao bài cho lớp qua link",
        steps: [
          "Mở đề kiểm tra đã tạo → bấm \"Giao đề cho lớp\"",
          "Chọn lớp, tùy chỉnh thời gian/số lần nộp nếu cần",
          "Hệ thống tạo một link làm bài riêng, gửi link này cho học sinh",
        ],
      },
      {
        title: "Học sinh làm bài thế nào",
        steps: [
          "Học sinh mở link được giao, không cần tài khoản",
          "Nhập họ tên để bắt đầu làm bài",
          "Làm bài trong thời gian quy định (nếu có) rồi bấm \"Nộp bài\"",
          "Hệ thống chấm điểm tự động ngay khi nộp",
        ],
      },
      {
        title: "Xem kết quả và chi tiết từng câu",
        steps: [
          "Vào \"Bài đã giao\" → chọn bài cần xem",
          "Xem bảng điểm tổng hợp của cả lớp",
          "Bấm vào một học sinh để xem chi tiết từng câu đúng/sai",
        ],
      },
    ],
  },
  {
    id: "mini-game",
    title: "Mini game: Gọi tên ngẫu nhiên",
    icon: "🎲",
    guides: [
      {
        title: "Vào mini-game từ trang lớp học",
        steps: [
          "Vào trang chi tiết một lớp đã có học sinh",
          "Bấm \"🎲 Gọi tên ngẫu nhiên\"",
          "Chọn 1 trong 10 kiểu gọi tên để bắt đầu",
        ],
      },
      {
        title: "10 kiểu gọi tên ngẫu nhiên",
        steps: [
          "Vòng quay may mắn, Hộp quà bí mật, Rút thẻ tên, Bốc thăm que, Mở rương kho báu",
          "Ô cửa bí ẩn, Bong bóng tên, Xóc đĩa tên, Phi tiêu trúng tên, Vòng xoay số",
          "Mỗi học sinh chỉ được gọi một lần cho đến khi bấm \"Làm mới toàn bộ\"",
        ],
      },
    ],
  },
  {
    id: "kho-hoc-lieu",
    title: "Kho học liệu số",
    icon: "📚",
    guides: [
      {
        title: "Thử quiz mẫu không cần đăng nhập",
        steps: [
          "Vào trang \"Kho học liệu số\"",
          "Chọn một quiz trong mục \"Quiz thử trải nghiệm\"",
          "Làm thử để xem trải nghiệm học sinh sẽ thấy khi làm bài",
        ],
      },
      {
        title: "Tải tài liệu lên chia sẻ",
        steps: [
          "Đăng nhập, vào \"Học liệu\"",
          "Điền tiêu đề, danh mục, mô tả và chọn file (tối đa 20MB)",
          "Bấm \"Tải lên & chia sẻ\" — tài liệu sẽ hiện ngay trong Kho học liệu số cho mọi người",
        ],
      },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 md:px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-(--color-ink)">
            Hướng dẫn sử dụng
          </h1>
          <p className="mt-1 text-(--color-ink)/65">Từng bước ngắn gọn cho từng tính năng.</p>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-2">
          {GROUPS.map((g, i) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                [
                  "bg-(--color-mint-light) text-(--color-mint-dark)",
                  "bg-violet-100 text-(--color-lavender)",
                  "bg-emerald-50 text-(--color-peach)",
                ][i % 3]
              }`}
            >
              <span>{g.icon}</span>
              {g.title}
            </a>
          ))}
        </nav>

        <div className="mt-10 flex flex-col gap-12">
          {GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-20">
              <div className="flex items-center gap-3">
                <IconChip icon={g.icon} tint="mint" size="md" />
                <h2 className="font-display text-xl font-bold text-(--color-ink)">{g.title}</h2>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {g.guides.map((guide) => (
                  <div
                    key={guide.title}
                    className="rounded-3xl bg-white p-5 shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)]"
                  >
                    <h3 className="font-display font-bold text-(--color-ink)">{guide.title}</h3>
                    <ol className="mt-3 flex flex-col gap-2">
                      {guide.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-(--color-ink)/75">
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--color-mint) text-[11px] font-bold text-white">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
