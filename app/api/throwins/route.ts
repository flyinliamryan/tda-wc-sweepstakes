import { NextResponse } from "next/server";
import { getThrowInStats } from "@/lib/football-api";
import { normalizeTeamName } from "@/lib/sweepstakes-data";

export async function GET() {
  const raw = await getThrowInStats();
  const results = raw.map((e) => ({
    team: normalizeTeamName(e.team),
    throwIns: e.throwIns,
  }));
  return NextResponse.json(results);
}
