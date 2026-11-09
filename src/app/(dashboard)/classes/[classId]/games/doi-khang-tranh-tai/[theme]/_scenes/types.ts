import type { BattleTheme } from "@/lib/battle-themes";

export type BattleSceneProps = {
  theme: BattleTheme;
  index: number;
  total: number;
  scoreA: number;
  scoreB: number;
  finished: boolean;
};
