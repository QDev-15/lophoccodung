import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/lib/auth";
import { DashboardNav } from "./DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const name = session.user.name ?? "Thầy cô";
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-(--color-ink)/10 bg-white px-4 py-3 md:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-display text-lg font-extrabold text-(--color-ink)"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-lime-400 to-yellow-300 text-lg">
            🧸
          </span>
          Lớp Học Cô Dung
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                className="size-8 rounded-full"
              />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-(--color-mint-light) text-sm font-bold text-(--color-mint-dark)">
                {initial}
              </span>
            )}
            <span className="text-sm font-semibold text-(--color-ink)">
              {name}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-full border border-(--color-ink)/15 px-4 py-1.5 text-sm font-bold text-(--color-ink)/80 transition hover:bg-(--color-ink)/5"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </header>

      <div className="border-b border-(--color-ink)/10 bg-white md:hidden">
        <DashboardNav layout="mobile" />
      </div>

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-(--color-ink)/10 bg-white md:block">
          <DashboardNav layout="sidebar" />
        </aside>
        <main className="flex-1 bg-(--color-cloud)">{children}</main>
      </div>
    </div>
  );
}
