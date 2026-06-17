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

const BASE = "https://api.football-data.org/v4";

async function fetchFD(path: string) {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) throw new Error("No API key");
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Auth-Token": key },
    next: { revalidate: 600 }, // 10 min cache per fetch
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    // 1 call — get list of finished group stage match IDs
    const list = await fetchFD("/competitions/WC/matches?stage=GROUP_STAGE");
    const finishedIds: number[] = (list.matches ?? [])
      .filter((m: { status: string }) => m.status === "FINISHED")
      .map((m: { id: number }) => m.id);

    const cardMap: Record<string, { yellow: number; red: number; yellowRed: number }> = {};
    const throwInMap: Record<string, number> = {};

    // N calls — one per finished match, each cached 10 min individually
    for (const id of finishedIds) {
      try {
        const match = await fetchFD(`/matches/${id}`);

        // Cards via bookings (Deep Data plan)
        for (const b of match.bookings ?? []) {
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
