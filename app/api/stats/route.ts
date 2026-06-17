import { NextResponse } from "next/server";
import { normalizeTeamName } from "@/lib/sweepstakes-data";

const BASE_URL = "https://api.football-data.org/v4";

async function fetchFD(path: string) {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) throw new Error("FOOTBALL_DATA_API_KEY not set");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": key },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`football-data.org ${res.status}`);
  return res.json();
}

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
    // 1 call — get all group stage matches and finished IDs
    const listData = await fetchFD("/competitions/WC/matches?stage=GROUP_STAGE");
    const allMatches: Array<{ id: number; status: string }> = listData.matches ?? [];
    const finishedIds = allMatches
      .filter((m) => m.status !== "TIMED" && m.status !== "SCHEDULED")
      .map((m) => m.id);

    // N calls — one per finished match (shared between cards + throw-ins)
    const cardMap: Record<string, { yellow: number; red: number; yellowRed: number }> = {};
    const throwInMap: Record<string, number> = {};

    for (const id of finishedIds) {
      try {
        const match = await fetchFD(`/matches/${id}`);

        // Cards via bookings (Deep Data plan)
        const bookings: Array<{ team?: { name: string }; card: string }> =
          match.bookings ?? [];
        for (const b of bookings) {
          const team = normalizeTeamName(b.team?.name ?? "");
          if (!team) continue;
          if (!cardMap[team]) cardMap[team] = { yellow: 0, red: 0, yellowRed: 0 };
          if (b.card === "YELLOW") cardMap[team].yellow++;
          else if (b.card === "RED") cardMap[team].red++;
          else if (b.card === "YELLOW_RED") cardMap[team].yellowRed++;
        }

        // Throw-ins via statistics (requires stats add-on)
        for (const side of [match.homeTeam, match.awayTeam]) {
          const throwIns = side?.statistics?.throw_ins;
          if (typeof throwIns !== "number") continue;
          const team = normalizeTeamName(side.name ?? "");
          if (!team) continue;
          throwInMap[team] = (throwInMap[team] ?? 0) + throwIns;
        }
      } catch {
        // skip individual match errors
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
