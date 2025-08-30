// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getMetrics } from "../lib/api";
import SystemMetrics from "../components/SystemMetrics";
import BandwidthChart from "../components/charts/BandwidthChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState(null);

  // auto refresh
  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const json = await getMetrics();
        if (!stop) {
          setStats(json);
          setErr(null);
        }
      } catch (e) {
        if (!stop) setErr(e.message || String(e));
      }
    }
    tick();
    const id = setInterval(tick, 5000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  const uptime = stats?.uptime ?? stats?.uptimeSystem ?? 0;
  const fmtUptime = () => {
    let s = Number(uptime || 0);
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600);  s %= 3600;
    const m = Math.floor(s / 60);    s %= 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const total = stats?.users?.total ?? stats?.totalUsers ?? 0;
  const online = stats?.users?.online ?? stats?.onlineUsers ?? 0;
  const offline = stats?.users?.offline ?? stats?.offlineUsers ?? Math.max(0, total - online);

  const miniCard = (title, val, sub, bg="#f8fafc", bd="#e5e7eb") => (
    <div style={{ border:`1px solid ${bd}`, borderRadius:16, padding:16, background:bg }}>
      <div style={{ fontSize:12, color:"#64748b" }}>{title}</div>
      <div style={{ fontSize:24, fontWeight:700, color:"#0f172a" }}>{val}</div>
      {sub ? <div style={{ fontSize:12, color:"#475569" }}>{sub}</div> : null}
    </div>
  );

  return (
    <div style={{ display:"grid", gap:20 }}>
      {/* BARIS 1: System cards + uptime (4 kolom) */}
      <div style={{
        display:"grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16
      }}>
        <SystemMetrics stats={stats} />
        <div style={{ display:"grid", gridTemplateRows:"1fr 1fr 1fr", gap:16 }}>
          {miniCard("Uptime", fmtUptime(), "Server up time", "#fff")}
          {miniCard("Total Users", total, "", "#fff")}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {miniCard("Online", online, "", "#ecfdf5", "#d1fae5")}
            {miniCard("Offline", offline, "", "#fef2f2", "#fee2e2")}
          </div>
        </div>
      </div>

      {/* BARIS 2: Chart bandwidth */}
      <BandwidthChart stats={stats} />

      {err && (
        <div style={{ padding:12, background:"#fef2f2", border:"1px solid #fee2e2", borderRadius:8, color:"#b91c1c" }}>
          Error: {err}
        </div>
      )}
    </div>
  );
}
