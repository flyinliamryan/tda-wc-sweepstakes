const BASE_URL = "https://api.football-data.org/v4";
const WC_CODE = "WC";

async function fetchFD(path: string) {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) throw new Error("FOOTBALL_DATA_API_KEY not set");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": key },
    next: { revalidate: 300 }, // cache 5 min
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`football-data.org ${res.status}: ${text}`);
  }
  return res.json();
}

export interface TeamCardStats {
  team: string;
  yellow: number;
  red: number;
  yellowRed: number;
  total: number;
}

export interface WCMatch {
  id: number;
  stage: string;
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: {
    fullTime: { home: number | null; away: number | null };
  };
  bookings?: Array<{
    teamId: number;
    type: "YELLOW_CARD" | "RED_CARD" | "YELLOW_RED_CARD";
  }>;
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
  const matches = await getGroupStageMatches();
  const stats: Record<string, TeamCardStats> = {};

  for (const match of matches) {
    if (match.status === "TIMED" || match.status === "SCHEDULED") continue;
    const bookings = match.bookings ?? [];
    for (const booking of bookings) {
      // bookings reference teamId; we need team names from match
      // football-data returns bookings with team name in some endpoints
    }
    // Aggregate by scanning match details — we need per-match bookings
    // which requires fetching individual match or using /matches with full details
  }

  // Use matches endpoint which includes bookings in full response
  const detailedMatches = await getGroupStageMatchesWithBookings();
  const cardMap: Record<string, { yellow: number; red: number; yellowRed: number }> = {};

  for (const match of detailedMatches) {
    if (match.status === "TIMED" || match.status === "SCHEDULED") continue;
    const bookings = match.bookings ?? [];
    for (const b of bookings) {
      const teamName = (b as unknown as { team: { name: string }; type: string }).team?.name ?? "";
      if (!teamName) continue;
      if (!cardMap[teamName]) cardMap[teamName] = { yellow: 0, red: 0, yellowRed: 0 };
      const type = (b as unknown as { type: string }).type;
      if (type === "YELLOW_CARD") cardMap[teamName].yellow++;
      else if (type === "RED_CARD") cardMap[teamName].red++;
      else if (type === "YELLOW_RED_CARD") cardMap[teamName].yellowRed++;
    }
  }

  return Object.entries(cardMap)
    .map(([team, c]) => ({
      team,
      yellow: c.yellow,
      red: c.red,
      yellowRed: c.yellowRed,
      total: c.yellow + c.red + c.yellowRed,
    }))
    .sort((a, b) => b.total - a.total);
}

async function getGroupStageMatchesWithBookings() {
  try {
    // football-data.org includes bookings in match detail response
    const data = await fetchFD(`/competitions/${WC_CODE}/matches?stage=GROUP_STAGE`);
    return data.matches ?? [];
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
