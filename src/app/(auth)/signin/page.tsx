import Link from "next/link";
import { signIn } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.5C29.6 35.1 26.9 36 24 36c-5.2 0-9.6-3.1-11.3-7.9l-6.6 5c3.3 6 9.7 10.9 17.9 10.9z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.5C41.3 36.2 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-4 py-12 md:flex-row md:gap-16">
      <Link
        href="/"
        className="absolute top-6 left-4 flex items-center gap-1 text-sm font-semibold text-(--color-ink)/60 transition hover:text-(--color-ink) md:left-8"
      >
        ← Về trang chủ
      </Link>

      {/* Hero badge */}
      <div className="relative flex size-56 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_200deg,#dcfce7,#4ade80,#15803d,#8b5cf6,#dcfce7)] shadow-[0_16px_40px_-8px_rgba(21,128,61,0.35)] md:size-72">
        <div className="flex size-[92%] flex-col items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-lime-300 text-center">
          <p
            className="font-display text-3xl leading-tight font-extrabold text-white [-webkit-text-stroke:2px_rgba(21,128,61,0.4)] drop-shadow-[0_3px_0_rgba(21,128,61,0.4)] md:text-4xl"
          >
            Lớp Học
          </p>
          <p
            className="font-display text-3xl leading-tight font-extrabold text-(--color-mint-light) [-webkit-text-stroke:2px_rgba(21,128,61,0.4)] drop-shadow-[0_3px_0_rgba(21,128,61,0.4)] md:text-4xl"
          >
            Cô Dung
          </p>
        </div>
        <span className="animate-twinkle absolute -top-1 left-4 text-2xl md:text-3xl">
          ⭐
        </span>
        <span className="animate-twinkle absolute top-6 -right-2 text-xl [animation-delay:0.6s] md:text-2xl">
          ✨
        </span>
        <span className="animate-float absolute -bottom-2 left-8 text-2xl [animation-delay:0.3s] md:text-3xl">
          🍃
        </span>
      </div>

      {/* Login card */}
      <div className="animate-pop-in w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-[0_20px_45px_-12px_rgba(21,128,61,0.18)]">
        <h1 className="font-display text-2xl font-bold text-(--color-ink)">
          Đăng nhập
        </h1>
        <p className="mt-2 text-sm text-(--color-ink)/70">
          Chào thầy cô! Đăng nhập bằng tài khoản Google để vào lớp học của
          mình.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 rounded-full border border-(--color-ink)/10 bg-white px-6 py-3 text-sm font-bold text-(--color-ink) shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <GoogleIcon />
            Đăng nhập bằng Google
          </button>
        </form>

        <p className="mt-6 text-xs text-(--color-ink)/50">
          Chỉ giáo viên đã được cấp quyền mới truy cập được lớp học. 🐰
        </p>
      </div>
    </div>
  );
}
