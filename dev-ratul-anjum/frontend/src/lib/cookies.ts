import { cookies } from "next/headers";

export async function getDecodedCookies(): Promise<string> {
  const cookieStore = await cookies();
  console.log("cookieStore main : ", cookieStore);
  const cookieHeader = cookieStore.toString();
    console.log("cookieHeader main : ", cookieHeader);

  return cookieHeader;
}
