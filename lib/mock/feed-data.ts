import type { IFeedItem, FeedTab } from "@/types/feed";

const AUTHORS = [
  { id: "user-1", name: "아트크리에이터", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=art1" },
  { id: "user-2", name: "네온드리머", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=neon2" },
  { id: "user-3", name: "판타지메이커", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fantasy3" },
  { id: "user-4", name: "사이버페인터", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=cyber4" },
  { id: "user-5", name: "일러스트허브", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=illus5" },
  { id: "user-6", name: "캔버스러버", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=canvas6" },
];

function buildFeedItem(index: number): IFeedItem {
  const author = AUTHORS[index % AUTHORS.length];
  const seed = `canvashub-${index}`;
  const daysAgo = index % 30;
  const createdAt = new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000 - (index % 12) * 60 * 60 * 1000
  ).toISOString();

  return {
    id: `img-${index + 1}`,
    imageUrl: `https://picsum.photos/seed/${seed}/${400 + (index % 3) * 80}/${500 + (index % 4) * 120}`,
    likes: Math.max(12, 2400 - index * 37 + (index % 7) * 89),
    isPublic: index % 9 !== 0,
    createdAt,
    author,
  };
}

const ALL_FEED_ITEMS: IFeedItem[] = Array.from({ length: 48 }, (_, i) =>
  buildFeedItem(i)
);

export function getMockFeedItems(type: FeedTab): IFeedItem[] {
  const publicItems = ALL_FEED_ITEMS.filter((item) => item.isPublic);

  if (type === "trending") {
    return [...publicItems].sort((a, b) => b.likes - a.likes);
  }

  return [...publicItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function paginateMockFeed(
  items: IFeedItem[],
  cursor: string | undefined,
  limit: number
): { items: IFeedItem[]; nextCursor: string | null; hasNextPage: boolean } {
  const startIndex = cursor ? parseInt(cursor, 10) : 0;

  if (Number.isNaN(startIndex) || startIndex < 0) {
    throw new Error("INVALID_CURSOR");
  }

  const pageItems = items.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + limit;
  const hasNextPage = nextIndex < items.length;

  return {
    items: pageItems,
    nextCursor: hasNextPage ? String(nextIndex) : null,
    hasNextPage,
  };
}
