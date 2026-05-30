"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Bookmark,
  Share2,
  RefreshCw,
  MoreVertical,
  Download,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGenerationStore } from "@/store/generation-store";
import type { IGeneratedImage } from "@/types";

interface IGeneratedImageCardProps {
  image: IGeneratedImage;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function GeneratedImageCard({ image }: IGeneratedImageCardProps) {
  const reuseSettings = useGenerationStore((state) => state.reuseSettings);
  const generate = useGenerationStore((state) => state.generate);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      // 외부(cross-origin) 이미지는 anchor download 속성이 무시되므로
      // blob으로 받아 ObjectURL로 다운로드한다.
      const response = await fetch(image.url);
      if (!response.ok) throw new Error("download failed");

      const blob = await response.blob();
      const extension = MIME_EXTENSION[blob.type] ?? "jpg";
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `canvashub-${image.id}.${extension}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);

      toast.success("이미지를 다운로드했습니다.");
    } catch {
      toast.error("다운로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("내 갤러리에 저장했습니다.");
  };

  const handleShare = () => {
    setShared(true);
    toast.success("공개 피드에 공유했습니다.");
  };

  const handleRegenerate = () => {
    reuseSettings(image);
    void generate();
  };

  return (
    <Card className="group overflow-hidden border-border bg-surface">
      <div className="relative w-full overflow-hidden">
        <Image
          src={image.url}
          alt={`${image.style} 스타일 생성 이미지`}
          width={400}
          height={400}
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        <div className="absolute left-2 top-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
            onClick={handleDownload}
            disabled={downloading}
            aria-label="이미지 다운로드"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                aria-label="추가 액션"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload} disabled={downloading}>
                <Download className="h-4 w-4" />
                다운로드
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRegenerate}>
                <RefreshCw className="h-4 w-4" />
                동일 프롬프트 재생성
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRegenerate}>
                <Share2 className="h-4 w-4" />
                유사 이미지 생성
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => reuseSettings(image)}>
                <Bookmark className="h-4 w-4" />
                스타일 재사용
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{image.style}</Badge>
          <Badge variant="outline">{image.ratio}</Badge>
          <span className="ml-auto text-xs text-muted-foreground">
            {formatTime(image.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={saved ? "secondary" : "outline"}
            size="sm"
            className="flex-1"
            onClick={handleSave}
            disabled={saved}
          >
            <Bookmark className="h-4 w-4" />
            {saved ? "저장됨" : "Save"}
          </Button>
          <Button
            variant={shared ? "secondary" : "outline"}
            size="sm"
            className="flex-1"
            onClick={handleShare}
            disabled={shared}
          >
            <Share2 className="h-4 w-4" />
            {shared ? "공유됨" : "Share"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleRegenerate}
          >
            <RefreshCw className="h-4 w-4" />
            재생성
          </Button>
        </div>
      </div>
    </Card>
  );
}
