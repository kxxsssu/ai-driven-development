import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CanvasHub — AI 이미지 커뮤니티",
  description: "AI 이미지 생성과 커뮤니티 탐색을 결합한 창작 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProvider signInUrl="/login" signUpUrl="/register">
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-center" richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
