"use client";

import { Label } from "@/components/ui/label";
import { useGenerationStore } from "@/store/generation-store";
import { RATIO_OPTIONS } from "@/lib/generation-options";
import { cn } from "@/lib/utils";

export function RatioSelector() {
  const ratio = useGenerationStore((state) => state.ratio);
  const setRatio = useGenerationStore((state) => state.setRatio);

  return (
    <div className="flex flex-col gap-2">
      <Label>비율</Label>
      <div
        className="inline-flex gap-1 rounded-lg border border-border bg-surface p-1"
        role="group"
        aria-label="이미지 비율 선택"
      >
        {RATIO_OPTIONS.map((option) => {
          const isActive = ratio === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setRatio(option)}
              aria-pressed={isActive}
              className={cn(
                "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
