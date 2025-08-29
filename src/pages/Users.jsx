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

  React.useEffect(() => {
    refresh().catch((e) => setMsg(String(e)));
  }, []);

  const online = users.filter((u) => u.online || u.status === "online").length;
  const offline = users.length - online;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>VPN Users</h2>

      {msg && <div className="alert">{msg}</div>}

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">Total Users</div>
          <div className="card-value">{users.length}</div>
        </div>
        <div className="card">
          <div className="card-title">Online Now</div>
          <div className="card-value">{online}</div>
        </div>
        <div className="card">
          <div className="card-title">Offline</div>
          <div className="card-value">{offline}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user email"
        />
        <button
          className="button"
          onClick={async () => {
            if (!email) return setMsg("isi email dulu");
            try {
              const r = await createUser(email);
              setMsg(r.message || "created");
              await refresh();
            } catch (e) {
              setMsg(String(e.message || e));
            }
          }}
        >
          Create
        </button>

        <input
          className="input"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="new password"
        />
        <button
          className="button"
          onClick={async () => {
            if (!email || !pass) return setMsg("isi email & password");
            try {
              const r = await setPassword(email, pass);
              setMsg(r.message || "password updated");
            } catch (e) {
              setMsg(String(e.message || e));
            }
          }}
        >
          Set Password
        </button>

        <button
          className="button secondary"
          onClick={async () => {
            if (!email) return setMsg("isi email dulu");
            try {
              const r = await delUser(email);
              setMsg(r.message || "deleted");
              await refresh();
            } catch (e) {
              setMsg(String(e.message || e));
            }
          }}
        >
          Delete
        </button>

        <a
          className="button"
          style={{ textDecoration: "none" }}
          href={downloadOvpn(email)}
        >
          Download OVPN
        </a>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.name}</td>
              <td>{u.group || "-"}</td>
            </tr>
          ))}
          {!users.length && (
            <tr>
              <td colSpan={2}>No users</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
