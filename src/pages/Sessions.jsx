import React from "react";
import { listSessions, disconnect } from "../lib/api";

export default function Sessions() {
  const [sessions, setSessions] = React.useState([]);
  const [msg, setMsg] = React.useState("");

  async function refresh() {
    setMsg("");
    const d = await listSessions();
    setSessions(d.sessions || []);
  }
  React.useEffect(() => { refresh().catch(e=>setMsg(String(e))); }, []);

  return (
    <div>
      <h2>Sessions</h2>
      {msg && <div className="alert">{msg}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th className="table-cell">Name</th>
            <th className="table-cell">User</th>
            <th className="table-cell">Src Host</th>
            <th className="table-cell">Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i)=>(
            <tr key={i}>
              <td className="table-cell">{s.name}</td>
              <td className="table-cell">{s["User Name"] || s.user || "-"}</td>
              <td className="table-cell">{s["Source Host Name"] || "-"}</td>
              <td className="table-cell">
                <button onClick={async ()=>{
                  try {
                    const r = await disconnect(s.name);
                    setMsg(r.message || "done");
                    await refresh();
                  } catch(e){ setMsg(String(e.message||e)); }
                }}>Disconnect</button>
              </td>
            </tr>
          ))}
          {!sessions.length && <tr><td colSpan={4} className="table-cell">No active sessions</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
