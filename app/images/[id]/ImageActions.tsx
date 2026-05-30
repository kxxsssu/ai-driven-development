"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGenerationStore } from "@/store/generation-store";
import type { IImageDetail } from "@/types";

interface IImageActionsProps {
  image: IImageDetail;
}

export function ImageActions({ image }: IImageActionsProps) {
  const router = useRouter();
  const setPrompt = useGenerationStore((state) => state.setPrompt);
  const setStyle = useGenerationStore((state) => state.setStyle);
  const setRatio = useGenerationStore((state) => state.setRatio);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      toast.success("프롬프트를 복사했습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleGenerateSimilar = () => {
    // 상세 화면의 생성 옵션을 생성 페이지로 이어 재창작 흐름을 연결한다.
    setPrompt(image.prompt);
    setStyle(image.style);
    setRatio(image.ratio);
    router.push("/create");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" className="gap-2" onClick={handleCopyPrompt}>
        <Copy className="h-4 w-4" />
        Copy Prompt
      </Button>
      <Button className="gap-2" onClick={handleGenerateSimilar}>
        <Sparkles className="h-4 w-4" />
        Generate Similar
      </Button>
    </div>
  );
}
