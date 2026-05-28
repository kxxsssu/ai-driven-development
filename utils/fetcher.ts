import type { IFeedResponse, IFeedQueryParams } from "@/types/feed";

export async function fetchFeed(
  params: IFeedQueryParams
): Promise<IFeedResponse> {
  const searchParams = new URLSearchParams({
    type: params.type,
    limit: String(params.limit ?? 20),
  });

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  const response = await fetch(`/api/feed?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? "피드를 불러오지 못했습니다."
    );
  }

  return response.json();
}
