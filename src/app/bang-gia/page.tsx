import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { IconChip } from "@/components/IconChip";

export const metadata = {
  title: "Bảng giá - Lớp Học Cô Dung",
  description: "Các gói sử dụng của Lớp Học Cô Dung.",
};

const SUPPORT_EMAIL = "ho-tro@lophoccodung.vn";

type Plan = {
  name: string;
  icon: string;
  price: string;
  badge?: { label: string; tone: "mint" | "lavender" };
  limits: { label: string; value: string }[];
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Cơ bản",
    icon: "🌱",
    price: "Miễn phí",
    limits: [
      { label: "Lớp học", value: "1" },
      { label: "Bộ đề", value: "2" },
      { label: "Bài giao", value: "2" },
      { label: "Bài làm lưu trữ", value: "100" },
    ],
    features: [
      "Quản lý lớp & học sinh, nhập danh sách từ Excel",
      "Tạo đề kiểm tra, giao bài qua link, chấm điểm tự động",
      "Một số game trong nhóm Gọi lên bảng",
      "Kho học liệu số: xem và tải tài liệu miễn phí",
    ],
  },
  {
    name: "Pro",
    icon: "🌻",
    price: "Liên hệ",
    badge: { label: "🔥 Phổ biến", tone: "mint" },
    limits: [
      { label: "Lớp học", value: "5" },
      { label: "Bộ đề", value: "10" },
      { label: "Bài giao", value: "20" },
      { label: "Bài làm lưu trữ", value: "1.000" },
    ],
    features: [
      "Toàn bộ gói Cơ bản",
      "Mở khóa toàn bộ game trong nhóm Gọi lên bảng",
      "Hỗ trợ qua email khi cần",
    ],
  },
  {
    name: "Pro Max",
    icon: "🌟",
    price: "Liên hệ",
    badge: { label: "✨ Cao cấp", tone: "lavender" },
    limits: [
      { label: "Lớp học", value: "10" },
      { label: "Bộ đề", value: "30" },
      { label: "Bài giao", value: "60" },
      { label: "Bài làm lưu trữ", value: "3.000" },
    ],
    features: ["Toàn bộ gói Pro", "Hỗ trợ ưu tiên"],
  },
  {
    name: "Theo yêu cầu",
    icon: "🏫",
    price: "Liên hệ",
    limits: [
      { label: "Lớp học", value: "Tùy nhu cầu" },
      { label: "Bộ đề", value: "Tùy nhu cầu" },
      { label: "Bài giao", value: "Tùy nhu cầu" },
      { label: "Bài làm lưu trữ", value: "Tùy nhu cầu" },
    ],
    features: ["Toàn bộ gói Pro Max", "Giới hạn mở rộng theo nhu cầu trường/nhóm", "Hỗ trợ ưu tiên cao nhất"],
  },
];

const BADGE_CLASSES = {
  mint: "bg-(--color-mint) text-white",
  lavender: "bg-(--color-lavender) text-white",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-(--color-ink)">Bảng giá</h1>
          <p className="mx-auto mt-2 max-w-lg text-(--color-ink)/65">
            Dùng miễn phí ở gói Cơ bản. Cần nâng cấp? Liên hệ trực tiếp, không cần thẻ thanh toán.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_8px_24px_-8px_rgba(46,42,33,0.12)] ${
                plan.badge?.tone === "lavender" ? "ring-2 ring-(--color-lavender)" : ""
              }`}
            >
              {plan.badge && (
                <span
                  className={`absolute -top-3 right-5 rounded-full px-3 py-1 text-xs font-bold ${BADGE_CLASSES[plan.badge.tone]}`}
                >
                  {plan.badge.label}
                </span>
              )}

              <IconChip icon={plan.icon} tint={plan.badge?.tone === "lavender" ? "lavender" : "mint"} size="lg" />

              <div>
                <h2 className="font-display text-lg font-bold text-(--color-ink)">{plan.name}</h2>
                <p className="mt-1 text-2xl font-extrabold text-(--color-mint-dark)">{plan.price}</p>
              </div>

              <ul className="flex flex-col gap-1 text-sm text-(--color-ink)/70">
                {plan.limits.map((l) => (
                  <li key={l.label} className="flex justify-between">
                    <span>{l.label}</span>
                    <span className="font-bold text-(--color-ink)">{l.value}</span>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-1 flex-col gap-2 text-sm text-(--color-ink)/70">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-(--color-mint)">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Nâng cấp gói ${plan.name}`)}`}
                className={`mt-auto rounded-full px-5 py-2.5 text-center text-sm font-bold transition ${
                  plan.price === "Miễn phí"
                    ? "bg-(--color-mint) text-white hover:bg-(--color-mint-dark)"
                    : "border-2 border-(--color-ink)/15 text-(--color-ink) hover:bg-(--color-cloud)"
                }`}
              >
                {plan.price === "Miễn phí" ? "Bắt đầu dùng" : "Liên hệ nâng cấp"}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-(--color-mint-light) p-6 text-sm text-(--color-ink)/80">
          <p className="font-display font-bold text-(--color-ink)">Cách nâng cấp</p>
          <p className="mt-1">
            Gửi email tới{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-(--color-mint-dark) hover:underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            kèm email đăng nhập và gói bạn muốn nâng cấp. Giới hạn mới sẽ áp dụng ngay khi được
            duyệt, không cần đăng nhập lại.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
