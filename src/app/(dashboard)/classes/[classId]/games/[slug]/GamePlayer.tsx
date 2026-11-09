"use client";

import Link from "next/link";

import type { GameMeta } from "@/lib/games";
import { IconChip } from "@/components/IconChip";
import { usePicker, type PickerStudent } from "../usePicker";

import { WheelGame } from "./_games/WheelGame";
import { GiftBoxGame } from "./_games/GiftBoxGame";
import { CardDrawGame } from "./_games/CardDrawGame";
import { StickDrawGame } from "./_games/StickDrawGame";
import { TreasureChestGame } from "./_games/TreasureChestGame";
import { DoorGame } from "./_games/DoorGame";
import { BubbleGame } from "./_games/BubbleGame";
import { CupShuffleGame } from "./_games/CupShuffleGame";
import { DartGame } from "./_games/DartGame";
import { SlotReelGame } from "./_games/SlotReelGame";

export type GameComponentProps = {
  remaining: PickerStudent[];
  pick: ReturnType<typeof usePicker>["pick"];
  isExhausted: boolean;
};

const GAME_COMPONENTS: Record<string, React.ComponentType<GameComponentProps>> = {
  "vong-quay": WheelGame,
  "hop-qua": GiftBoxGame,
  "rut-the": CardDrawGame,
  "boc-tham": StickDrawGame,
  "ruong-bao-vat": TreasureChestGame,
  "o-cua-bi-an": DoorGame,
  "bong-bong-ten": BubbleGame,
  "xoc-dia": CupShuffleGame,
  "phi-tieu": DartGame,
  "vong-xoay-so": SlotReelGame,
  "khu-tu-tri": SlotReelGame,
  "ho-lo-bien-hinh": CupShuffleGame,
  "nhay-bao-bo": StickDrawGame,
  "di-ca-kheo": DartGame,
  "ca-sau-len-bo": DoorGame,
  "bit-mat-bat-de": BubbleGame,
  "ban-can-tu-than": WheelGame,
  stickman: CardDrawGame,
  "cay-cau-sinh-ton": GiftBoxGame,
  "trum-ba-khi": TreasureChestGame,
  "dua-bi": SlotReelGame,
  ufo: DoorGame,
  "bap-rang-bo": BubbleGame,
};

export function GamePlayer({
  classId,
  className,
  game,
  students,
}: {
  classId: string;
  className: string;
  game: GameMeta;
  students: PickerStudent[];
}) {
  const { remaining, history, pick, reset, total } = usePicker(students);
  const isExhausted = remaining.length === 0;
  const GameComponent = GAME_COMPONENTS[game.slug];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconChip icon={game.emoji} tint="mint" size="xl" />
          <div>
            <h1 className="font-display flex items-center gap-2 text-2xl font-extrabold text-(--color-ink)">
              {game.name}
              <span className="animate-wiggle text-3xl">🧒</span>
            </h1>
            <p className="mt-0.5 text-sm text-(--color-ink)/60">Lớp {className}</p>
          </div>
        </div>
        <Link
          href={`/classes/${classId}/games`}
          className="rounded-full border-2 border-(--color-ink)/15 bg-white px-4 py-2 text-sm font-bold text-(--color-ink) transition hover:-translate-y-0.5 hover:bg-(--color-cloud)"
        >
          Chọn game khác
        </Link>
      </div>

      {total === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-5 text-sm font-bold text-(--color-ink)/60 shadow-[0_4px_12px_-4px_rgba(46,42,33,0.15)]">
          Lớp này chưa có học sinh nào. Hãy thêm học sinh trước khi chơi.
        </p>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between rounded-full bg-white px-5 py-3 text-sm shadow-[0_4px_12px_-4px_rgba(46,42,33,0.15)]">
            <span className="font-bold text-(--color-ink)/70">
              Còn lại <span className="text-(--color-mint-dark)">{remaining.length}</span> / {total} học
              sinh
            </span>
            <button
              onClick={reset}
              className="font-bold text-(--color-lavender) transition hover:underline"
            >
              Làm mới toàn bộ
            </button>
          </div>

          {isExhausted && (
            <p className="animate-pop-in mt-4 rounded-2xl bg-(--color-sun)/20 px-4 py-3 text-sm font-bold text-(--color-sun-dark)">
              🎉 Đã gọi hết cả lớp! Bấm &quot;Làm mới toàn bộ&quot; để chơi lại.
            </p>
          )}

          <div className="mt-6">
            {GameComponent ? (
              <GameComponent remaining={remaining} pick={pick} isExhausted={isExhausted} />
            ) : (
              <p className="rounded-2xl bg-white p-5 text-sm font-bold text-(--color-bloom) shadow-[0_4px_12px_-4px_rgba(46,42,33,0.15)]">
                Không tìm thấy game này.
              </p>
            )}
          </div>

          {history.length > 0 && (
            <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_4px_12px_-4px_rgba(46,42,33,0.15)]">
              <h2 className="font-display text-sm font-extrabold text-(--color-ink)">
                Đã gọi ({history.length})
              </h2>
              <ol className="mt-3 flex flex-wrap gap-2">
                {history.map((s, i) => (
                  <li
                    key={`${s.id}-${i}`}
                    className="rounded-full bg-(--color-cloud) px-3 py-1 text-xs font-bold text-(--color-ink)/70"
                  >
                    {history.length - i}. {s.fullName}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  );
}
