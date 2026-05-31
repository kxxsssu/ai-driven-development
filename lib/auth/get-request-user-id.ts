import type { NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/mock/auth-data";

export function getRequestUserId(request: NextRequest): string | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}
