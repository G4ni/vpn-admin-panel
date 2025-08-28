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

      {msg && <div className="alert">{msg}</div>}

      <div className="form-row">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email user" className="text-input" />
        <button onClick={async ()=>{
          if(!email) return setMsg("isi email dulu");
          try {
            const r = await createUser(email);
            setMsg(r.message || "created");
            await refresh();
          } catch(e) { setMsg(String(e.message||e)); }
        }}>Create</button>

        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="new password" className="text-input" />
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

        <a href={downloadOvpn(email)} className="download-link">
          Download OVPN
        </a>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th className="table-cell">User</th>
            <th className="table-cell">Group</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i)=>(
            <tr key={i}>
              <td className="table-cell">{u.name}</td>
              <td className="table-cell">{u.group || "-"}</td>
            </tr>
          ))}
          {!users.length && (
            <tr><td className="table-cell" colSpan={2}>No users</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
