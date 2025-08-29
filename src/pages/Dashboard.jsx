import React from "react";
import { getHealth } from "../lib/api";

function metricValue(val, suffix = "") {
  if (val === undefined || val === null) return "-";
  return `${val}${suffix}`;
}

export default function Dashboard() {
  const [data, setData] = React.useState(null);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    getHealth()
      .then((d) => alive && setData(d))
      .catch((e) => {
        if (!alive) return;
        const rawMsg = e?.message || String(e);
        console.error("Dashboard health check failed:", e);
        let userMsg = rawMsg;
        if (/network/i.test(rawMsg) || /fetch/i.test(rawMsg)) {
          userMsg = "Unable to contact API. Check API base URL or server status.";
        }
        setErr(userMsg);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Dashboard</h2>
      {err && <div className="alert">Error: {err}</div>}
      {!data && !err && <div>Loading...</div>}
      {data && (
        <>
          <div className="grid grid-4" style={{ marginBottom: 24 }}>
            <div className="card">
              <div className="card-title">CPU Usage</div>
              <div className="card-value">{metricValue(data.cpuUsage, "%")}</div>
            </div>
            <div className="card">
              <div className="card-title">Memory Usage</div>
              <div className="card-value">{metricValue(data.memoryUsage, "%")}</div>
            </div>
            <div className="card">
              <div className="card-title">Disk Usage</div>
              <div className="card-value">{metricValue(data.diskUsage ?? data.disk, "%")}</div>
            </div>
            <div className="card">
              <div className="card-title">Uptime</div>
              <div className="card-value">{metricValue(data.uptime)}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Raw Metrics</div>
            <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
