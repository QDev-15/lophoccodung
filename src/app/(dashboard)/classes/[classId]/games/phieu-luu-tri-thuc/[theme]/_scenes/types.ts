import type { AdventureTheme } from "@/lib/adventure-themes";

export type AdventureSceneProps = {
  theme: AdventureTheme;
  index: number;
  total: number;
  finished: boolean;
};
