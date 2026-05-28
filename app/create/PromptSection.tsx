"use client";

import { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGenerationStore } from "@/store/generation-store";
import { MAX_PROMPT_LENGTH } from "@/lib/generation-options";

export function PromptSection() {
  const prompt = useGenerationStore((state) => state.prompt);
  const setPrompt = useGenerationStore((state) => state.setPrompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // 자동 높이 확장 (최대 8줄 ≈ 200px)
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [prompt]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="prompt">프롬프트</Label>
      <Textarea
        id="prompt"
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value.slice(0, MAX_PROMPT_LENGTH))}
        placeholder="예) 사이버펑크 미래 도시, 네온 불빛이 가득한 거리"
        rows={3}
        className="max-h-[200px] resize-none"
        aria-label="이미지 생성 프롬프트"
      />
      <div className="text-right text-xs text-muted-foreground">
        {prompt.length} / {MAX_PROMPT_LENGTH}
      </div>
    </div>
  );
}
