export default function PrizeSummary() {
  const prizes = [
    {
      medal: "🥇",
      amount: "£100",
      title: "World Cup Winners",
      desc: "If one of your teams lifts the trophy",
      gradient: "from-amber-400/20 to-yellow-300/10",
      border: "border-amber-400/30",
      badge: "bg-amber-400/20 text-amber-300",
    },
    {
      medal: "🥈",
      amount: "£50",
      title: "Most Cards",
      desc: "Most yellow + red cards in the group stage",
      gradient: "from-slate-400/20 to-slate-300/10",
      border: "border-slate-400/30",
      badge: "bg-slate-400/20 text-slate-300",
    },
    {
      medal: "🥉",
      amount: "£25",
      title: "Most Throw-ins",
      desc: "Most throw-ins in the group stage",
      gradient: "from-orange-400/20 to-amber-300/10",
      border: "border-orange-400/30",
      badge: "bg-orange-400/20 text-orange-300",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🏆</span> Prizes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {prizes.map((p) => (
          <div
            key={p.title}
            className={`bg-gradient-to-br ${p.gradient} border ${p.border} rounded-2xl p-5 text-center`}
          >
            <p className="text-4xl mb-2">{p.medal}</p>
            <p className={`inline-block text-xl font-bold px-3 py-1 rounded-full ${p.badge} mb-3`}>
              {p.amount}
            </p>
            <p className="font-semibold text-white">{p.title}</p>
            <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
