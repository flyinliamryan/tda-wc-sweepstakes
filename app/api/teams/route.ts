import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) return NextResponse.json({});

  const res = await fetch("https://api.football-data.org/v4/competitions/WC/teams", {
    headers: { "X-Auth-Token": key },
    next: { revalidate: 86400 }, // crests don't change — cache 24h
  });

  if (!res.ok) return NextResponse.json({});

  const data = await res.json();
  const crests: Record<string, string> = {};
  for (const team of data.teams ?? []) {
    if (team.name && team.crest) crests[team.name] = team.crest;
    // also index by shortName so partial matches work
    if (team.shortName && team.crest) crests[team.shortName] = team.crest;
  }

  return NextResponse.json(crests);
}
