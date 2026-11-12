import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ClubRepository } from "@/db/repository";
import { getServerSession, hasRole } from "@/lib/auth";

async function authorizeSync(req: NextRequest): Promise<string | null> {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return "cron@dibbaclub.ae";
  }
  const session = await getServerSession();
  if (session && hasRole(session, ["super_admin", "editor"])) {
    return session.email;
  }
  return null;
}

async function handleSync(req: NextRequest) {
  const actorEmail = await authorizeSync(req);
  if (!actorEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  const teamId = process.env.API_FOOTBALL_TEAM_ID;
  let externalSynced = 0;
  let feedMode: "api_football" | "local_recalculation" = "local_recalculation";

  if (apiKey && teamId) {
    try {
      const season = process.env.API_FOOTBALL_SEASON || String(new Date().getFullYear());
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?team=${encodeURIComponent(teamId)}&season=${encodeURIComponent(season)}&next=5`,
        {
          headers: { "x-apisports-key": apiKey },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const json = (await res.json()) as {
          response?: Array<{
            fixture: { date: string; venue?: { name?: string }; status?: { short?: string } };
            league: { name?: string };
            teams: {
              home: { name: string; logo: string };
              away: { name: string; logo: string };
            };
            goals: { home: number | null; away: number | null };
          }>;
        };
        const existingMatches = await ClubRepository.getMatches();
        for (const item of json.response ?? []) {
          const kickoffIso = item.fixture.date;
          const alreadyExists = existingMatches.some(
            (m) =>
              m.homeTeamEn.toLowerCase() === item.teams.home.name.toLowerCase() &&
              m.awayTeamEn.toLowerCase() === item.teams.away.name.toLowerCase() &&
              m.kickoffAt.slice(0, 10) === kickoffIso.slice(0, 10)
          );
          if (!alreadyExists) {
            const isFinished = item.fixture.status?.short === "FT";
            await ClubRepository.createMatch(
              {
                competitionEn: item.league.name || "UAE First Division League",
                competitionAr: "دوري الدرجة الأولى الإماراتي",
                homeTeamEn: item.teams.home.name,
                homeTeamAr: item.teams.home.name,
                homeLogo: "/assets/dibba-fc-logo-glossly-750.png",
                awayTeamEn: item.teams.away.name,
                awayTeamAr: item.teams.away.name,
                awayLogo: "/assets/FIRST-DIVISION-LEAGUE-LOGO-2.png",
                homeScore: item.goals.home,
                awayScore: item.goals.away,
                status: isFinished ? "finished" : "scheduled",
                kickoffAt: kickoffIso,
                venueEn: item.fixture.venue?.name || "Dibba Stadium",
                venueAr: item.fixture.venue?.name || "استاد دبا",
                isNextMatch: false,
              },
              actorEmail
            );
            externalSynced += 1;
          }
        }
        feedMode = "api_football";
      }
    } catch {
      // Safely proceed with local standings recalculation
    }
  }

  const standings = await ClubRepository.recalculateStandingsFromMatches(actorEmail);

  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/matches");
  revalidatePath("/ar/matches");

  return NextResponse.json({
    ok: true,
    feedMode,
    externalSynced,
    standingsCount: standings.length,
    standings,
  });
}

export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}
