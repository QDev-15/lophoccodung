import type { Tint } from "./adventure-themes";

export type BattleTheme = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  tint: Tint;
};

export const BATTLE_THEMES: BattleTheme[] = [
  {
    slug: "dai-chien-hai-doi",
    name: "Đại chiến hai đội",
    emoji: "⚔️",
    description: "Hai đội so tài trả lời nhanh, đúng để ghi điểm.",
    tint: "mint",
  },
  {
    slug: "duong-dua-toc-do",
    name: "Đường đua tốc độ",
    emoji: "🏃",
    description: "Mỗi câu đúng giúp đội tiến thêm một bước trên đường đua.",
    tint: "lavender",
  },
  {
    slug: "leo-dinh-tri-tue",
    name: "Leo đỉnh trí tuệ",
    emoji: "🧗",
    description: "Hai đội thi leo núi bằng những câu trả lời chính xác.",
    tint: "peach",
  },
  {
    slug: "vong-loai-thu-thach",
    name: "Vòng loại thử thách",
    emoji: "🎯",
    description: "Thử thách loại trực tiếp, trả lời sai sẽ bị loại khỏi vòng.",
    tint: "mint",
  },
  {
    slug: "tranh-cup-vo-dich",
    name: "Tranh cúp vô địch",
    emoji: "🏆",
    description: "So tài giành chiếc cúp vô địch của lớp.",
    tint: "lavender",
  },
  {
    slug: "vua-toc-do",
    name: "Vua Tốc Độ",
    emoji: "🏎️",
    description: "Hai đội đua trả lời nhanh để giành ngôi vua tốc độ.",
    tint: "peach",
  },
  {
    slug: "dai-chien-tri-tue",
    name: "Đại Chiến Trí Tuệ",
    emoji: "🧠",
    description: "Hai đội đối đầu trong cuộc đại chiến trí tuệ đầy gay cấn.",
    tint: "mint",
  },
  {
    slug: "dai-chien-leo-nui",
    name: "Đại Chiến Leo Núi",
    emoji: "⛰️",
    description: "Hai đội thi leo núi bằng các phép cộng trong 100.",
    tint: "lavender",
  },
  {
    slug: "chinh-phuc-dinh-nui",
    name: "Chinh Phục Đỉnh Núi",
    emoji: "🏔️",
    description: "Chinh phục đỉnh núi cao nhất bằng các phép cộng trong 100.",
    tint: "peach",
  },
];

export function getBattleTheme(slug: string): BattleTheme | undefined {
  return BATTLE_THEMES.find((t) => t.slug === slug);
}
