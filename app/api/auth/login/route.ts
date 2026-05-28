import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import {
  findUserByEmail,
  toAuthUser,
  encodeSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/mock/auth-data";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "입력 값이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const { email, password } = parsed.data;
  const user = findUserByEmail(email);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "가입되지 않은 계정입니다." },
      { status: 401 }
    );
  }

  if (user.password !== password) {
    return NextResponse.json(
      { success: false, error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true, user: toAuthUser(user) });
  response.cookies.set(SESSION_COOKIE_NAME, encodeSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
