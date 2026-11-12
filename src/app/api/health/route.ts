import { NextResponse } from "next/server";
import { ClubRepository } from "@/db/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbHealth = await ClubRepository.checkHealth();
  const payload = {
    status: dbHealth.ok ? "healthy" : "degraded",
    service: "dibba-scc-platform",
    storage: dbHealth.storage,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload, { status: dbHealth.ok ? 200 : 503 });
}
