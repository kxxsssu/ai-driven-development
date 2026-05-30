"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchImageDetail } from "@/utils/fetcher";

export function useImageDetail(id: string) {
  return useQuery({
    queryKey: ["image", id],
    queryFn: () => fetchImageDetail(id),
    enabled: Boolean(id),
  });
}
