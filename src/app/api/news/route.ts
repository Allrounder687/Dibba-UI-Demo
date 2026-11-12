import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { newsArticleSchema } from "@/lib/validations";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const includeDraftsParam = req.nextUrl.searchParams.get("includeDrafts") === "true";
  let includeDrafts = false;
  if (includeDraftsParam) {
    const session = await getServerSession();
    includeDrafts = hasRole(session, ["super_admin", "editor"]);
  }

  const articles = await ClubRepository.getNews(includeDrafts);
  return NextResponse.json({ articles });
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

  const parsed = newsArticleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const created = await ClubRepository.createNews(parsed.data, session.email);
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/en/news");
    revalidatePath("/ar/news");
    return NextResponse.json({ article: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create article" },
      { status: 409 }
    );
  }
}
