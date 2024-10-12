import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

// Define tus opciones de autenticación
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();

        if (!user.ok) {
          throw new Error(user.msg);
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any; // Asegúrate de manejar esto adecuadamente
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Exportar el handler para las rutas GET y POST
const handler = NextAuth(authOptions);

// Maneja las solicitudes de ruta
export async function GET(req: Request) {
  return await handler(req);
}

export async function POST(req: Request) {
  return await handler(req);
}
