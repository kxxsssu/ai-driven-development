import Link from "next/link";
import { ImageOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedEmpty() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface">
        <ImageOff className="h-10 w-10 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="text-xl font-semibold">아직 공개된 작품이 없어요</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        첫 번째 AI 이미지를 생성하고 커뮤니티에 공유해 보세요.
      </p>
      <Button asChild className="mt-8 gap-2" size="lg">
        <Link href="/create">
          <Sparkles className="h-4 w-4" aria-hidden />
          이미지 생성하기
        </Link>
      </Button>
    </div>
  );
}
