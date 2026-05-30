"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchProfile, fetchProfileImages } from "@/utils/fetcher";

export function useProfile(id: string) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchProfile(id),
    enabled: Boolean(id),
  });
}

export function useProfileImages(id: string) {
  return useInfiniteQuery({
    queryKey: ["profile-images", id],
    queryFn: ({ pageParam }) =>
      fetchProfileImages(id, pageParam as string | undefined, 20),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: Boolean(id),
  });
}
