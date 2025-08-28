import React from "react";
import { listUsers, createUser, setPassword, delUser, downloadOvpn } from "../lib/api";

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [msg, setMsg] = React.useState("");

  async function refresh() {
    setMsg("");
    const d = await listUsers();
    setUsers(d.users || []);
  }

  React.useEffect(() => { refresh().catch(e => setMsg(String(e))); }, []);

  return (
    <div>
      <h2>Users</h2>

      {msg && <div style={{ padding: 8, background: "#fff3cd", border: "1px solid #ffeeba" }}>{msg}</div>}

      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email user" style={{ padding:8 }} />
        <button onClick={async ()=>{
          if(!email) return setMsg("isi email dulu");
          try {
            const r = await createUser(email);
            setMsg(r.message || "created");
            await refresh();
          } catch(e) { setMsg(String(e.message||e)); }
        }}>Create</button>

        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="new password" style={{ padding:8 }} />
        <button onClick={async ()=>{
          if(!email || !pass) return setMsg("isi email & password");
          try {
            const r = await setPassword(email, pass);
            setMsg(r.message || "password updated");
          } catch(e) { setMsg(String(e.message||e)); }
        }}>Set Password</button>

        <button onClick={async ()=>{
          if(!email) return setMsg("isi email dulu");
          try {
            const r = await delUser(email);
            setMsg(r.message || "deleted");
            await refresh();
          } catch(e) { setMsg(String(e.message||e)); }
        }}>Delete</button>

        <a href={downloadOvpn(email)} style={{ padding:8, border:"1px solid #ddd", borderRadius:6, textDecoration:"none" }}>
          Download OVPN
        </a>
      </div>

      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr>
            <th style={td}>User</th>
            <th style={td}>Group</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i)=>(
            <tr key={i}>
              <td style={td}>{u.name}</td>
              <td style={td}>{u.group || "-"}</td>
            </tr>
          ))}
          {!users.length && (
            <tr><td style={td} colSpan={2}>No users</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const td = { border:"1px solid #eee", padding:"8px 10px", textAlign:"left" };
