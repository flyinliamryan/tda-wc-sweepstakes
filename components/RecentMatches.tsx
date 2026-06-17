"use client";

import { useEffect, useState } from "react";
import { getOwner } from "@/lib/sweepstakes-data";
import TeamCrest from "./TeamCrest";

interface Match {
  id: number;
  stage: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
}

interface MatchData {
  recent: Match[];
  upcoming: { id: number; stage: string; home: string; away: string }[];
  champion: string | null;
}

function TeamLine({ name, score, isWinner }: { name: string; score: number | null; isWinner: boolean }) {
  const owner = getOwner(name);
  return (
    <div className={`flex items-center gap-2 py-0.5 ${isWinner ? "text-white font-semibold" : "text-slate-400"}`}>
      <TeamCrest team={name} size={20} />
      <span className="flex-1 text-sm truncate">{name}</span>
      {owner && <span className="text-xs text-amber-400 shrink-0">{owner}</span>}
      {score !== null && (
        <span className={`text-sm font-bold w-5 text-right tabular-nums ${isWinner ? "text-white" : "text-slate-400"}`}>
          {score}
        </span>
      )}
    </div>
  );
}

export default function RecentMatches() {
  const [data, setData] = useState<MatchData | null>(null);
  const [tab, setTab] = useState<"recent" | "upcoming">("recent");

  useEffect(() => {
    const load = () =>
      fetch("/api/matches")
        .then((r) => r.json())
        .then(setData)
        .catch(() => setData(null));

    load();
    const interval = setInterval(load, 300_000); // 5 min
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚽</span> Matches
        </h2>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const champion = data.champion;
  const championOwner = champion ? getOwner(champion) : null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      {champion && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-400/20 border border-amber-400/30 text-center">
          <p className="text-3xl mb-1">🏆</p>
          <p className="text-lg font-bold text-amber-300">World Cup Champions</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <TeamCrest team={champion} size={28} />
            <p className="text-white font-bold text-2xl">{champion}</p>
          </div>
          {championOwner && (
            <p className="text-amber-400 text-sm mt-1">
              🎉 {championOwner} wins £100!
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>⚽</span> Matches
        </h2>
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setTab("recent")}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
              tab === "recent" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setTab("upcoming")}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
              tab === "upcoming" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {tab === "recent" && (
        <div className="space-y-2">
          {data.recent.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No results yet</p>
          ) : (
            data.recent.map((m) => {
              const homeWin = (m.homeScore ?? 0) > (m.awayScore ?? 0);
              const awayWin = (m.awayScore ?? 0) > (m.homeScore ?? 0);
              return (
                <div key={m.id} className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">
                    {m.stage.replace(/_/g, " ")}
                  </p>
                  <TeamLine name={m.home} score={m.homeScore} isWinner={homeWin} />
                  <TeamLine name={m.away} score={m.awayScore} isWinner={awayWin} />
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "upcoming" && (
        <div className="space-y-2">
          {data.upcoming.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No upcoming fixtures</p>
          ) : (
            data.upcoming.map((m) => (
              <div key={m.id} className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">
                  {m.stage.replace(/_/g, " ")}
                </p>
                <TeamLine name={m.home} score={null} isWinner={false} />
                <TeamLine name={m.away} score={null} isWinner={false} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
