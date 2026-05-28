"use client";

import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGenerationStore } from "@/store/generation-store";

export function GenerateButton() {
  const loading = useGenerationStore((state) => state.loading);
  const prompt = useGenerationStore((state) => state.prompt);
  const selectedStyle = useGenerationStore((state) => state.selectedStyle);
  const generate = useGenerationStore((state) => state.generate);

  const disabled =
    loading || prompt.trim().length === 0 || selectedStyle === null;

  return (
    <Button
      type="button"
      size="lg"
      className="h-12 w-full text-base"
      disabled={disabled}
      onClick={() => generate()}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          생성 중...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          이미지 생성
        </>
      )}
    </Button>
  );
}
