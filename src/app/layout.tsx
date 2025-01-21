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
  title: "Lotuss México",
  description: "¡Lotuss - Juega y Gana increíbles premios!",
  openGraph: {
    title: "Lotuss México",
    description: "¡Lotuss - Juega y Gana increíbles premios!",
    url: "https://lotuss.mx/",
    type: "website",
    images: [
      {
        url: "/images/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Lotuss México - ScratchRoom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotuss México",
    description: "¡Lotuss - Juega y Gana increíbles premios!",
    images: ["/images/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
