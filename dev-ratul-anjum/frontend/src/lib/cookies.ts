import { toMilliseconds } from "@/utils/timeConverter";
import { cookies } from "next/headers";

export async function forwardCookie(setCookieHeader: string) {
  if (!setCookieHeader) return;

  const COOKIE_NAME = process.env.ACCESS_TOKEN_NAME!;

  // Extract token value from Set-Cookie header
  const tokenValue = setCookieHeader.split(";")[0].split("=")[1];

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, tokenValue, {
    httpOnly: true,
    path: "/", // available for all paths
    maxAge: toMilliseconds(process.env.ACCESS_TOKEN_EXPIRES_IN!),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
}

/**
 * Reads all cookies from the request, converts them to a string,
 * and decodes any URL-encoded characters.
 *
 * @returns {Promise<string>} Decoded cookie header string
 */
export async function getDecodedCookies(): Promise<string> {
  const cookieStore = await cookies();
  let cookieHeader = cookieStore.toString();

  const cookieName = process.env.ACCESS_TOKEN_NAME;
  const regex = new RegExp(`${cookieName}=([^;]+)`);
  const cookieMatch = cookieHeader.match(regex);

  if (cookieMatch) {
    let cookieValue = cookieMatch[1];

    if (cookieValue.startsWith("s%253A")) {
      cookieValue = decodeURIComponent(cookieValue); // decode
      cookieHeader = cookieHeader.replace(cookieMatch[1], cookieValue);
    }
  }

  return cookieHeader;
}
