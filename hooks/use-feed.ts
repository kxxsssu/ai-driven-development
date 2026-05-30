"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/utils/fetcher";
import type { FeedTab } from "@/types";

export function useFeed(type: FeedTab) {
  return useInfiniteQuery({
    queryKey: ["feed", type],
    queryFn: ({ pageParam }) =>
      fetchFeed({
        type,
        cursor: pageParam as string | undefined,
        limit: 20,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
