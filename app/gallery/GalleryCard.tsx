"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Globe, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGalleryStore } from "@/store/gallery-store";
import { formatDate } from "@/lib/format";
import type { IGalleryItem, Visibility } from "@/types";
import { cn } from "@/lib/utils";

interface IGalleryCardProps {
  item: IGalleryItem;
  visibility: Visibility;
}

function GalleryCardComponent({ item, visibility }: IGalleryCardProps) {
  const setVisibility = useGalleryStore((state) => state.setVisibility);
  const isPublic = visibility === "public";

  const handleToggle = () => {
    const next: Visibility = isPublic ? "private" : "public";
    // 목업: 낙관적 업데이트 후 즉시 반영. 실제 연동 시 실패하면 롤백한다.
    setVisibility(item.id, next);
    toast.success(
      next === "public" ? "공개로 전환했습니다." : "비공개로 전환했습니다."
    );
  };

  return (
    <div className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-surface">
      <Link
        href={`/images/${item.id}`}
        className="relative block w-full overflow-hidden"
        aria-label={`${item.prompt} 상세 보기`}
      >
        <Image
          src={item.imageUrl}
          alt={`${item.style} 스타일 생성 이미지`}
          width={400}
          height={500}
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 16vw"
          loading="lazy"
        />
        <div className="absolute right-2 top-2">
          <Badge
            variant="secondary"
            className="gap-1 bg-black/50 text-white backdrop-blur-sm"
          >
            {isPublic ? (
              <>
                <Globe className="h-3 w-3" aria-hidden />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" aria-hidden />
                Private
              </>
            )}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{item.style}</Badge>
          <Badge variant="outline">{item.ratio}</Badge>
          <span className="ml-auto text-xs text-muted-foreground">
            {formatDate(item.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {isPublic ? "공개 중" : "비공개"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            aria-label="공개 여부 전환"
            onClick={handleToggle}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              isPublic ? "bg-primary" : "bg-border"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                isPublic ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export const GalleryCard = memo(GalleryCardComponent);
