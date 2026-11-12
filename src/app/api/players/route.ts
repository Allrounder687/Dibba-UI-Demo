import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { playerSchema } from "@/lib/validations";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";

export async function GET() {
  const items = await ClubRepository.getPlayers();
  return NextResponse.json({ players: items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !hasRole(session, ["super_admin", "editor"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = playerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const created = await ClubRepository.createPlayer(parsed.data, session.email);
  revalidatePath("/en/teams");
  revalidatePath("/ar/teams");
  return NextResponse.json({ player: created }, { status: 201 });
}
