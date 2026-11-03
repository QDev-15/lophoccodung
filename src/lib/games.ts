export type GameMeta = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
};

export const RANDOM_PICKER_GAMES: GameMeta[] = [
  {
    slug: "vong-quay",
    name: "Vòng quay may mắn",
    emoji: "🎡",
    description: "Quay vòng tròn tên, kim chỉ dừng ở đâu thì gọi học sinh đó.",
  },
  {
    slug: "hop-qua",
    name: "Hộp quà bí mật",
    emoji: "🎁",
    description: "Chọn một hộp quà để mở ra và xem tên ai được gọi.",
  },
  {
    slug: "rut-the",
    name: "Rút thẻ tên",
    emoji: "🃏",
    description: "Rút một thẻ bài trên cùng để lật mở tên học sinh.",
  },
  {
    slug: "boc-tham",
    name: "Bốc thăm que",
    emoji: "🥢",
    description: "Kéo một que thăm lên để chọn ra học sinh.",
  },
  {
    slug: "ruong-bao-vat",
    name: "Mở rương kho báu",
    emoji: "🧰",
    description: "Mở rương kho báu để tìm ra tên học sinh được gọi.",
  },
  {
    slug: "o-cua-bi-an",
    name: "Ô cửa bí ẩn",
    emoji: "🚪",
    description: "Chọn một ô cửa để mở ra và gọi tên học sinh.",
  },
  {
    slug: "bong-bong-ten",
    name: "Bong bóng tên",
    emoji: "🫧",
    description: "Chạm vỡ một bong bóng để gọi tên học sinh.",
  },
  {
    slug: "xoc-dia",
    name: "Xóc đĩa tên",
    emoji: "🥤",
    description: "Xóc 3 chiếc cốc và xem tên ai xuất hiện.",
  },
  {
    slug: "phi-tieu",
    name: "Phi tiêu trúng tên",
    emoji: "🎯",
    description: "Ném phi tiêu vào bảng tên để chọn học sinh.",
  },
  {
    slug: "vong-xoay-so",
    name: "Vòng xoay số",
    emoji: "🎰",
    description: "Quay dãy tên như máy xổ số, dừng ở đâu gọi tên đó.",
  },
];

export function getGameMeta(slug: string): GameMeta | undefined {
  return RANDOM_PICKER_GAMES.find((g) => g.slug === slug);
}
