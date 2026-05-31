import { NextRequest, NextResponse } from "next/server";
import { getRequestUserId } from "@/lib/auth/get-request-user-id";
import { getGenerationJobStatus } from "@/lib/generation/job-store";
import { getReplicateApiToken } from "@/lib/replicate/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
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

  const userId = await getRequestUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const result = await getGenerationJobStatus(jobId, userId);

    if (!result) {
      return NextResponse.json(
        { error: "JOB_NOT_FOUND", message: "존재하지 않는 작업입니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/generate/[jobId]]", error);
    return NextResponse.json(
      {
        error: "STATUS_FETCH_FAILED",
        message: "생성 상태 조회에 실패했습니다.",
      },
      { status: 502 }
    );
  }
}
