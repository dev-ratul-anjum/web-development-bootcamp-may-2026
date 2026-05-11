import { NextRequest, NextResponse } from "next/server";
import { getDecodedCookies } from "./lib/cookies";

const protectedRoutes = ["/rooms", "/profile", "/settings", "/add-chat"];

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/sign-up";

  // Skip non-protected and non-auth routes
  if (
    !isAuthPage &&
    !protectedRoutes.includes(pathname) &&
    !pathname.startsWith("/rooms/")
  ) {
    return NextResponse.next();
  }

  const cookieHeader = await getDecodedCookies(); // Decode for signed cookie

  let result = { success: false };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/v1/me`,
      {
        headers: { Cookie: cookieHeader },
      },
    );
    result = await response.json();
  } catch (error) {
    console.error("Auth check failed:", error);
  }

  // If logged in and trying to access auth pages
  if (result.success && isAuthPage) {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  // If not logged in and trying to access protected pages
  if (
    !result.success &&
    (protectedRoutes.includes(pathname) || pathname.startsWith("/rooms/"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
  ],
};
