"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TEAM_CRESTS } from "@/lib/sweepstakes-data";

// Starts with the hardcoded map as fallback, then merges live API data
const TeamCrestsContext = createContext<Record<string, string>>(TEAM_CRESTS);

export function useTeamCrests() {
  return useContext(TeamCrestsContext);
}

export function TeamCrestsProvider({ children }: { children: React.ReactNode }) {
  const [crests, setCrests] = useState<Record<string, string>>(TEAM_CRESTS);

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setCrests((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {}); // silently fall back to hardcoded map
  }, []);

  return (
    <TeamCrestsContext.Provider value={crests}>
      {children}
    </TeamCrestsContext.Provider>
  );
}
