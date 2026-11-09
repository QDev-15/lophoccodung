import type { ComponentType } from "react";

import type { AdventureSceneProps } from "./types";

import { Scene as EchQuaDamSen } from "./ech-qua-dam-sen";
import { Scene as NhayOVuong } from "./nhay-o-vuong";
import { Scene as KhinhKhiCau } from "./khinh-khi-cau";
import { Scene as VuonHoaDiemThuong } from "./vuon-hoa-diem-thuong";
import { Scene as DuHanhVuTru } from "./du-hanh-vu-tru";
import { Scene as LeoNuiChinhPhuc } from "./leo-nui-chinh-phuc";
import { Scene as ChuyenTauTriThuc } from "./chuyen-tau-tri-thuc";
import { Scene as DaoKhoBau } from "./dao-kho-bau";
import { Scene as BuomTimHoa } from "./buom-tim-hoa";
import { Scene as TayCauSieuDang } from "./tay-cau-sieu-dang";
import { Scene as OCuaTuoiTho } from "./o-cua-tuoi-tho";
import { Scene as TiemSinhTo } from "./tiem-sinh-to";
import { Scene as AnhHungVuotAi } from "./anh-hung-vuot-ai";
import { Scene as DuHanhThoiGian } from "./du-hanh-thoi-gian";
import { Scene as ChuyenXeYeuThuong } from "./chuyen-xe-yeu-thuong";
import { Scene as SieuThiRauCu } from "./sieu-thi-rau-cu";

export const ADVENTURE_SCENES: Record<string, ComponentType<AdventureSceneProps>> = {
  "ech-qua-dam-sen": EchQuaDamSen,
  "nhay-o-vuong": NhayOVuong,
  "khinh-khi-cau": KhinhKhiCau,
  "vuon-hoa-diem-thuong": VuonHoaDiemThuong,
  "du-hanh-vu-tru": DuHanhVuTru,
  "leo-nui-chinh-phuc": LeoNuiChinhPhuc,
  "chuyen-tau-tri-thuc": ChuyenTauTriThuc,
  "dao-kho-bau": DaoKhoBau,
  "buom-tim-hoa": BuomTimHoa,
  "tay-cau-sieu-dang": TayCauSieuDang,
  "o-cua-tuoi-tho": OCuaTuoiTho,
  "tiem-sinh-to": TiemSinhTo,
  "anh-hung-vuot-ai": AnhHungVuotAi,
  "du-hanh-thoi-gian": DuHanhThoiGian,
  "chuyen-xe-yeu-thuong": ChuyenXeYeuThuong,
  "sieu-thi-rau-cu": SieuThiRauCu,
};
