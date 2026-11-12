import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { logEvent } from "./logger";

export const SESSION_COOKIE_NAME = "dibba_scc_session";

export type UserRole = "super_admin" | "editor" | "academy_manager";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  exp?: number;
}

function getSecretKey(): Uint8Array {
  const envSecret = process.env.AUTH_SECRET;
  if (!envSecret) {
    if (process.env.NODE_ENV === "production") {
      logEvent("warn", "auth_secret_missing_in_production");
    }
    // Ephemeral fallback for local development/testing only
    return new TextEncoder().encode("dibba-scc-local-dev-ephemeral-key-change-in-prod-2026");
  }
  return new TextEncoder().encode(envSecret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        name: typeof payload.name === "string" ? payload.name : "Admin",
        role: payload.role as UserRole,
        exp: payload.exp,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function hasRole(session: SessionPayload | null, allowed: UserRole[]): boolean {
  if (!session) return false;
  return allowed.includes(session.role);
}
