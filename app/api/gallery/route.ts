import { NextRequest, NextResponse } from "next/server";
import { getOwnerImages } from "@/lib/mock/images-data";
import { paginate } from "@/lib/mock/pagination";
import type { GallerySort, IGalleryItem } from "@/types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function parseSort(value: string | null): GallerySort {
  return value === "oldest" ? "oldest" : "latest";
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sort = parseSort(searchParams.get("sort"));
  const cursor = searchParams.get("cursor") ?? undefined;
  const limitParam = searchParams.get("limit");

  let limit = DEFAULT_LIMIT;
  if (limitParam) {
    const parsed = parseInt(limitParam, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return NextResponse.json(
        { error: "INVALID_LIMIT", message: "limit은 1 이상의 숫자여야 합니다." },
        { status: 400 }
      );
    }
    limit = Math.min(parsed, MAX_LIMIT);
  }

  // 갤러리는 탭(공개/비공개) 필터를 클라이언트에서 적용하므로
  // 여기서는 내 작품 전체를 정렬해 반환한다. (낙관적 공개 토글 대응)
  const items: IGalleryItem[] = getOwnerImages()
    .map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      prompt: image.prompt,
      style: image.style,
      ratio: image.ratio,
      likes: image.likes,
      visibility: image.visibility,
      createdAt: image.createdAt,
    }))
    .sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "oldest" ? -diff : diff;
    });

  try {
    const result = paginate(items, cursor, limit);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "INVALID_CURSOR", message: "잘못된 cursor 값입니다." },
      { status: 400 }
    );
  }
}
