import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { matchSchema } from "@/lib/validations";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";

export async function GET() {
  const items = await ClubRepository.getMatches();
  return NextResponse.json({ matches: items });
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

  const parsed = matchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const created = await ClubRepository.createMatch(parsed.data, session.email);
  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/matches");
  revalidatePath("/ar/matches");
  return NextResponse.json({ match: created }, { status: 201 });
}
