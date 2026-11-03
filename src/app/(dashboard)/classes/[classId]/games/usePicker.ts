import { useCallback, useState } from "react";

export type PickerStudent = { id: string; fullName: string };

export type PickResult = {
  student: PickerStudent;
  index: number;
  poolSize: number;
};

export function usePicker(students: PickerStudent[]) {
  const [remaining, setRemaining] = useState<PickerStudent[]>(students);
  const [history, setHistory] = useState<PickerStudent[]>([]);

  const pick = useCallback((): PickResult | null => {
    if (remaining.length === 0) return null;
    const poolSize = remaining.length;
    const index = Math.floor(Math.random() * poolSize);
    const student = remaining[index];
    setRemaining((prev) => prev.filter((s) => s.id !== student.id));
    setHistory((prev) => [student, ...prev]);
    return { student, index, poolSize };
  }, [remaining]);

  const reset = useCallback(() => {
    setRemaining(students);
    setHistory([]);
  }, [students]);

  return { remaining, history, pick, reset, total: students.length };
}
