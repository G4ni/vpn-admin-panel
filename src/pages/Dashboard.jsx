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
        <div className="error-box">
          <strong>Error:</strong> {err}
        </div>
      )}
      {!data && !err && <div>Loading...</div>}
      {data && (
        <pre className="pre-box">
{JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
