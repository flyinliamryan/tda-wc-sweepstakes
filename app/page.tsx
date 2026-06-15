import ParticipantsGrid from "@/components/ParticipantsGrid";
import PrizeSummary from "@/components/PrizeSummary";
import CardsLeaderboard from "@/components/CardsLeaderboard";
import ThrowInsLeaderboard from "@/components/ThrowInsLeaderboard";
import RecentMatches from "@/components/RecentMatches";

export const revalidate = 120;

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #080d1a 0%, #0d1526 50%, #0a1020 100%)" }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo/icon-192.png" alt="tda!" className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <p className="text-xs text-slate-400 leading-none">The Digital Age</p>
                <p className="font-bold text-white leading-tight">World Cup 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-6">
            <span>🏟️</span>
            <span>USA · Canada · Mexico · June–July 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            tda!{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #23d0d5 0%, #6939f0 52.08%, #f135b8 100%)" }}
            >
              Sweepstake
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            18 players · 36 teams · £175 in prizes · may the best team win
          </p>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
          {/* Prizes */}
          <PrizeSummary />

          {/* Live leagues + matches */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📊</span> Live Leagues
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CardsLeaderboard />
              <ThrowInsLeaderboard />
              <RecentMatches />
            </div>
          </section>

          {/* Participants */}
          <ParticipantsGrid />
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
          <p>
            tda! World Cup 2026 Sweepstake &middot; Data via{" "}
            <a
              href="https://www.football-data.org"
              className="text-slate-400 hover:text-white transition-colors underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              football-data.org
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
