import { NextRequest, NextResponse } from "next/server";
import { CURRENT_USER, getPublicImagesByAuthor } from "@/lib/mock/images-data";
import { paginate } from "@/lib/mock/pagination";
import type { IProfileImage } from "@/types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
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

  const authorId = id === "me" ? CURRENT_USER.id : id;

  // 프로필에는 공개 작품만 최신순으로 노출한다.
  const items: IProfileImage[] = getPublicImagesByAuthor(authorId)
    .map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      likes: image.likes,
      createdAt: image.createdAt,
    }))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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
