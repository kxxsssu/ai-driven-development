// 공통 인터페이스/타입 정의 (.cursorrules: 인터페이스는 types/index.ts에 작성)

/* ----------------------------- Auth ----------------------------- */

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface ILoginSuccessResponse {
  success: true;
  user: IAuthUser;
}

export interface IAuthErrorResponse {
  success: false;
  error: string;
}

export type ILoginResponse = ILoginSuccessResponse | IAuthErrorResponse;

export interface ISessionResponse {
  authenticated: boolean;
  user: IAuthUser | null;
}

/* ----------------------------- Feed ----------------------------- */

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

/* -------------------------- Generation -------------------------- */

export type ImageStyle =
  | "Anime"
  | "Realistic"
  | "Fantasy"
  | "Cyberpunk"
  | "Oil Painting";

export type ImageRatio = "1:1" | "16:9" | "9:16";

export type GenerationStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface IGeneratedImage {
  id: string;
  url: string;
  style: ImageStyle;
  ratio: ImageRatio;
  prompt: string;
  createdAt: string;
}

export interface IGenerateRequest {
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  count: number;
}

export interface IGenerateCreateResponse {
  jobId: string;
  status: GenerationStatus;
}

export interface IGenerateStatusResponse {
  status: GenerationStatus;
  progress: number;
  images: IGeneratedImage[];
}

/* ----------------------------- Gallery -------------------------- */

export type Visibility = "public" | "private";

export type GalleryTab = "all" | "public" | "private";

export type GallerySort = "latest" | "oldest";

export interface IGalleryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  likes: number;
  visibility: Visibility;
  createdAt: string;
}

export interface IGalleryResponse {
  items: IGalleryItem[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface IGalleryQueryParams {
  sort: GallerySort;
  cursor?: string;
  limit?: number;
}

/* --------------------------- Image Detail ----------------------- */

export interface IImageDetail {
  id: string;
  imageUrl: string;
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  likes: number;
  isPublic: boolean;
  createdAt: string;
  author: IFeedAuthor;
}

/* ----------------------------- Profile -------------------------- */

export interface IProfileUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  uploadCount: number;
  likeCount: number;
}

export interface IProfileImage {
  id: string;
  imageUrl: string;
  likes: number;
  createdAt: string;
}

export interface IProfileResponse {
  items: IProfileImage[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
