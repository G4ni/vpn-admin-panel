// src/components/charts/BandwidthChart.jsx
import React, { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import dayjs from "dayjs";

// stats.net.history = [{t, rx_bps, tx_bps}]
export default function BandwidthChart({ stats }) {
  const data = useMemo(() => {
    const hist = stats?.net?.history || [];
    // fallback 12 titik kosong @5s
    if (!hist.length) {
      const now = Date.now();
      return Array.from({ length: 12 }, (_, i) => ({
        t: dayjs(now - (11 - i) * 5 * 1000).format("HH:mm:ss"),
        rx_mbps: 0,
        tx_mbps: 0,
      }));
    }
    return hist.map(p => ({
      t: dayjs(p.t || Date.now()).format("HH:mm:ss"),
      rx_mbps: Math.max(0, (p.rx_bps || 0) / 1_000_000), // bits/s -> Mbps
      tx_mbps: Math.max(0, (p.tx_bps || 0) / 1_000_000),
    }));
  }, [stats]);

  // cari max dinamis untuk Y-axis
  const yMax = useMemo(() => {
    let max = 1;
    for (const d of data) max = Math.max(max, d.rx_mbps, d.tx_mbps);
    // round up ke angka “enak”
    if (max <= 1) return 1;
    if (max <= 5) return 5;
    if (max <= 10) return 10;
    if (max <= 20) return 20;
    if (max <= 50) return 50;
    return Math.ceil(max / 50) * 50;
  }, [data]);

  const formatMB = (bytes) => {
    if (!bytes || bytes <= 0) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const totalRx = stats?.net?.rx_total || 0;
  const totalTx = stats?.net?.tx_total || 0;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent:"space-between", alignItems:"center", marginBottom: 12 }}>
        <div style={{ fontWeight: 600, color: "#0f172a" }}>Bandwidth Usage (live)</div>
        <div style={{ fontSize: 12, color:"#64748b", display:"flex", gap:12 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:9999, background:"#3b82f6" }} /> RX
          </span>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:9999, background:"#10b981" }} /> TX
          </span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:12, background:"#eff6ff" }}>
          <div style={{ fontSize:12, color:"#475569", marginBottom:6 }}>Total RX</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#0f172a" }}>{formatMB(totalRx)}</div>
        </div>
        <div style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:12, background:"#ecfdf5" }}>
          <div style={{ fontSize:12, color:"#475569", marginBottom:6 }}>Total TX</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#0f172a" }}>{formatMB(totalTx)}</div>
        </div>
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="t" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis
              domain={[0, yMax]}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => `${v} Mbps`}
            />
            <Tooltip
              contentStyle={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8 }}
              formatter={(val, name) => [`${Number(val).toFixed(2)} Mbps`, name === 'rx_mbps' ? 'RX' : 'TX']}
              labelStyle={{ color:"#334155" }}
            />
            <Line type="monotone" dataKey="rx_mbps" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="tx_mbps" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
