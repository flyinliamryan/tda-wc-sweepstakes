import { NextResponse } from "next/server";
import { getCardStats } from "@/lib/football-api";
import { normalizeTeamName } from "@/lib/sweepstakes-data";

export interface CardEntry {
  team: string;
  yellow: number;
  red: number;
  yellowRed: number;
  total: number;
}

export async function GET() {
  const raw = await getCardStats();
  const results: CardEntry[] = raw.map((e) => ({
    team: normalizeTeamName(e.team),
    yellow: e.yellow,
    red: e.red,
    yellowRed: e.yellowRed,
    total: e.total,
  }));
  return NextResponse.json(results);
}
