"use client";

import { PARTICIPANTS, AVATAR_COLORS } from "@/lib/sweepstakes-data";
import TeamCrest from "./TeamCrest";

const names = Object.keys(PARTICIPANTS);

export default function ParticipantsGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">👥</span> Sweepstake Entries
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {names.map((name, i) => {
          const teams = PARTICIPANTS[name];
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const initials = name
            .split(/[\s.]/)
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase();
          return (
            <div
              key={name}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all hover:scale-[1.02] hover:border-white/20"
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{name}</p>
                <div className="flex flex-col gap-1 mt-1">
                  {teams.map((team) => (
                    <span key={team} className="text-sm text-slate-300 flex items-center gap-2">
                      <TeamCrest team={team} size={20} />
                      <span>{team}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
