import { NextResponse } from "next/server";
import { getStandings } from "@/lib/football-api";

export async function GET() {
  const standings = await getStandings();
  return NextResponse.json(standings);
}
