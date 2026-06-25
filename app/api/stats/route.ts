import { NextResponse } from "next/server";

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

async function fetchCSV(url: string): Promise<string[][]> {
  const res = await fetch(url, { redirect: "follow", next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const text = await res.text();
  return text
    .trim()
    .split("\n")
    .map((row) => row.split(",").map((cell) => cell.trim()));
}

export async function GET() {
  try {
    const cardsUrl = process.env.SHEETS_CARDS_URL;
    const throwinsUrl = process.env.SHEETS_THROWINS_URL;

    const [cardsRows, throwinsRows] = await Promise.all([
      cardsUrl ? fetchCSV(cardsUrl) : Promise.resolve([]),
      throwinsUrl ? fetchCSV(throwinsUrl) : Promise.resolve([]),
    ]);

    // Skip header row, parse cards
    const cards: CardEntry[] = cardsRows
      .slice(1)
      .filter((r) => r[0])
      .map((r) => {
        const yellow = parseInt(r[1]) || 0;
        const red = parseInt(r[2]) || 0;
        const yellowRed = parseInt(r[3]) || 0;
        return { team: r[0], yellow, red, yellowRed, total: yellow + red + yellowRed };
      })
      .sort((a, b) => b.total - a.total);

    // Skip header row, parse throw-ins
    const throwIns: ThrowInEntry[] = throwinsRows
      .slice(1)
      .filter((r) => r[0])
      .map((r) => ({ team: r[0], throwIns: parseInt(r[1]) || 0 }))
      .sort((a, b) => b.throwIns - a.throwIns);

    return NextResponse.json({ cards, throwIns });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ cards: [], throwIns: [] });
  }
}
