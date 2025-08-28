import React from "react";
import { getHealth } from "../lib/api";

export default function Dashboard() {
  const [data, setData] = React.useState(null);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    getHealth()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setErr(String(e.message || e)));
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {err && (
        <div style={{ padding: 12, background: "#ffe8e8", border: "1px solid #f5bcbc", marginBottom: 12 }}>
          <strong>Error:</strong> {err}
        </div>
      )}
      {!data && !err && <div>Loading...</div>}
      {data && (
        <pre style={{ background: "#f6f8fa", padding: 16, borderRadius: 8 }}>
{JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
