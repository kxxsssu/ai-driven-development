export type FeedTab = "trending" | "latest";

export interface IFeedAuthor {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface IFeedItem {
  id: string;
  imageUrl: string;
  likes: number;
  isPublic: boolean;
  createdAt: string;
  author: IFeedAuthor;
}

export interface IComment {
  id: string;
  imageId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface IFeedResponse {
  items: IFeedItem[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface IFeedQueryParams {
  type: FeedTab;
  cursor?: string;
  limit?: number;
}
