"use client";

import { useEffect, useState } from "react";
import { getOwner } from "@/lib/sweepstakes-data";
import TeamCrest from "./TeamCrest";
import type { CardEntry } from "@/app/api/stats/route";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function CardsLeaderboard({ data: initialData }: { data?: CardEntry[] }) {
  const [data, setData] = useState<CardEntry[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/stats")
        .then((r) => r.json())
        .then((d) => {
          setData(d.cards ?? []);
          setLoading(false);
        })
        .catch(() => {
          setError("Could not load card data");
          setLoading(false);
        });

    load();
  }, []);

  const max = data[0]?.total ?? 1;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center shadow-lg">
          <span className="text-lg">🟨</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Cards League</h2>
          <p className="text-xs text-slate-400">2nd prize · £50 voucher · group stage only</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-3xl mb-2">📡</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1 text-slate-500">Live data will appear once the tournament starts</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-3xl mb-2">⏳</p>
          <p className="text-sm">No group stage matches played yet</p>
          <p className="text-xs mt-1 text-slate-500">Check back once the tournament kicks off!</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="space-y-2">
          {data.slice(0, 10).map((entry, i) => {
            const owner = getOwner(entry.team);
            const pct = (entry.total / max) * 100;
            return (
              <div key={entry.team} className="group">
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="w-6 text-center text-sm font-medium text-slate-400">
                    {MEDALS[i] ?? <span className="text-slate-500">{i + 1}</span>}
                  </span>
                  <TeamCrest team={entry.team} size={24} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white truncate">{entry.team}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded font-mono">
                          🟨 {entry.yellow}
                        </span>
                        {entry.red > 0 && (
                          <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded font-mono">
                            🟥 {entry.red}
                          </span>
                        )}
                        {entry.yellowRed > 0 && (
                          <span className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded font-mono">
                            🟨🟥 {entry.yellowRed}
                          </span>
                        )}
                        <span className="text-sm font-bold text-white w-6 text-right">{entry.total}</span>
                      </div>
                    </div>
                    {owner && (
                      <p className="text-xs text-slate-500 mt-0.5">Owned by {owner}</p>
                    )}
                    <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
