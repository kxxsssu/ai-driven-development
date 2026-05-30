import type { Metadata } from "next";
import { GalleryClient } from "@/app/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "내 갤러리 — CanvasHub",
  description: "생성한 이미지를 관리하고 공개 여부를 설정하세요.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
