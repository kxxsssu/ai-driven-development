import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "canvashub_session";
const PROTECTED_ROUTES = ["/create", "/gallery", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // :path*만 쓰면 /gallery, /profile 루트가 누락될 수 있어 명시한다.
  matcher: [
    "/create",
    "/create/:path*",
    "/gallery",
    "/gallery/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
