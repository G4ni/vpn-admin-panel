import React from "react";

/**
 * props.stats berasal dari GET /api/metrics
 * Diharapkan punya field:
 *  - uptime (detik)
 *  - loadavg: [l1,l5,l15]
 *  - cpus: number
 *  - memory: persen (0..100)  (fallback: dihitung dari totalmem-freemem)
 *  - disk: { pct, used, total, free }
 */
export default function SystemMetrics({ stats }) {
  const l1 = Number(stats?.loadavg?.[0] ?? 0);
  const cpus = Number(stats?.cpus ?? 1) || 1;

  // Estimasi CPU% dari load 1m / cpu_count
  const cpuPct = Math.max(0, Math.min(200, Math.round((l1 / cpus) * 100)));

  const memPct = Number.isFinite(stats?.memory)
    ? Number(stats.memory)
    : (() => {
        const total = Number(stats?.totalmem ?? 0);
        const free = Number(stats?.freemem ?? 0);
        if (total <= 0) return 0;
        return Math.round((1 - free / total) * 100);
      })();

  const diskPct = Number(stats?.disk?.pct ?? 0);

  const fmtBytes = (b = 0) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let x = Number(b) || 0, i = 0;
    while (x >= 1024 && i < units.length - 1) { x /= 1024; i++; }
    return `${x.toFixed(x >= 10 ? 0 : 1)} ${units[i]}`;
  };

  const fmtUptime = (sec = 0) => {
    const s = Math.max(0, Math.floor(sec));
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    return `${h}h ${m}m ${ss}s`;
  };

  const Gauge = ({ label, value, color }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-slate-800">{Math.max(0, Math.min(100, value))}%</div>
        <div className={`text-xs px-2 py-1 rounded-full ${color.bg} ${color.text}`}>live</div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-2 ${color.fill}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Gauge
        label="CPU Usage"
        value={cpuPct}
        color={{ bg: "bg-blue-50", text: "text-blue-600", fill: "bg-blue-500" }}
      />
      <Gauge
        label="Memory Usage"
        value={memPct}
        color={{ bg: "bg-emerald-50", text: "text-emerald-600", fill: "bg-emerald-500" }}
      />
      <Gauge
        label="Disk Usage"
        value={diskPct}
        color={{ bg: "bg-violet-50", text: "text-violet-600", fill: "bg-violet-500" }}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-slate-500 mb-2">Uptime</div>
        <div className="text-2xl font-semibold text-slate-800">{fmtUptime(stats?.uptime ?? stats?.uptimeSystem ?? 0)}</div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="mb-1">Load 1m</div>
            <div className="font-medium text-slate-800">{l1.toFixed(2)}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="mb-1">Load 5m</div>
            <div className="font-medium text-slate-800">{Number(stats?.loadavg?.[1] ?? 0).toFixed(2)}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="mb-1">CPU Cores</div>
            <div className="font-medium text-slate-800">{cpus}</div>
          </div>
        </div>
        {stats?.disk && (
          <div className="mt-3 text-xs text-slate-500">
            <div>Disk: {fmtBytes(stats.disk.used)} / {fmtBytes(stats.disk.total)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
