"use client";

import { FeedHeader } from "@/app/FeedHeader";
import { GalleryTabs } from "@/app/gallery/GalleryTabs";
import { GallerySort } from "@/app/gallery/GallerySort";
import { GalleryGrid } from "@/app/gallery/GalleryGrid";

export function GalleryClient() {
  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">내 갤러리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            생성한 이미지를 관리하고 공개 여부를 설정하세요.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <GalleryTabs />
          <GallerySort />
        </div>

        <GalleryGrid />
      </main>
    </div>
  );
}
