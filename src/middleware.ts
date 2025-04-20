export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!api/auth|register|login|videos|_next|favicon.ico).*)"],
};
