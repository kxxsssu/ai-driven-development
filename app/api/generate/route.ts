import { NextRequest, NextResponse } from "next/server";
import { createJob } from "@/lib/mock/generation-data";
import {
  STYLE_OPTIONS,
  RATIO_OPTIONS,
  MIN_COUNT,
  MAX_COUNT,
  MAX_PROMPT_LENGTH,
} from "@/lib/generation-options";
import type { ImageRatio, ImageStyle } from "@/types/generation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const { prompt, style, ratio, count } = body as Record<string, unknown>;

  if (
    typeof prompt !== "string" ||
    prompt.trim().length < 1 ||
    prompt.length > MAX_PROMPT_LENGTH
  ) {
    return NextResponse.json(
      { error: "INVALID_PROMPT", message: "프롬프트를 확인해주세요." },
      { status: 400 }
    );
  }

  if (typeof style !== "string" || !STYLE_OPTIONS.includes(style as ImageStyle)) {
    return NextResponse.json(
      { error: "INVALID_STYLE", message: "스타일을 선택해주세요." },
      { status: 400 }
    );
  }

  if (typeof ratio !== "string" || !RATIO_OPTIONS.includes(ratio as ImageRatio)) {
    return NextResponse.json(
      { error: "INVALID_RATIO", message: "비율을 선택해주세요." },
      { status: 400 }
    );
  }

  const countNum = Number(count);
  if (!Number.isInteger(countNum) || countNum < MIN_COUNT || countNum > MAX_COUNT) {
    return NextResponse.json(
      { error: "INVALID_COUNT", message: "생성 개수는 1~4 사이여야 합니다." },
      { status: 400 }
    );
  }

  const jobId = createJob({
    prompt: prompt.trim(),
    style: style as ImageStyle,
    ratio: ratio as ImageRatio,
    count: countNum,
  });

  return NextResponse.json({ jobId, status: "queued" });
}
