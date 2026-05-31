"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageDetail } from "@/hooks/use-image-detail";
import { ImageDetailHeader } from "@/app/images/[id]/ImageDetailHeader";
import { ImageViewer } from "@/app/images/[id]/ImageViewer";
import { ImageMetadata } from "@/app/images/[id]/ImageMetadata";
import { ImageActions } from "@/app/images/[id]/ImageActions";

export function ImageDetailClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: image, isLoading, isError } = useImageDetail(id);

  return (
    <div className="min-h-screen bg-background">
      <ImageDetailHeader imageId={image?.id} likes={image?.likes} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {!id && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h1 className="text-xl font-semibold">잘못된 이미지 주소입니다</h1>
            <Button asChild className="mt-8">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        )}

        {id && isLoading && (
          <div className="flex justify-center py-32">
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-label="이미지 로딩 중"
            />
          </div>
        )}

        {id && isError && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h1 className="text-xl font-semibold">이미지를 찾을 수 없습니다</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              삭제되었거나 잘못된 주소일 수 있어요.
            </p>
            <Button asChild className="mt-8">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        )}

        {image && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
            <ImageViewer
              src={image.imageUrl}
              alt={`${image.author.name}님의 ${image.style} 스타일 작품`}
            />
            <div className="flex flex-col gap-8">
              <ImageMetadata image={image} />
              <ImageActions image={image} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
