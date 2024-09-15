export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protege todas las rutas excepto las páginas de login y register
    "/((?!register|login).*)",
  ],
};
