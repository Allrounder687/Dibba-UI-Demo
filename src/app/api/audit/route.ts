import { NextResponse } from "next/server";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession();
  if (!hasRole(session, ["super_admin"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await ClubRepository.getAuditLogs();
  return NextResponse.json({ auditLogs: logs });
}
