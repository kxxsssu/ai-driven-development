"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useProfileImages } from "@/hooks/use-profile";
import { ProfileEmpty } from "@/app/profile/ProfileEmpty";
import { FeedSkeleton } from "@/app/FeedSkeleton";

interface IProfileGridProps {
  id: string;
  showCreateOnEmpty?: boolean;
}

export function ProfileGrid({ id, showCreateOnEmpty }: IProfileGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useProfileImages(id);

  const items = useMemo(
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
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-muted-foreground">작품을 불러오지 못했습니다.</p>
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
    return <ProfileEmpty showCreate={showCreateOnEmpty} />;
  }

  return (
    <>
      <div className="columns-3 gap-4 lg:columns-4 2xl:columns-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/images/${item.id}`}
            className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-surface"
            aria-label="작품 상세 보기"
          >
            <Image
              src={item.imageUrl}
              alt="공개 작품"
              width={400}
              height={500}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 16vw"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Heart className="h-3 w-3" aria-hidden />
              {item.likes.toLocaleString()}
            </div>
          </Link>
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2
            className="h-6 w-6 animate-spin text-primary"
            aria-label="추가 작품 로딩 중"
          />
        )}
      </div>
    </>
  );
}
