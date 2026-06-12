const BASE_URL = "https://api.football-data.org/v4";
const WC_CODE = "WC";

async function fetchFD(path: string, revalidate = 300) {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) throw new Error("FOOTBALL_DATA_API_KEY not set");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": key },
    next: { revalidate },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`football-data.org ${res.status}: ${text}`);
  }
  return res.json();
}

interface MatchTeamStats {
  corner_kicks?: number;
  free_kicks?: number;
  goal_kicks?: number;
  offsides?: number;
  fouls?: number;
  ball_possession?: number;
  saves?: number;
  throw_ins?: number;
  shots?: number;
  shots_on_goal?: number;
  shots_off_goal?: number;
  yellow_cards?: number;
  yellow_red_cards?: number;
  red_cards?: number;
}

interface DetailedMatch {
  id: number;
  stage: string;
  status: string;
  homeTeam: { id: number; name: string; statistics?: MatchTeamStats };
  awayTeam: { id: number; name: string; statistics?: MatchTeamStats };
  score: { fullTime: { home: number | null; away: number | null } };
}

export interface WCMatch {
  id: number;
  stage: string;
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

export interface TeamCardStats {
  team: string;
  yellow: number;
  red: number;
  yellowRed: number;
  total: number;
}

export interface TeamThrowInStats {
  team: string;
  throwIns: number;
}

async function getFinishedGroupStageMatchIds(): Promise<number[]> {
  const data = await fetchFD(`/competitions/${WC_CODE}/matches?stage=GROUP_STAGE`);
  const matches: WCMatch[] = data.matches ?? [];
  return matches
    .filter((m) => m.status !== "TIMED" && m.status !== "SCHEDULED")
    .map((m) => m.id);
}

async function fetchMatchDetail(id: number): Promise<DetailedMatch | null> {
  try {
    return await fetchFD(`/matches/${id}`);
  } catch {
    return null;
  }
}

// Fetch finished group stage matches individually to get bookings + statistics.
// Cached for 5 min — runs once per revalidation window, not per user request.
async function getFinishedGroupStageDetails(): Promise<DetailedMatch[]> {
  const ids = await getFinishedGroupStageMatchIds();
  const results: DetailedMatch[] = [];
  for (const id of ids) {
    const match = await fetchMatchDetail(id);
    if (match) results.push(match);
  }
  return results;
}

export async function getGroupStageMatches(): Promise<WCMatch[]> {
  try {
    const data = await fetchFD(`/competitions/${WC_CODE}/matches?stage=GROUP_STAGE`);
    return data.matches ?? [];
  } catch {
    return [];
  }
}

export async function getAllMatches(): Promise<WCMatch[]> {
  try {
    const data = await fetchFD(`/competitions/${WC_CODE}/matches`);
    return data.matches ?? [];
  } catch {
    return [];
  }
}

export async function getCardStats(): Promise<TeamCardStats[]> {
  try {
    const matches = await getFinishedGroupStageDetails();
    const map: Record<string, { yellow: number; red: number; yellowRed: number }> = {};

    for (const m of matches) {
      // Use bookings array (available on Deep Data plan)
      const bookings: Array<{ team?: { name: string }; type: string }> =
        (m as unknown as { bookings?: Array<{ team?: { name: string }; type: string }> })
          .bookings ?? [];

      for (const b of bookings) {
        const name = b.team?.name;
        if (!name) continue;
        if (!map[name]) map[name] = { yellow: 0, red: 0, yellowRed: 0 };
        if (b.type === "YELLOW_CARD") map[name].yellow++;
        else if (b.type === "RED_CARD") map[name].red++;
        else if (b.type === "YELLOW_RED_CARD") map[name].yellowRed++;
      }
    }

    return Object.entries(map)
      .map(([team, c]) => ({
        team,
        yellow: c.yellow,
        red: c.red,
        yellowRed: c.yellowRed,
        total: c.yellow + c.red + c.yellowRed,
      }))
      .sort((a, b) => b.total - a.total);
  } catch {
    return [];
  }
}

// Throw-ins require the statistics add-on (pending activation).
// Returns empty array until the add-on is active, at which point
// the statistics block on each match detail will populate automatically.
export async function getThrowInStats(): Promise<TeamThrowInStats[]> {
  try {
    const matches = await getFinishedGroupStageDetails();
    const map: Record<string, number> = {};

    for (const m of matches) {
      for (const side of [m.homeTeam, m.awayTeam]) {
        const s = side.statistics;
        if (!s) continue;
        const name = side.name;
        map[name] = (map[name] ?? 0) + (s.throw_ins ?? 0);
      }
    }

    return Object.entries(map)
      .map(([team, throwIns]) => ({ team, throwIns }))
      .sort((a, b) => b.throwIns - a.throwIns);
  } catch {
    return [];
  }
}

export interface StandingRow {
  position: number;
  team: { name: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface Group {
  stage: string;
  group: string;
  table: StandingRow[];
}

export async function getStandings(): Promise<Group[]> {
  try {
    const data = await fetchFD(`/competitions/${WC_CODE}/standings?season=2026`);
    return data.standings ?? [];
  } catch {
    return [];
  }
}

export async function getCurrentChampion(): Promise<string | null> {
  try {
    const data = await fetchFD(`/competitions/${WC_CODE}/matches?stage=FINAL`);
    const finals: WCMatch[] = data.matches ?? [];
    const finished = finals.find((m) => m.status === "FINISHED");
    if (!finished) return null;
    const home = finished.score.fullTime.home ?? 0;
    const away = finished.score.fullTime.away ?? 0;
    if (home > away) return finished.homeTeam.name;
    if (away > home) return finished.awayTeam.name;
    return null;
  } catch {
    return null;
  }
}
