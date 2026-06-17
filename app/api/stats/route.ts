import { NextResponse } from "next/server";
import { normalizeTeamName } from "@/lib/sweepstakes-data";

export interface CardEntry {
  team: string;
  yellow: number;
  red: number;
  yellowRed: number;
  total: number;
}

export interface ThrowInEntry {
  team: string;
  throwIns: number;
}

export interface StatsResponse {
  cards: CardEntry[];
  throwIns: ThrowInEntry[];
}

export async function GET() {
  try {
    const key = process.env.FOOTBALL_DATA_API_KEY;
    if (!key) return NextResponse.json({ cards: [], throwIns: [] });

    // Single API call — bulk endpoint includes bookings and statistics
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches?stage=GROUP_STAGE",
      {
        headers: { "X-Auth-Token": key },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return NextResponse.json({ cards: [], throwIns: [] });

    const data = await res.json();
    const matches: Array<{
      status: string;
      homeTeam: { name: string; statistics?: { throw_ins?: number } };
      awayTeam: { name: string; statistics?: { throw_ins?: number } };
      bookings: Array<{ team?: { name: string }; card: string }>;
    }> = data.matches ?? [];

    const cardMap: Record<string, { yellow: number; red: number; yellowRed: number }> = {};
    const throwInMap: Record<string, number> = {};

    for (const match of matches) {
      if (match.status === "TIMED" || match.status === "SCHEDULED") continue;

      // Cards from bookings
      for (const b of match.bookings ?? []) {
        const team = normalizeTeamName(b.team?.name ?? "");
        if (!team) continue;
        if (!cardMap[team]) cardMap[team] = { yellow: 0, red: 0, yellowRed: 0 };
        if (b.card === "YELLOW") cardMap[team].yellow++;
        else if (b.card === "RED") cardMap[team].red++;
        else if (b.card === "YELLOW_RED") cardMap[team].yellowRed++;
      }

      // Throw-ins from statistics (requires stats add-on)
      for (const side of [match.homeTeam, match.awayTeam]) {
        const throwIns = side?.statistics?.throw_ins;
        if (typeof throwIns !== "number") continue;
        const team = normalizeTeamName(side.name ?? "");
        if (!team) continue;
        throwInMap[team] = (throwInMap[team] ?? 0) + throwIns;
      }
    }

    const cards: CardEntry[] = Object.entries(cardMap)
      .map(([team, c]) => ({
        team,
        yellow: c.yellow,
        red: c.red,
        yellowRed: c.yellowRed,
        total: c.yellow + c.red + c.yellowRed,
      }))
      .sort((a, b) => b.total - a.total);

    const throwIns: ThrowInEntry[] = Object.entries(throwInMap)
      .map(([team, throwIns]) => ({ team, throwIns }))
      .sort((a, b) => b.throwIns - a.throwIns);

    return NextResponse.json({ cards, throwIns });
  } catch {
    return NextResponse.json({ cards: [], throwIns: [] });
  }
}
