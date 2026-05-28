"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useGenerationStore } from "@/store/generation-store";
import { getStylePreviewUrl } from "@/lib/generation-options";

export function StylePreviewPanel() {
  const selectedStyle = useGenerationStore((state) => state.selectedStyle);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        스타일 미리보기
      </h2>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface">
        {selectedStyle ? (
          <Image
            key={selectedStyle}
            src={getStylePreviewUrl(selectedStyle)}
            alt={`${selectedStyle} 스타일 미리보기`}
            fill
            className="animate-in fade-in object-cover duration-300"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10" aria-hidden />
            <p className="text-sm">스타일을 선택하면 미리보기가 표시됩니다</p>
          </div>
        )}
        {selectedStyle && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {selectedStyle}
          </div>
        )}
      </div>
    </div>
  );
}
