// src/components/SystemMetrics.jsx
import React from "react";

function Bar({ value, color="#22c55e" }) {
  return (
    <div style={{ width:"100%", height:10, background:"#e5e7eb", borderRadius:9999 }}>
      <div style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        height: "100%",
        background: color,
        borderRadius: 9999,
        transition: "width .3s ease"
      }} />
    </div>
  );
}

export default function SystemMetrics({ stats }) {
  const cpu   = Number(stats?.loadavg?.[0] || 0); // 1-min load
  const cpus  = Number(stats?.cpus || 1);
  const cpuPct = Math.min(100, Math.round((cpu / cpus) * 100)); // perkiraan sederhana

  const memPct  = Number(stats?.memory || 0); // backend sudah kirim %
  const diskPct = Number(stats?.disk?.pct || 0);

  const card = (title, pct, accent) => (
    <div style={{ border:"1px solid #e5e7eb", borderRadius:16, padding:16, background:"#fff" }}>
      <div style={{ fontSize:14, color:"#0f172a", fontWeight:600, marginBottom:8 }}>{title}</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div style={{ fontSize:20, fontWeight:700, color:"#0f172a" }}>{isFinite(pct) ? `${pct}%` : '-'}</div>
      </div>
      <Bar value={isFinite(pct) ? pct : 0} color={accent} />
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
      {card("CPU Usage",    cpuPct,  "#60a5fa")}
      {card("Memory Usage", memPct,  "#34d399")}
      {card("Disk Usage",   diskPct, "#a78bfa")}
    </div>
  );
}
