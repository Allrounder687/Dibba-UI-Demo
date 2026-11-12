import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await getServerSession();
  if (!hasRole(session, ["super_admin", "editor", "academy_manager"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await ClubRepository.getEnquiries();
  return NextResponse.json({ enquiries: items });
}

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`enquiry:${clientIp}`, 15, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const created = await ClubRepository.createEnquiry({
    type: parsed.data.type,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    subject: parsed.data.subject,
    program: parsed.data.program ?? null,
    playerAge: parsed.data.playerAge ?? null,
    message: parsed.data.message,
  });

  return NextResponse.json({ enquiry: created }, { status: 201 });
}
