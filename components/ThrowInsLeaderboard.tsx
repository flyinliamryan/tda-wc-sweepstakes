"use client";

import { TEAM_FLAGS, getOwner, PARTICIPANTS } from "@/lib/sweepstakes-data";

// Throw-in data is not available via football-data.org's free/standard tier.
// This component shows a placeholder leaderboard that can be manually updated
// via the THROW_IN_DATA object below, or wired to a stats API in future.

export const THROW_IN_DATA: Record<string, number> = {
  // Update these manually or via a future stats integration
  // e.g. "Brazil": 45,
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function ThrowInsLeaderboard() {
  const allTeams = Object.values(PARTICIPANTS).flat();

  const entries = allTeams
    .map((team) => ({ team, count: THROW_IN_DATA[team] ?? 0 }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);

  const max = entries[0]?.count ?? 1;
  const hasData = entries.length > 0;

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

      {!hasData && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-3xl mb-2">⏳</p>
          <p className="text-sm">Throw-in data coming soon</p>
          <p className="text-xs mt-1 text-slate-500 max-w-xs mx-auto">
            Throw-in stats aren&apos;t available via the standard football API — we&apos;ll update
            this manually during the group stage.
          </p>
        </div>
      )}

      {hasData && (
        <div className="space-y-2">
          {entries.slice(0, 10).map((entry, i) => {
            const owner = getOwner(entry.team);
            const pct = (entry.count / max) * 100;
            return (
              <div key={entry.team} className="group">
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="w-6 text-center text-sm font-medium text-slate-400">
                    {MEDALS[i] ?? <span className="text-slate-500">{i + 1}</span>}
                  </span>
                  <span className="text-lg">{TEAM_FLAGS[entry.team] ?? "🏳"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white truncate">{entry.team}</span>
                      <span className="text-sm font-bold text-white">{entry.count}</span>
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
