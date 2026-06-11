import { NextResponse } from "next/server";
import { getGroupStageMatches } from "@/lib/football-api";
import { normalizeTeamName } from "@/lib/sweepstakes-data";

export interface CardEntry {
  team: string;
  yellow: number;
  red: number;
  yellowRed: number;
  total: number;
}

export async function GET() {
  const matches = await getGroupStageMatches();
  const cardMap: Record<string, { yellow: number; red: number; yellowRed: number }> = {};

  for (const match of matches) {
    if (match.status === "TIMED" || match.status === "SCHEDULED") continue;
    const bookings: Array<{ team?: { name: string }; type: string }> =
      (match as unknown as { bookings?: Array<{ team?: { name: string }; type: string }> })
        .bookings ?? [];
    for (const b of bookings) {
      const rawName = b.team?.name ?? "";
      if (!rawName) continue;
      const team = normalizeTeamName(rawName);
      if (!cardMap[team]) cardMap[team] = { yellow: 0, red: 0, yellowRed: 0 };
      if (b.type === "YELLOW_CARD") cardMap[team].yellow++;
      else if (b.type === "RED_CARD") cardMap[team].red++;
      else if (b.type === "YELLOW_RED_CARD") cardMap[team].yellowRed++;
    }
  }

  const results: CardEntry[] = Object.entries(cardMap)
    .map(([team, c]) => ({
      team,
      yellow: c.yellow,
      red: c.red,
      yellowRed: c.yellowRed,
      total: c.yellow + c.red + c.yellowRed,
    }))
    .sort((a, b) => b.total - a.total);

  return NextResponse.json(results);
}
