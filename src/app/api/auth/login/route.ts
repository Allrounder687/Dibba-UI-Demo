import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { ClubRepository } from "@/db/repository";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logEvent } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`login:${clientIp}`, 10, 60_000);
  if (!rate.allowed) {
    logEvent("warn", "login_rate_limited", { clientIp });
    return NextResponse.json(
      { error: "Too many login attempts. Please wait one minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const user = await ClubRepository.authenticateAdmin(
    parsed.data.email,
    parsed.data.password
  );

  if (!user) {
    logEvent("warn", "admin_login_failed", { email: parsed.data.email, clientIp });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await ClubRepository.addAuditLog(
    user.email,
    "ADMIN_LOGIN",
    "session",
    user.id,
    `IP: ${clientIp}`
  );

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
