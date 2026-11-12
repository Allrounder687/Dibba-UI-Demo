import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";
import { newsUpdateSchema } from "@/lib/validations";

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

  const rawText = await req.text();
  let updated = null;
  if (!rawText.trim()) {
    updated = await ClubRepository.toggleNewsPublish(numId, session.email);
  } else {
    let body: unknown;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = newsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid article update payload", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    updated = await ClubRepository.updateNews(numId, parsed.data, session.email);
  }

  if (!updated) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/news");
  revalidatePath("/ar/news");
  return NextResponse.json({ article: updated });
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

  const ok = await ClubRepository.deleteNews(numId, session.email);
  if (!ok) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/news");
  revalidatePath("/ar/news");
  return NextResponse.json({ ok: true });
}
