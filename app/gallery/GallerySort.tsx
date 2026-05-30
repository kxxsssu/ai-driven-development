"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGalleryStore } from "@/store/gallery-store";
import type { GallerySort as GallerySortType } from "@/types";

const SORT_ITEMS: { value: GallerySortType; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

export function GallerySort() {
  const sort = useGalleryStore((state) => state.sort);
  const setSort = useGalleryStore((state) => state.setSort);

  return (
    <Select value={sort} onValueChange={(value) => setSort(value as GallerySortType)}>
      <SelectTrigger className="w-32" aria-label="정렬 기준">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
