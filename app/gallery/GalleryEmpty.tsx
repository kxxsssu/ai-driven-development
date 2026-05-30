import Link from "next/link";
import { ImageOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IGalleryEmptyProps {
  message?: string;
  showCreate?: boolean;
}

export function GalleryEmpty({
  message = "아직 저장한 이미지가 없어요",
  showCreate = true,
}: IGalleryEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface">
        <ImageOff className="h-10 w-10 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="text-xl font-semibold">{message}</h2>
      {showCreate && (
        <>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            AI 이미지를 생성하고 내 갤러리에 모아보세요.
          </p>
          <Button asChild className="mt-8 gap-2" size="lg">
            <Link href="/create">
              <Sparkles className="h-4 w-4" aria-hidden />
              이미지 생성하기
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
