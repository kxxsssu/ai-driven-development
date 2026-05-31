import { NextRequest, NextResponse } from "next/server";
import { getRequestUserId } from "@/lib/auth/get-request-user-id";
import { createGenerationJob } from "@/lib/generation/job-store";
import {
  STYLE_OPTIONS,
  RATIO_OPTIONS,
  MIN_COUNT,
  MAX_COUNT,
  MAX_PROMPT_LENGTH,
} from "@/lib/generation-options";
import { getReplicateApiToken } from "@/lib/replicate/client";
import { formatReplicateError } from "@/lib/replicate/format-error";
import type { ImageRatio, ImageStyle } from "@/types";

export async function POST(request: NextRequest) {
  if (!getReplicateApiToken()) {
    return NextResponse.json(
      {
        error: "REPLICATE_NOT_CONFIGURED",
        message:
          "Replicate API 토큰이 설정되지 않았습니다. .env.local에 REPLICATE_API_TOKEN을 추가해주세요.",
      },
      { status: 503 }
    );
  }

  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

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

  try {
    const jobId = await createGenerationJob({
      userId,
      prompt: prompt.trim(),
      style: style as ImageStyle,
      ratio: ratio as ImageRatio,
      count: countNum,
    });

    return NextResponse.json({ jobId, status: "queued" });
  } catch (error) {
    console.error("[POST /api/generate]", error);
    const formatted = formatReplicateError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
