export type Tint = "honey" | "mint" | "sky" | "lavender";

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
    tint: "honey",
  },
  {
    slug: "khinh-khi-cau",
    name: "Khinh khí cầu phiêu lưu",
    emoji: "🎈",
    description: "Bay khinh khí cầu qua từng đảo mây.",
    mascot: "🎈",
    stepIcon: "☁️",
    finishIcon: "🌈",
    tint: "sky",
  },
  {
    slug: "vuon-hoa-diem-thuong",
    name: "Vườn hoa điểm thưởng",
    emoji: "🐝",
    description: "Mỗi câu đúng nở thêm một bông hoa trong vườn.",
    mascot: "🐝",
    stepIcon: "🌱",
    finishIcon: "💐",
    tint: "lavender",
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
    tint: "honey",
  },
  {
    slug: "chuyen-tau-tri-thuc",
    name: "Chuyến tàu tri thức",
    emoji: "🚂",
    description: "Đi tàu qua từng nhà ga kiến thức.",
    mascot: "🚂",
    stepIcon: "🚉",
    finishIcon: "🎉",
    tint: "sky",
  },
  {
    slug: "dao-kho-bau",
    name: "Đảo kho báu",
    emoji: "🏴‍☠️",
    description: "Dò từng bước chân trên bản đồ để tìm kho báu.",
    mascot: "🏴‍☠️",
    stepIcon: "🌴",
    finishIcon: "💰",
    tint: "honey",
  },
  {
    slug: "buom-tim-hoa",
    name: "Bướm tìm hoa",
    emoji: "🦋",
    description: "Dẫn đường cho bướm bay từ hoa này sang hoa khác.",
    mascot: "🦋",
    stepIcon: "🌼",
    finishIcon: "🌺",
    tint: "mint",
  },
];

export function getAdventureTheme(slug: string): AdventureTheme | undefined {
  return ADVENTURE_THEMES.find((t) => t.slug === slug);
}
