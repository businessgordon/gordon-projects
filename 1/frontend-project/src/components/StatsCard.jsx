function StatsCard({ title, value, icon, colorClass }) {
  return (
    <article className="card-surface p-6 text-slate-900 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl text-white shadow-lg ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </article>
  );
}

export default StatsCard;
