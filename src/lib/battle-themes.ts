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
];

export function getBattleTheme(slug: string): BattleTheme | undefined {
  return BATTLE_THEMES.find((t) => t.slug === slug);
}
