import { NextResponse } from "next/server";
import { getImageById } from "@/lib/mock/images-data";
import type { IImageDetail } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const image = getImageById(params.id);

  if (!image) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "이미지를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const detail: IImageDetail = {
    id: image.id,
    imageUrl: image.imageUrl,
    prompt: image.prompt,
    style: image.style,
    ratio: image.ratio,
    likes: image.likes,
    isPublic: image.visibility === "public",
    createdAt: image.createdAt,
    author: image.author,
  };

  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(detail);
}
