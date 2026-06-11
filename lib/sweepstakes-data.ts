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

export const TEAM_FLAGS: Record<string, string> = {
  Brazil: "🇧🇷",
  "South Korea": "🇰🇷",
  France: "🇫🇷",
  Colombia: "🇨🇴",
  Spain: "🇪🇸",
  Egypt: "🇪🇬",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Tunisia: "🇹🇳",
  Argentina: "🇦🇷",
  Switzerland: "🇨🇭",
  Germany: "🇩🇪",
  Japan: "🇯🇵",
  Portugal: "🇵🇹",
  "Czech Republic": "🇨🇿",
  Netherlands: "🇳🇱",
  "Saudi Arabia": "🇸🇦",
  Belgium: "🇧🇪",
  Ghana: "🇬🇭",
  Croatia: "🇭🇷",
  Australia: "🇦🇺",
  Uruguay: "🇺🇾",
  Cameroon: "🇨🇲",
  "United States": "🇺🇸",
  "Ivory Coast": "🇨🇮",
  Mexico: "🇲🇽",
  Austria: "🇦🇹",
  Morocco: "🇲🇦",
  Paraguay: "🇵🇾",
  Sweden: "🇸🇪",
  Iran: "🇮🇷",
  Canada: "🇨🇦",
  Norway: "🇳🇴",
  Turkey: "🇹🇷",
  Algeria: "🇩🇿",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Ecuador: "🇪🇨",
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
