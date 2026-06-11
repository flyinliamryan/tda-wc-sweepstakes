import { NextResponse } from "next/server";
import { getAllMatches, getCurrentChampion } from "@/lib/football-api";
import { normalizeTeamName } from "@/lib/sweepstakes-data";

export async function GET() {
  const [matches, champion] = await Promise.all([getAllMatches(), getCurrentChampion()]);

  const recent = matches
    .filter((m) => m.status === "FINISHED")
    .slice(-10)
    .reverse()
    .map((m) => ({
      id: m.id,
      stage: m.stage,
      home: normalizeTeamName(m.homeTeam.name),
      away: normalizeTeamName(m.awayTeam.name),
      homeScore: m.score.fullTime.home,
      awayScore: m.score.fullTime.away,
    }));

  const upcoming = matches
    .filter((m) => m.status === "TIMED" || m.status === "SCHEDULED")
    .slice(0, 8)
    .map((m) => ({
      id: m.id,
      stage: m.stage,
      home: normalizeTeamName(m.homeTeam.name),
      away: normalizeTeamName(m.awayTeam.name),
    }));

  return NextResponse.json({ recent, upcoming, champion });
}
