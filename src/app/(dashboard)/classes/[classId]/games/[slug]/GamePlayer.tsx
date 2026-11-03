"use client";

import Link from "next/link";

import type { GameMeta } from "@/lib/games";
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
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {game.emoji} {game.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Lớp {className}</p>
        </div>
        <Link
          href={`/classes/${classId}/games`}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Chọn game khác
        </Link>
      </div>

      {total === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          Lớp này chưa có học sinh nào. Hãy thêm học sinh trước khi chơi.
        </p>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm">
            <span className="text-zinc-600">
              Còn lại <span className="font-semibold text-zinc-900">{remaining.length}</span> /{" "}
              {total} học sinh
            </span>
            <button
              onClick={reset}
              className="font-medium text-sky-600 hover:text-sky-700"
            >
              Làm mới toàn bộ
            </button>
          </div>

          {isExhausted && (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Đã gọi hết cả lớp! Bấm &quot;Làm mới toàn bộ&quot; để chơi lại.
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
            {GameComponent ? (
              <GameComponent remaining={remaining} pick={pick} isExhausted={isExhausted} />
            ) : (
              <p className="text-sm text-red-600">Không tìm thấy game này.</p>
            )}
          </div>

          {history.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-zinc-900">Đã gọi ({history.length})</h2>
              <ol className="mt-2 flex flex-wrap gap-2">
                {history.map((s, i) => (
                  <li
                    key={`${s.id}-${i}`}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
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
