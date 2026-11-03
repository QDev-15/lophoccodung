export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/classes/:path*", "/quizzes/:path*", "/assignments/:path*"],
};
