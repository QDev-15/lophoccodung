export function RevealBanner({ student }: { student: { fullName: string } | null }) {
  if (!student) return null;

  return (
    <div className="mt-2 rounded-xl bg-emerald-50 px-6 py-4 text-center">
      <p className="text-xl font-bold text-emerald-700">🎉 {student.fullName}</p>
    </div>
  );
}
