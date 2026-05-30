"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInteractionStore } from "@/store/interaction-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

interface IImageDetailHeaderProps {
  imageId?: string;
  likes?: number;
}

export function ImageDetailHeader({ imageId, likes }: IImageDetailHeaderProps) {
  const router = useRouter();
  const hydrated = useHydrated();

  const liked = useInteractionStore((state) =>
    imageId ? Boolean(state.likedIds[imageId]) : false
  );
  const toggleLike = useInteractionStore((state) => state.toggleLike);

  const isLiked = hydrated && liked;
  const likeCount =
    likes === undefined ? undefined : likes + (isLiked ? 1 : 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </Button>

        {imageId && likeCount !== undefined && (
          <button
            type="button"
            onClick={() => toggleLike(imageId)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
              "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isLiked
                ? "text-red-500"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            aria-pressed={isLiked}
          >
            <Heart
              className={cn("h-5 w-5", isLiked && "scale-110 fill-red-500")}
              aria-hidden
            />
            {likeCount.toLocaleString()}
          </button>
        )}
      </div>
    </header>
  );
}
