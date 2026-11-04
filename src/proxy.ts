export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/classes/:path*",
    "/quizzes/:path*",
    "/assignments/:path*",
    "/resources/:path*",
  ],
};
