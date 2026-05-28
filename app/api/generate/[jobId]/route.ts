import { NextResponse } from "next/server";
import { getJobStatus } from "@/lib/mock/generation-data";

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string } }
) {
  const result = getJobStatus(params.jobId);

  if (!result) {
    return NextResponse.json(
      { error: "JOB_NOT_FOUND", message: "존재하지 않는 작업입니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
