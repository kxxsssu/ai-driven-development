import type {
  IFeedResponse,
  IFeedQueryParams,
  IGalleryResponse,
  IGalleryQueryParams,
  IImageDetail,
  IProfileResponse,
  IProfileUser,
} from "@/types";

async function getJson<T>(url: string, fallbackMessage: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? fallbackMessage);
  }

  return response.json();
}

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

  return getJson<IFeedResponse>(
    `/api/feed?${searchParams.toString()}`,
    "피드를 불러오지 못했습니다."
  );
}

export async function fetchGallery(
  params: IGalleryQueryParams
): Promise<IGalleryResponse> {
  const searchParams = new URLSearchParams({
    sort: params.sort,
    limit: String(params.limit ?? 20),
  });

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  return getJson<IGalleryResponse>(
    `/api/gallery?${searchParams.toString()}`,
    "갤러리를 불러오지 못했습니다."
  );
}

export async function fetchImageDetail(id: string): Promise<IImageDetail> {
  return getJson<IImageDetail>(
    `/api/images/${id}`,
    "이미지를 불러오지 못했습니다."
  );
}

export async function fetchProfile(id: string): Promise<IProfileUser> {
  return getJson<IProfileUser>(
    `/api/profile/${id}`,
    "프로필을 불러오지 못했습니다."
  );
}

export async function fetchProfileImages(
  id: string,
  cursor?: string,
  limit = 20
): Promise<IProfileResponse> {
  const searchParams = new URLSearchParams({ limit: String(limit) });
  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  return getJson<IProfileResponse>(
    `/api/profile/${id}/images?${searchParams.toString()}`,
    "작품을 불러오지 못했습니다."
  );
}
