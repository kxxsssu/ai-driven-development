import { NextRequest, NextResponse } from "next/server";
import {
  decodeSession,
  MOCK_USERS,
  toAuthUser,
  SESSION_COOKIE_NAME,
} from "@/lib/mock/auth-data";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const userId = decodeSession(token);
  const user = userId
    ? MOCK_USERS.find((candidate) => candidate.id === userId)
    : undefined;

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({ authenticated: true, user: toAuthUser(user) });
}
