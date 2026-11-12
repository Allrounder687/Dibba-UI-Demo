import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";

const statusUpdateSchema = z.object({
  status: z.enum(["new", "in_review", "resolved"]),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session || !hasRole(session, ["super_admin", "editor", "academy_manager"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = statusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await ClubRepository.updateEnquiryStatus(
    numId,
    parsed.data.status,
    session.email
  );
  if (!updated) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ enquiry: updated });
}
