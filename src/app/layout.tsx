import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lotuss",
  description: "Lotuss - Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Meta tag para controlar el zoom en dispositivos móviles */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* Meta Tags para Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="¡Ven a jugar y ganar!" />
        <meta name="twitter:description" content="Únete a nuestro emocionante juego y gana increíbles premios." />
        <meta name="twitter:image" content="/images/LotusLogo.png" />

        {/* Meta Tags para Facebook */}
        <meta property="og:title" content="¡Ven a jugar y ganar!" />
        <meta property="og:description" content="Únete a nuestro emocionante juego y gana increíbles premios." />
        <meta property="og:image" content="/images/LotusLogo.png" />
        <meta property="og:url" content="https://lotuss.mx" />
        <meta property="og:type" content="website" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          {children}
          <Toaster />
        </SessionAuthProvider>
      </body>
    </html>
  );
}
