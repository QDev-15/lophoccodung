import { createClass } from "../actions";

export default function NewClassPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">Tạo lớp mới</h1>
      <form action={createClass} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">Tên lớp</span>
          <input
            name="name"
            required
            placeholder="Ví dụ: Lớp 3A"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">Mô tả (không bắt buộc)</span>
          <textarea
            name="description"
            rows={3}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Tạo lớp
        </button>
      </form>
    </div>
  );
}
