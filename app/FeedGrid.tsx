"use client";

import { useEffect, useRef, useMemo } from "react";
import { useFeed } from "@/hooks/use-feed";
import { useFeedStore } from "@/store/feed-store";
import { FeedCard } from "@/app/FeedCard";
import { FeedSkeleton } from "@/app/FeedSkeleton";
import { FeedEmpty } from "@/app/FeedEmpty";
import { Loader2 } from "lucide-react";

export function FeedGrid() {
  const { activeTab } = useFeedStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useFeed(activeTab);

  const feedItems = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

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

  if (isLoading) {
    return (
      <div className="px-6 py-6">
        <FeedSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-muted-foreground">피드를 불러오지 못했습니다.</p>
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

  if (feedItems.length === 0) {
    return <FeedEmpty />;
  }

  return (
    <div className="px-6 py-6">
      <div className="columns-3 gap-4 lg:columns-4 2xl:columns-6">
        {feedItems.map((item, index) => (
          <FeedCard key={`${activeTab}-${item.id}`} item={item} index={index} />
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2
            className="h-6 w-6 animate-spin text-primary"
            aria-label="추가 피드 로딩 중"
          />
        )}
      </div>
    </div>
  );
}
