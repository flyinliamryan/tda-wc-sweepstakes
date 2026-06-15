"use client";

import { useEffect, useState } from "react";
import { getOwner } from "@/lib/sweepstakes-data";
import TeamCrest from "./TeamCrest";

interface ThrowInEntry {
  team: string;
  throwIns: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function ThrowInsLeaderboard() {
  const [data, setData] = useState<ThrowInEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/throwins")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load throw-in data");
        setLoading(false);
      });
  }, []);

  const max = data[0]?.throwIns ?? 1;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
          <span className="text-lg">🏳</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Throw-ins League</h2>
          <p className="text-xs text-slate-400">3rd prize · £25 voucher · group stage only</p>
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
          <p className="text-xs mt-1 text-slate-500">Live data will appear once matches are played</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-3xl mb-2">⏳</p>
          <p className="text-sm">Stats add-on pending activation</p>
          <p className="text-xs mt-1 text-slate-500">Throw-in data will populate automatically once enabled</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="space-y-2">
          {data.slice(0, 10).map((entry, i) => {
            const owner = getOwner(entry.team);
            const pct = (entry.throwIns / max) * 100;
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
                      <span className="text-sm font-bold text-white tabular-nums">{entry.throwIns}</span>
                    </div>
                    {owner && (
                      <p className="text-xs text-slate-500 mt-0.5">Owned by {owner}</p>
                    )}
                    <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
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
