import * as XLSX from "xlsx";

export type ImportRowStatus = "ok" | "warning" | "error";

export type ImportPreviewRow = {
  rowNumber: number;
  fullName: string;
  studentCode: string;
  dateOfBirth: string;
  status: ImportRowStatus;
  messages: string[];
};

export type ImportPreviewResult = {
  rows: ImportPreviewRow[];
  okCount: number;
  warningCount: number;
  errorCount: number;
};

type RawRow = Record<string, unknown>;

function cellToString(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

export function parseStudentExcelBuffer(buffer: ArrayBuffer): RawRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: "" });
}

export function validateStudentRows(
  rawRows: RawRow[],
  existingStudentCodes: Set<string>,
): ImportPreviewResult {
  const seenCodes = new Map<string, number>();
  const rows: ImportPreviewRow[] = rawRows.map((raw, index) => {
    const rowNumber = index + 2; // header is row 1
    const fullName = cellToString(raw["Họ và tên"] ?? raw["Ho va ten"] ?? raw["fullName"]);
    const studentCode = cellToString(raw["Mã học sinh"] ?? raw["Ma hoc sinh"] ?? raw["studentCode"]);
    const dateOfBirth = cellToString(raw["Ngày sinh"] ?? raw["Ngay sinh"] ?? raw["dateOfBirth"]);

    const messages: string[] = [];
    let status: ImportRowStatus = "ok";

    if (!fullName) {
      status = "error";
      messages.push("Thiếu họ và tên");
    }

    if (studentCode) {
      const firstSeenAt = seenCodes.get(studentCode);
      if (firstSeenAt !== undefined) {
        status = "error";
        messages.push(`Mã học sinh trùng với dòng ${firstSeenAt}`);
      } else {
        seenCodes.set(studentCode, rowNumber);
      }
      if (existingStudentCodes.has(studentCode)) {
        status = "error";
        messages.push("Mã học sinh đã tồn tại trong lớp");
      }
    }

    return { rowNumber, fullName, studentCode, dateOfBirth, status, messages };
  });

  return {
    rows,
    okCount: rows.filter((r) => r.status === "ok").length,
    warningCount: rows.filter((r) => r.status === "warning").length,
    errorCount: rows.filter((r) => r.status === "error").length,
  };
}
