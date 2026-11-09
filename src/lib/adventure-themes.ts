export type Tint = "mint" | "lavender" | "peach";

export type TintStyle = {
  text: string;
  bg: string;
  bgLight: string;
  ring: string;
  gradient: string;
  shadowDark: string;
  blob: string;
};

// Shared tint→style lookup reused by both the adventure and battle engines
// (and by every per-theme scene component) so color treatment stays
// consistent across the whole mini-game catalog.
export const TINT_STYLES: Record<Tint, TintStyle> = {
  mint: {
    text: "text-(--color-mint-dark)",
    bg: "bg-(--color-mint)",
    bgLight: "bg-(--color-mint-light)",
    ring: "ring-(--color-mint-dark)",
    gradient: "from-(--color-mint) to-(--color-mint-dark)",
    shadowDark: "var(--color-mint-dark)",
    blob: "bg-(--color-mint-light)",
  },
  lavender: {
    text: "text-(--color-lavender)",
    bg: "bg-(--color-lavender)",
    bgLight: "bg-violet-100",
    ring: "ring-(--color-lavender)",
    gradient: "from-(--color-lavender) to-[#5b21b6]",
    shadowDark: "#5b21b6",
    blob: "bg-violet-100",
  },
  peach: {
    text: "text-(--color-peach)",
    bg: "bg-(--color-peach)",
    bgLight: "bg-emerald-50",
    ring: "ring-(--color-peach)",
    gradient: "from-(--color-peach) to-[#065f46]",
    shadowDark: "#065f46",
    blob: "bg-emerald-50",
  },
};

export type AdventureTheme = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  mascot: string;
  stepIcon: string;
  finishIcon: string;
  tint: Tint;
};

export const ADVENTURE_THEMES: AdventureTheme[] = [
  {
    slug: "ech-qua-dam-sen",
    name: "Ếch qua đầm sen",
    emoji: "🐸",
    description: "Giúp chú ếch nhảy qua từng lá sen bằng cách trả lời đúng.",
    mascot: "🐸",
    stepIcon: "🪷",
    finishIcon: "🌸",
    tint: "mint",
  },
  {
    slug: "nhay-o-vuong",
    name: "Nhảy ô vuông",
    emoji: "🧒",
    description: "Nhảy lò cò qua từng ô số để về đích.",
    mascot: "🧒",
    stepIcon: "⬜",
    finishIcon: "🏁",
    tint: "lavender",
  },
  {
    slug: "khinh-khi-cau",
    name: "Khinh khí cầu phiêu lưu",
    emoji: "🎈",
    description: "Bay khinh khí cầu qua từng đảo mây.",
    mascot: "🎈",
    stepIcon: "☁️",
    finishIcon: "🌈",
    tint: "peach",
  },
  {
    slug: "vuon-hoa-diem-thuong",
    name: "Vườn hoa điểm thưởng",
    emoji: "🐝",
    description: "Mỗi câu đúng nở thêm một bông hoa trong vườn.",
    mascot: "🐝",
    stepIcon: "🌱",
    finishIcon: "💐",
    tint: "mint",
  },
  {
    slug: "du-hanh-vu-tru",
    name: "Du hành vũ trụ",
    emoji: "🚀",
    description: "Lái tàu vũ trụ ghé thăm từng hành tinh tri thức.",
    mascot: "🚀",
    stepIcon: "🪐",
    finishIcon: "⭐",
    tint: "lavender",
  },
  {
    slug: "leo-nui-chinh-phuc",
    name: "Leo núi chinh phục",
    emoji: "🧗",
    description: "Leo từng mỏm đá để chinh phục đỉnh núi.",
    mascot: "🧗",
    stepIcon: "🪨",
    finishIcon: "🏔️",
    tint: "peach",
  },
  {
    slug: "chuyen-tau-tri-thuc",
    name: "Chuyến tàu tri thức",
    emoji: "🚂",
    description: "Đi tàu qua từng nhà ga kiến thức.",
    mascot: "🚂",
    stepIcon: "🚉",
    finishIcon: "🎉",
    tint: "mint",
  },
  {
    slug: "dao-kho-bau",
    name: "Đảo kho báu",
    emoji: "🏴‍☠️",
    description: "Dò từng bước chân trên bản đồ để tìm kho báu.",
    mascot: "🏴‍☠️",
    stepIcon: "🌴",
    finishIcon: "💰",
    tint: "lavender",
  },
  {
    slug: "buom-tim-hoa",
    name: "Bướm tìm hoa",
    emoji: "🦋",
    description: "Dẫn đường cho bướm bay từ hoa này sang hoa khác.",
    mascot: "🦋",
    stepIcon: "🌼",
    finishIcon: "🌺",
    tint: "peach",
  },
  {
    slug: "tay-cau-sieu-dang",
    name: "Tay Câu Siêu Đẳng",
    emoji: "🎣",
    description: "Câu từng chú cá mang đáp án đúng để về đích.",
    mascot: "🎣",
    stepIcon: "🐟",
    finishIcon: "🏆",
    tint: "mint",
  },
  {
    slug: "o-cua-tuoi-tho",
    name: "Ô Cửa Tuổi Thơ",
    emoji: "🚪",
    description: "Mở từng ô cửa tuổi thơ để khám phá điều bất ngờ phía sau.",
    mascot: "🧒",
    stepIcon: "🚪",
    finishIcon: "🎉",
    tint: "lavender",
  },
  {
    slug: "tiem-sinh-to",
    name: "Tiệm Sinh Tố",
    emoji: "🥤",
    description: "Pha từng cốc sinh tố khi trả lời đúng để mở tiệm thành công.",
    mascot: "🧑‍🍳",
    stepIcon: "🍓",
    finishIcon: "🥳",
    tint: "peach",
  },
  {
    slug: "anh-hung-vuot-ai",
    name: "Anh Hùng Vượt Ải",
    emoji: "🦸",
    description: "Vượt qua từng cửa ải để trở thành anh hùng của lớp.",
    mascot: "🦸",
    stepIcon: "🛡️",
    finishIcon: "👑",
    tint: "mint",
  },
  {
    slug: "du-hanh-thoi-gian",
    name: "Du Hành Thời Gian",
    emoji: "⏳",
    description: "Du hành qua từng mốc thời gian bằng những câu trả lời chính xác.",
    mascot: "🕰️",
    stepIcon: "⌛",
    finishIcon: "🌌",
    tint: "lavender",
  },
  {
    slug: "chuyen-xe-yeu-thuong",
    name: "Chuyến Xe Yêu Thương",
    emoji: "🚌",
    description: "Lên chuyến xe yêu thương, mỗi câu đúng đi thêm một chặng đường.",
    mascot: "🚌",
    stepIcon: "🛣️",
    finishIcon: "💝",
    tint: "peach",
  },
  {
    slug: "sieu-thi-rau-cu",
    name: "Siêu Thị Rau Củ 4.0",
    emoji: "🥦",
    description: "Thu thập từng giỏ rau củ thông minh khi trả lời đúng.",
    mascot: "🤖",
    stepIcon: "🛒",
    finishIcon: "🏪",
    tint: "mint",
  },
];

export function getAdventureTheme(slug: string): AdventureTheme | undefined {
  return ADVENTURE_THEMES.find((t) => t.slug === slug);
}
