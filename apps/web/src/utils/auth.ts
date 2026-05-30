import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "@repo/env/web";

const WEB_AUTH_COOKIE = "web_auth_token";

type CustomerSession = {
  id?: string;
  email: string;
  role: typeof Role.CUSTOMER;
};

type AuthTokenPayload = {
  sub?: string;
  email?: string;
  role?: string;
};

export function verifyCustomerToken(token: string): CustomerSession | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

    if (decoded.role !== Role.CUSTOMER || !decoded.email) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      role: Role.CUSTOMER,
    };
  } catch {
    return null;
  }
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(WEB_AUTH_COOKIE)?.value;

  return token ? verifyCustomerToken(token) : null;
}

export async function getCustomerEmail() {
  const session = await getCustomerSession();
  return session?.email ?? null;
}

export async function isCustomerAuthenticated() {
  return (await getCustomerSession()) !== null;
}
