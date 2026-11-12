import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";
import { matchUpdateSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session || !hasRole(session, ["super_admin", "editor"])) {
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

  const parsed = matchUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid match update payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await ClubRepository.updateMatch(numId, parsed.data, session.email);
  if (!updated) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/matches");
  revalidatePath("/ar/matches");
  return NextResponse.json({ match: updated });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session || !hasRole(session, ["super_admin", "editor"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const ok = await ClubRepository.deleteMatch(numId, session.email);
  if (!ok) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/matches");
  revalidatePath("/ar/matches");
  return NextResponse.json({ ok: true });
}
