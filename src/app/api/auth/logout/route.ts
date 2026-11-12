import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getServerSession } from "@/lib/auth";
import { ClubRepository } from "@/db/repository";

export async function POST() {
  const session = await getServerSession();
  if (session) {
    await ClubRepository.addAuditLog(
      session.email,
      "ADMIN_LOGOUT",
      "session",
      session.userId,
      "User signed out"
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
