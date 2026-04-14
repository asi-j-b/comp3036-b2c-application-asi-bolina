import { cookies } from "next/headers";

export async function isLoggedIn() {
  const userCookies = await cookies();
  return userCookies.has("auth_token");
}
