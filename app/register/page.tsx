import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginBackground } from "@/app/login/LoginBackground";
import { RegisterHeader } from "@/app/register/RegisterHeader";
import { RegisterForm } from "@/app/register/RegisterForm";

export const metadata: Metadata = {
  title: "회원가입 — CanvasHub",
  description: "CanvasHub 계정을 만들고 AI 이미지 창작을 시작하세요.",
};

export default function RegisterPage() {
  return (
    <LoginBackground>
      <RegisterHeader />
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </LoginBackground>
  );
}
