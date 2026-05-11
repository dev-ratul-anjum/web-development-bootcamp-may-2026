"use server";

import { cookies } from "next/headers";
import { getDecodedCookies } from "@/lib/cookies";

const logoutUser = async () => {
  const cookieHeader = await getDecodedCookies();

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
    });

    // Explicitly clear cookies in Next.js
    const cookieStore = await cookies();

    if (process.env.ACCESS_TOKEN_NAME)
      cookieStore.delete(process.env.ACCESS_TOKEN_NAME);

    return {
      success: true,
      message: "Logged out successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message: "Failed to logout. Please try again.",
    };
  }
};

export default logoutUser;
