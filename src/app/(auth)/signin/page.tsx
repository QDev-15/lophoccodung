import { signIn } from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Đăng nhập</h1>
      <p className="max-w-sm text-zinc-600">
        Dùng tài khoản Google của bạn để quản lý lớp học.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          Đăng nhập với Google
        </button>
      </form>
    </div>
  );
}
