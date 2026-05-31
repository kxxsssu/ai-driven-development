"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGallery } from "@/utils/fetcher";
import type { GallerySort } from "@/types";

export function useGallery(sort: GallerySort) {
  return useInfiniteQuery({
    queryKey: ["gallery", sort],
    queryFn: ({ pageParam }) =>
      fetchGallery({
        sort,
        cursor: pageParam as string | undefined,
        limit: 20,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined,
    refetchOnMount: "always",
  });
}
