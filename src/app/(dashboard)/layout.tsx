import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-6 border-b border-zinc-200 px-6 py-4">
        <Link href="/dashboard" className="font-bold text-sky-700">
          Lớp Học Có Dũng
        </Link>
        <nav className="flex gap-4 text-sm text-zinc-600">
          <Link href="/dashboard" className="hover:text-sky-700">
            Tổng quan
          </Link>
          <Link href="/classes" className="hover:text-sky-700">
            Lớp học
          </Link>
          <Link href="/quizzes" className="hover:text-sky-700">
            Đề kiểm tra
          </Link>
          <Link href="/assignments" className="hover:text-sky-700">
            Bài đã giao
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
