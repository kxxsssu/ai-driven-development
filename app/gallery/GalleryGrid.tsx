"use client";

import { useEffect, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useGallery } from "@/hooks/use-gallery";
import { useGalleryStore } from "@/store/gallery-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { GalleryCard } from "@/app/gallery/GalleryCard";
import { GalleryEmpty } from "@/app/gallery/GalleryEmpty";
import { FeedSkeleton } from "@/app/FeedSkeleton";
import type { Visibility } from "@/types";

const EMPTY_TAB_MESSAGE: Record<"public" | "private", string> = {
  public: "공개한 이미지가 없어요",
  private: "비공개 이미지가 없어요",
};

export function GalleryGrid() {
  const hydrated = useHydrated();
  const sort = useGalleryStore((state) => state.sort);
  const activeTab = useGalleryStore((state) => state.activeTab);
  const overrides = useGalleryStore((state) => state.visibilityOverrides);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGallery(sort);

  // 서버 응답 + 낙관적 공개 토글(overrides)을 병합하고 탭으로 필터링한다.
  const items = useMemo(() => {
    const merged = (data?.pages.flatMap((page) => page.items) ?? []).map(
      (item) => ({
        item,
        visibility: (overrides[item.id] ?? item.visibility) as Visibility,
      })
    );

    if (activeTab === "all") return merged;
    return merged.filter((entry) => entry.visibility === activeTab);
  }, [data, overrides, activeTab]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || !hydrated) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-muted-foreground">갤러리를 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 text-sm text-primary underline-offset-4 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    if (activeTab === "all") {
      return <GalleryEmpty />;
    }
    return (
      <GalleryEmpty message={EMPTY_TAB_MESSAGE[activeTab]} showCreate={false} />
    );
  }

  return (
    <>
      <div className="columns-3 gap-4 lg:columns-4 2xl:columns-6">
        {items.map(({ item, visibility }) => (
          <GalleryCard key={item.id} item={item} visibility={visibility} />
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2
            className="h-6 w-6 animate-spin text-primary"
            aria-label="추가 이미지 로딩 중"
          />
        )}
      </div>
    </>
  );
}
