import type { Metadata } from "next";
import { ProfileClient } from "@/app/profile/ProfileClient";

export const metadata: Metadata = {
  title: "프로필 — CanvasHub",
  description: "내 공개 작품과 활동을 확인하세요.",
};

export default function ProfilePage() {
  // 보호 라우트(/profile)는 현재 로그인 사용자를 의미한다.
  return <ProfileClient id="me" />;
}
