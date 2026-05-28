import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import {
  findUserByEmail,
  createMockUser,
  toAuthUser,
  encodeSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/mock/auth-data";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "입력 값이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const { name, email, password } = parsed.data;

  if (findUserByEmail(email)) {
    return NextResponse.json(
      { success: false, error: "이미 사용 중인 이메일입니다." },
      { status: 409 }
    );
  }

  const user = createMockUser(name, email, password);

  const response = NextResponse.json({ success: true, user: toAuthUser(user) });
  response.cookies.set(SESSION_COOKIE_NAME, encodeSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
