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
      {msg && <div style={{ padding:8, background:"#fff3cd", border:"1px solid #ffeeba" }}>{msg}</div>}

      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr>
            <th style={td}>Name</th>
            <th style={td}>User</th>
            <th style={td}>Src Host</th>
            <th style={td}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i)=>(
            <tr key={i}>
              <td style={td}>{s.name}</td>
              <td style={td}>{s["User Name"] || s.user || "-"}</td>
              <td style={td}>{s["Source Host Name"] || "-"}</td>
              <td style={td}>
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
          {!sessions.length && <tr><td colSpan={4} style={td}>No active sessions</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
const td = { border:"1px solid #eee", padding:"8px 10px", textAlign:"left" };
