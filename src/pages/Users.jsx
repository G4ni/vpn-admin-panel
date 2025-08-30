import React from 'react';
import { Plus, KeyRound, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { listUsers, createUser, setPassword, delUser, downloadOvpn } from '../lib/api';

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [email, setEmail] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function refresh() {
    try {
      setLoading(true);
      const d = await listUsers();
      setUsers(d.users || []);
      setError('');
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { refresh(); }, []);

  const handleCreate = async () => {
    if (!email) return setError('Email required');
    try {
      setLoading(true);
      const r = await createUser(email);
      setMsg(r.message || 'User created');
      setEmail('');
      await refresh();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (user) => {
    const password = prompt(`New password for ${user}?`);
    if (!password) return;
    try {
      setLoading(true);
      const r = await setPassword(user, password);
      setMsg(r.message || 'Password updated');
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user}?`)) return;
    try {
      setLoading(true);
      const r = await delUser(user);
      setMsg(r.message || 'Deleted');
      await refresh();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const online = users.filter((u) => u.online || u.status === 'online').length;
  const offline = users.length - online;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>VPN Users</h2>
      {msg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert" style={{ marginBottom: 16 }}>
          {msg}
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert"
          style={{ marginBottom: 16, background: '#fecaca', borderColor: '#fca5a5' }}
        >
          {error} <button onClick={refresh}>Retry</button>
        </motion.div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user email"
        />
        <button className="button" onClick={handleCreate} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Plus size={16} /> Create
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <td>{u.name}</td>
              <td>{u.group || '-'}</td>
              <td style={{ display: 'flex', gap: 4 }}>
                <button className="button" onClick={() => handleSetPassword(u.name)} title="Set password">
                  <KeyRound size={14} />
                </button>
                <a className="button" href={downloadOvpn(u.name)} title="Download OVPN">
                  <Download size={14} />
                </a>
                <button className="button secondary" onClick={() => handleDelete(u.name)} title="Delete user">
                  <Trash2 size={14} />
                </button>
              </td>
            </motion.tr>
          ))}
          {!users.length && (
            <tr>
              <td colSpan={3}>No users</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="grid grid-3" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-title">Total Users</div>
          <div className="card-value">{users.length}</div>
        </div>
        <div className="card">
          <div className="card-title">Online</div>
          <div className="card-value">{online}</div>
        </div>
        <div className="card">
          <div className="card-title">Offline</div>
          <div className="card-value">{offline}</div>
        </div>
      </div>
    </div>
  );
}
