import type { ComponentType } from "react";

import type { BattleSceneProps } from "./types";

import { Scene as DaiChienHaiDoi } from "./dai-chien-hai-doi";
import { Scene as DuongDuaTocDo } from "./duong-dua-toc-do";
import { Scene as LeoDinhTriTue } from "./leo-dinh-tri-tue";
import { Scene as VongLoaiThuThach } from "./vong-loai-thu-thach";
import { Scene as TranhCupVoDich } from "./tranh-cup-vo-dich";
import { Scene as VuaTocDo } from "./vua-toc-do";
import { Scene as DaiChienTriTue } from "./dai-chien-tri-tue";
import { Scene as DaiChienLeoNui } from "./dai-chien-leo-nui";
import { Scene as ChinhPhucDinhNui } from "./chinh-phuc-dinh-nui";

export const BATTLE_SCENES: Record<string, ComponentType<BattleSceneProps>> = {
  "dai-chien-hai-doi": DaiChienHaiDoi,
  "duong-dua-toc-do": DuongDuaTocDo,
  "leo-dinh-tri-tue": LeoDinhTriTue,
  "vong-loai-thu-thach": VongLoaiThuThach,
  "tranh-cup-vo-dich": TranhCupVoDich,
  "vua-toc-do": VuaTocDo,
  "dai-chien-tri-tue": DaiChienTriTue,
  "dai-chien-leo-nui": DaiChienLeoNui,
  "chinh-phuc-dinh-nui": ChinhPhucDinhNui,
};
