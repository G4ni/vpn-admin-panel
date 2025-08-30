import React from "react";

/**
 * props.stats.users: { total, online, offline }
 */
export default function UserCards({ stats }) {
  const total = Number(stats?.users?.total ?? 0);
  const online = Number(stats?.users?.online ?? 0);
  const offline = Number(stats?.users?.offline ?? Math.max(0, total - online));

  const Card = ({ title, value, tone }) => {
    const tones = {
      sky:    { ring: "ring-sky-100", bg: "bg-sky-50",    dot: "bg-sky-500",    text: "text-sky-700" },
      emerald:{ ring: "ring-emerald-100", bg: "bg-emerald-50", dot: "bg-emerald-500", text: "text-emerald-700" },
      rose:   { ring: "ring-rose-100", bg: "bg-rose-50",  dot: "bg-rose-500",  text: "text-rose-700" },
    }[tone] || { ring:"ring-slate-100", bg:"bg-slate-50", dot:"bg-slate-400", text:"text-slate-700" };

    return (
      <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ${tones.ring}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-500">{title}</div>
          <span className={`inline-block h-2 w-2 rounded-full ${tones.dot}`} />
        </div>
        <div className="text-3xl font-semibold text-slate-800">{value}</div>
        <div className={`mt-2 text-xs ${tones.text}`}>Live</div>
        <div className={`mt-3 h-1.5 w-full rounded-full ${tones.bg}`}>
          <div className={`${tones.dot} h-1.5 rounded-full`} style={{ width: "100%" }} />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Total Users"  value={total}  tone="sky" />
      <Card title="Online Users" value={online} tone="emerald" />
      <Card title="Offline Users" value={offline} tone="rose" />
    </div>
  );
}
