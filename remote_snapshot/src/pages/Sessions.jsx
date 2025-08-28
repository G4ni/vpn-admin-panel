import { useEffect, useState } from 'react'
import { hub } from '../lib/api'

export default function Sessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true); setMsg('')
    try {
      const data = await hub.sessions()
      setSessions(Array.isArray(data.sessions) ? data.sessions : [])
    } catch (e) {
      setMsg('Error: ' + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [])

  async function onDisconnect(name) {
    if (!confirm(`Disconnect ${name}?`)) return
    setMsg(''); setLoading(true)
    try {
      const r = await hub.disconnect(name)
      setMsg(r.message || 'Disconnected')
      await load()
    } catch (e) {
      setMsg('Error: ' + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Sessions</h2>
      <div style={{margin:'8px 0'}}>
        <button onClick={load} disabled={loading}>Refresh</button>
      </div>
      {msg && <div style={{color: msg.startsWith('Error')?'crimson':'#0a0'}}>{msg}</div>}

      <div style={{overflow:'auto'}}>
        <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
          <thead>
            <tr>
              <th>Session Name</th>
              <th>User</th>
              <th>Host</th>
              <th>TCP</th>
              <th>Bytes</th>
              <th>Packets</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {sessions.length === 0 ? (
            <tr><td colSpan="7" style={{textAlign:'center', color:'#64748b'}}>No active sessions</td></tr>
          ) : sessions.map((s, i) => (
            <tr key={i}>
              <td>{s.name || s['Session Name']}</td>
              <td>{s['User Name'] || '-'}</td>
              <td>{s['Source Host Name'] || '-'}</td>
              <td>{s['TCP Connections'] || '-'}</td>
              <td>{s['Transfer Bytes'] || '-'}</td>
              <td>{s['Transfer Packets'] || '-'}</td>
              <td>
                <button onClick={() => onDisconnect(s.name || s['Session Name'])} style={{color:'crimson'}}>
                  Disconnect
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}