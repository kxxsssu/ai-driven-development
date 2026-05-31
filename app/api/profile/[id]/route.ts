import { NextResponse } from "next/server";
import { CURRENT_USER, getProfile } from "@/lib/mock/images-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // "me"는 현재 로그인 사용자로 해석한다.
  const authorId = id === "me" ? CURRENT_USER.id : id;
  const profile = getProfile(authorId);

  if (!profile) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "사용자를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(profile);
}
