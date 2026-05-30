import type { IFeedItem, FeedTab } from "@/types";
import { getPublicImages } from "@/lib/mock/images-data";
import { paginate } from "@/lib/mock/pagination";

// 피드는 중앙 이미지 소스(images-data)의 공개 작품을 IFeedItem 형태로 투영한다.
function toFeedItem(image: ReturnType<typeof getPublicImages>[number]): IFeedItem {
  return {
    id: image.id,
    imageUrl: image.imageUrl,
    likes: image.likes,
    isPublic: image.visibility === "public",
    createdAt: image.createdAt,
    author: image.author,
  };
}

export function getMockFeedItems(type: FeedTab): IFeedItem[] {
  const items = getPublicImages().map(toFeedItem);

  if (type === "trending") {
    return items.sort((a, b) => b.likes - a.likes);
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function paginateMockFeed(
  items: IFeedItem[],
  cursor: string | undefined,
  limit: number
): { items: IFeedItem[]; nextCursor: string | null; hasNextPage: boolean } {
  return paginate(items, cursor, limit);
}
