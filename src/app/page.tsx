export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="text-lg font-bold tracking-tight text-sky-700">
          Lớp Học Có Dũng
        </span>
        <a
          href="/signin"
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          Đăng nhập
        </a>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center sm:px-10">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Quản lý lớp học, tạo bài kiểm tra và chấm điểm{" "}
          <span className="text-sky-600">tự động</span>
        </h1>
        <p className="max-w-xl text-lg text-zinc-600">
          Một nơi để giáo viên quản lý danh sách lớp, tạo đề kiểm tra nhanh và
          giao bài cho học sinh qua một đường link — không cần cài đặt gì
          thêm.
        </p>
        <a
          href="/signin"
          className="mt-2 rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          Bắt đầu với Google
        </a>

        <section className="mt-16 grid w-full max-w-4xl gap-6 text-left sm:grid-cols-3">
          <Feature
            title="Quản lý lớp & học sinh"
            description="Thêm học sinh thủ công hoặc nhập nhanh từ file Excel, có xem trước trước khi lưu."
          />
          <Feature
            title="Tạo đề kiểm tra"
            description="Trắc nghiệm, đúng/sai, điền từ — đặt thời gian làm bài theo ý bạn."
          />
          <Feature
            title="Chấm điểm tự động"
            description="Học sinh làm bài qua một đường link, điểm được tính ngay khi nộp bài."
          />
        </section>
      </main>

      <footer className="px-6 py-8 text-center text-sm text-zinc-500">
        Lớp Học Có Dũng — đang được xây dựng.
      </footer>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
    </div>
  );
}
