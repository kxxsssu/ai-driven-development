import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginBackground } from "@/app/login/LoginBackground";
import { LoginHeader } from "@/app/login/LoginHeader";
import { LoginForm } from "@/app/login/LoginForm";

export const metadata: Metadata = {
  title: "로그인 — CanvasHub",
  description: "CanvasHub에 로그인하고 AI 이미지 커뮤니티를 탐색하세요.",
};

export default function LoginPage() {
  return (
    <LoginBackground>
      <LoginHeader />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </LoginBackground>
  );
}
