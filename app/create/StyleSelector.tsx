"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGenerationStore } from "@/store/generation-store";
import { STYLE_OPTIONS } from "@/lib/generation-options";
import type { ImageStyle } from "@/types/generation";

export function StyleSelector() {
  const selectedStyle = useGenerationStore((state) => state.selectedStyle);
  const setStyle = useGenerationStore((state) => state.setStyle);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="style">스타일</Label>
      <Select
        value={selectedStyle ?? undefined}
        onValueChange={(value) => setStyle(value as ImageStyle)}
      >
        <SelectTrigger id="style" aria-label="스타일 선택">
          <SelectValue placeholder="Select Style" />
        </SelectTrigger>
        <SelectContent>
          {STYLE_OPTIONS.map((style) => (
            <SelectItem key={style} value={style}>
              {style}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
