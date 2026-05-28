"use client";

import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGenerationStore } from "@/store/generation-store";
import { MIN_COUNT, MAX_COUNT } from "@/lib/generation-options";

export function GenerationCountStepper() {
  const count = useGenerationStore((state) => state.count);
  const setCount = useGenerationStore((state) => state.setCount);

  return (
    <div className="flex flex-col gap-2">
      <Label>생성 개수</Label>
      <div className="inline-flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => setCount(count - 1)}
          disabled={count <= MIN_COUNT}
          aria-label="개수 감소"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span
          className="w-8 text-center text-lg font-semibold tabular-nums"
          aria-live="polite"
        >
          {count}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => setCount(count + 1)}
          disabled={count >= MAX_COUNT}
          aria-label="개수 증가"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
