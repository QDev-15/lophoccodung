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
  {
    slug: "khu-tu-tri",
    name: "Khu Tự Trị",
    emoji: "🏯",
    description: "Thử thách tốc độ — ai nhanh tay sẽ được gọi tên trước.",
  },
  {
    slug: "ho-lo-bien-hinh",
    name: "Hồ Lô Biến Hình",
    emoji: "🏺",
    description: "Xáo trộn các hồ lô, hồ lô cuối cùng còn lại sẽ lộ ra tên học sinh.",
  },
  {
    slug: "nhay-bao-bo",
    name: "Nhảy Bao Bố",
    emoji: "🛍️",
    description: "Trò chơi dân gian nhảy bao bố — kéo một bao để lộ tên học sinh.",
  },
  {
    slug: "di-ca-kheo",
    name: "Đi Cà Kheo",
    emoji: "🦵",
    description: "Ném phi tiêu như đi cà kheo để chọn ra học sinh.",
  },
  {
    slug: "ca-sau-len-bo",
    name: "Cá Sấu Lên Bờ",
    emoji: "🐊",
    description: "Chọn một bờ an toàn để thoát khỏi cá sấu và lộ tên học sinh.",
  },
  {
    slug: "bit-mat-bat-de",
    name: "Bịt Mắt Bắt Dê",
    emoji: "🐐",
    description: "Bắt một 'con dê' bí ẩn giữa vòng tròn để lộ tên học sinh.",
  },
  {
    slug: "ban-can-tu-than",
    name: "Bàn Cân Tử Thần",
    emoji: "⚖️",
    description: "Cán cân số phận quay vòng, dừng ở đâu gọi tên đó.",
  },
  {
    slug: "stickman",
    name: "Stickman",
    emoji: "🏃",
    description: "Cuộc đua stickman — rút một lá để xem ai về đích trước.",
  },
  {
    slug: "cay-cau-sinh-ton",
    name: "Cây Cầu Sinh Tồn",
    emoji: "🌉",
    description: "Chọn một tấm ván an toàn trên cây cầu để lộ tên học sinh.",
  },
  {
    slug: "trum-ba-khi",
    name: "Trùm Bá Khí",
    emoji: "👑",
    description: "Mở rương của trùm để xem ai được phong làm người được gọi.",
  },
  {
    slug: "dua-bi",
    name: "Đua Bi",
    emoji: "🔵",
    description: "Cuộc đua bi tốc độ, dừng ở đâu gọi tên đó.",
  },
  {
    slug: "ufo",
    name: "UFO",
    emoji: "🛸",
    description: "UFO hạ cánh trước một ô cửa bí ẩn và tiết lộ tên học sinh.",
  },
  {
    slug: "bap-rang-bo",
    name: "Bắp Rang Bơ",
    emoji: "🍿",
    description: "Bắp nổ tung trong chảo — chạm vỡ một hạt để lộ tên học sinh.",
  },
];

export function getGameMeta(slug: string): GameMeta | undefined {
  return RANDOM_PICKER_GAMES.find((g) => g.slug === slug);
}
