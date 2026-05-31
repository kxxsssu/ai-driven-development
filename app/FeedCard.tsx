"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Lock, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommentDialog } from "@/app/CommentDialog";
import { useInteractionStore } from "@/store/interaction-store";
import { useHydrated } from "@/hooks/use-hydrated";
import type { IFeedItem } from "@/types";
import { cn } from "@/lib/utils";

interface IFeedCardProps {
  item: IFeedItem;
  index?: number;
}

function FeedCardComponent({ item, index = 0 }: IFeedCardProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const [commentOpen, setCommentOpen] = useState(false);

  const liked = useInteractionStore((state) =>
    Boolean(state.likedIds[item.id])
  );
  const toggleLike = useInteractionStore((state) => state.toggleLike);
  const commentCount = useInteractionStore(
    (state) => state.comments[item.id]?.length ?? 0
  );

  const isLiked = hydrated && liked;
  const likeCount = item.likes + (isLiked ? 1 : 0);

  const navigateToDetail = () => router.push(`/images/${item.id}`);

  return (
    <div
      className={cn(
        "group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-surface",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_12px_40px_rgba(124,92,255,0.25)]",
        "hover:scale-[1.02]",
        "animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      )}
      style={{
        animationDelay: `${Math.min(index, 12) * 50}ms`,
        animationDuration: "400ms",
      }}
    >
      <div
        role="link"
        tabIndex={0}
        className="relative block w-full cursor-pointer overflow-hidden"
        onClick={navigateToDetail}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigateToDetail();
          }
        }}
        aria-label={`${item.author.name}의 작품 보기`}
      >
        <Image
          src={item.imageUrl}
          alt={`${item.author.name}님의 AI 생성 이미지`}
          width={400}
          height={500}
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 16vw"
          loading="lazy"
        />

        <div className="absolute right-2 top-2">
          <Badge
            variant="secondary"
            className="gap-1 bg-black/50 text-white backdrop-blur-sm"
          >
            {item.isPublic ? (
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
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarImage src={item.author.avatarUrl} alt="" />
            <AvatarFallback>{item.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="truncate text-sm text-muted-foreground">
            {item.author.name}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => toggleLike(item.id)}
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors",
              "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            aria-pressed={isLiked}
          >
            <Heart
              className={cn("h-4 w-4 transition-transform", isLiked && "scale-110 fill-red-500")}
              aria-hidden
            />
            {likeCount.toLocaleString()}
          </button>

          <button
            type="button"
            onClick={() => setCommentOpen(true)}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="댓글 보기 및 작성"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {hydrated ? commentCount : 0}
          </button>
        </div>
      </div>

      <CommentDialog
        imageId={item.id}
        open={commentOpen}
        onOpenChange={setCommentOpen}
      />
    </div>
  );
}

export const FeedCard = memo(FeedCardComponent);
