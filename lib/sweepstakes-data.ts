export const PARTICIPANTS: Record<string, string[]> = {
  Agnes: ["Brazil", "South Korea"],
  Bella: ["France", "Colombia"],
  Charlotte: ["Spain", "Egypt"],
  "Hannah W.": ["England", "Tunisia"],
  "Hannah T.": ["Argentina", "Switzerland"],
  Kendall: ["Germany", "Japan"],
  Liam: ["Portugal", "Czech Republic"],
  Mark: ["Netherlands", "Saudi Arabia"],
  Michael: ["Belgium", "Ghana"],
  Noemie: ["Croatia", "Australia"],
  Paulina: ["Uruguay", "Cameroon"],
  Rory: ["United States", "Ivory Coast"],
  "Scott B": ["Mexico", "Austria"],
  "Scott P": ["Morocco", "Paraguay"],
  Pippa: ["Sweden", "Iran"],
  Darren: ["Canada", "Norway"],
  Kate: ["Turkey", "Algeria"],
  Viktoriia: ["Scotland", "Ecuador"],
};

// Map football-data.org team names to our display names
export const TEAM_NAME_MAP: Record<string, string> = {
  "Korea Republic": "South Korea",
  "Côte d'Ivoire": "Ivory Coast",
  "United States": "United States",
  USA: "United States",
  "Czechia": "Czech Republic",
  "Czech Republic": "Czech Republic",
  "IR Iran": "Iran",
};

export function normalizeTeamName(name: string): string {
  return TEAM_NAME_MAP[name] ?? name;
}

export function getOwner(teamName: string): string | null {
  const normalized = normalizeTeamName(teamName);
  for (const [person, teams] of Object.entries(PARTICIPANTS)) {
    if (teams.includes(normalized)) return person;
  }
  return null;
}

export const TEAM_CRESTS: Record<string, string> = {
  Argentina: "https://crests.football-data.org/762.png",
  Algeria: "https://crests.football-data.org/algeria.svg",
  Australia: "https://crests.football-data.org/779.svg",
  Austria: "https://crests.football-data.org/816.svg",
  Belgium: "https://crests.football-data.org/805.svg",
  Brazil: "https://crests.football-data.org/764.svg",
  Canada: "https://crests.football-data.org/canada.svg",
  Colombia: "https://crests.football-data.org/818.svg",
  Croatia: "https://crests.football-data.org/799.svg",
  "Czech Republic": "https://crests.football-data.org/798.svg",
  Ecuador: "https://crests.football-data.org/791.svg",
  Egypt: "https://crests.football-data.org/825.svg",
  England: "https://crests.football-data.org/770.svg",
  France: "https://crests.football-data.org/773.svg",
  Germany: "https://crests.football-data.org/759.svg",
  Ghana: "https://crests.football-data.org/ghana.svg",
  Iran: "https://crests.football-data.org/iran.svg",
  "Ivory Coast": "https://crests.football-data.org/787.svg",
  Japan: "https://crests.football-data.org/766.svg",
  Mexico: "https://crests.football-data.org/769.svg",
  Morocco: "https://crests.football-data.org/morocco.svg",
  Netherlands: "https://crests.football-data.org/8601.svg",
  Norway: "https://crests.football-data.org/813.svg",
  Paraguay: "https://crests.football-data.org/761.svg",
  Portugal: "https://crests.football-data.org/765.svg",
  "Saudi Arabia": "https://crests.football-data.org/saudi_arabia.svg",
  Scotland: "https://crests.football-data.org/814.svg",
  "South Korea": "https://crests.football-data.org/772.png",
  Spain: "https://crests.football-data.org/760.svg",
  Sweden: "https://crests.football-data.org/792.svg",
  Switzerland: "https://crests.football-data.org/788.svg",
  Tunisia: "https://crests.football-data.org/tunisia.svg",
  Turkey: "https://crests.football-data.org/803.svg",
  "United States": "https://crests.football-data.org/usa.svg",
  Uruguay: "https://crests.football-data.org/758.svg",
  Cameroon: "https://crests.football-data.org/CMR.png",
};

export const AVATAR_COLORS = [
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-sky-500",
  "from-lime-400 to-green-500",
  "from-fuchsia-400 to-pink-500",
  "from-orange-400 to-red-500",
  "from-teal-400 to-emerald-500",
  "from-indigo-400 to-blue-500",
  "from-pink-400 to-rose-500",
  "from-purple-400 to-violet-500",
  "from-sky-400 to-cyan-500",
  "from-green-400 to-lime-500",
  "from-red-400 to-orange-500",
  "from-yellow-400 to-amber-500",
  "from-blue-400 to-purple-500",
];
