import { NextRequest, NextResponse } from "next/server";
import { getMockFeedItems, paginateMockFeed } from "@/lib/mock/feed-data";
import type { FeedTab } from "@/types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function parseFeedType(value: string | null): FeedTab | null {
  if (value === "trending" || value === "latest") {
    return value;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = parseFeedType(searchParams.get("type"));
  const cursor = searchParams.get("cursor") ?? undefined;
  const limitParam = searchParams.get("limit");

  if (!type) {
    return NextResponse.json(
      { error: "INVALID_TYPE", message: "type은 trending 또는 latest여야 합니다." },
      { status: 400 }
    );
  }

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

  try {
    const allItems = getMockFeedItems(type);
    const result = paginateMockFeed(allItems, cursor, limit);

    await new Promise((resolve) => setTimeout(resolve, 400));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "INVALID_CURSOR", message: "잘못된 cursor 값입니다." },
      { status: 400 }
    );
  }
}
