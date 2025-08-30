import React from 'react';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { listSessions, disconnect } from '../lib/api';

const td = { border: '1px solid #eee', padding: '8px 10px', textAlign: 'left' };

export default function Sessions() {
  const [sessions, setSessions] = React.useState([]);
  const [error, setError] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function refresh() {
    try {
      setLoading(true);
      const d = await listSessions();
      setSessions(d.sessions || []);
      setError('');
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { refresh(); }, []);

  const handleDisconnect = async (name) => {
    try {
      setLoading(true);
      const r = await disconnect(name);
      setMsg(r.message || 'Disconnected');
      await refresh();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sessions</h2>
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
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={td}>Name</th>
            <th style={td}>User</th>
            <th style={td}>Src Host</th>
            <th style={td}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <td style={td}>{s.name}</td>
              <td style={td}>{s['User Name'] || s.user || '-'}</td>
              <td style={td}>{s['Source Host Name'] || '-'}</td>
              <td style={td}>
                <button
                  onClick={() => handleDisconnect(s.name)}
                  className="button"
                  title="Disconnect"
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <LogOut size={14} />
                </button>
              </td>
            </motion.tr>
          ))}
          {!sessions.length && (
            <tr>
              <td colSpan={4} style={td}>No active sessions</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
