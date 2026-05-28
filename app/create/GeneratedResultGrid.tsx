"use client";

import { Sparkles } from "lucide-react";
import { useGenerationStore } from "@/store/generation-store";
import { GeneratedImageCard } from "@/app/create/GeneratedImageCard";

export function GeneratedResultGrid() {
  const generatedImages = useGenerationStore((state) => state.generatedImages);

  if (generatedImages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
          <Sparkles className="h-7 w-7 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-sm text-muted-foreground">
          프롬프트와 스타일을 설정하고 이미지를 생성해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        생성 결과 ({generatedImages.length})
      </h2>
      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-3">
        {generatedImages.map((image) => (
          <GeneratedImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}
