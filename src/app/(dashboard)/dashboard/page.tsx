import { auth, signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">
        Xin chào, {session?.user?.name ?? "giáo viên"}
      </h1>
      <p className="text-zinc-600">
        Đây là trang tổng quan. Quản lý lớp, đề kiểm tra sẽ xuất hiện ở đây.
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
