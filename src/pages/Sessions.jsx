import React from 'react';
import { Api } from '../api';

export default function Sessions() {
  const [sessions, setSessions] = React.useState([]);
  const reload = async () => {
    const r = await Api.sessions();
    setSessions(r.sessions || []);
  };
  React.useEffect(()=>{ reload(); }, []);

  const disconnect = async (name) => {
    const r = await Api.disconnect(name);
    alert(r.message || (r.success ? 'Disconnected' : 'Failed'));
    reload();
  };

  const disconnectAll = async () => {
    const r = await Api.disconnectAll();
    alert(`Disconnected: ${r.count || 0}`);
    reload();
  };

  return (
    <div>
      <h2>Sessions</h2>
      <button onClick={disconnectAll} style={{margin:'10px 0'}}>Disconnect ALL (non-SecureNAT)</button>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
        <thead><tr><th>Name</th><th>User</th><th>Host</th><th>TCP</th><th>Aksi</th></tr></thead>
        <tbody>
          {(sessions||[]).map((s,i)=>(
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s['User Name'] || '-'}</td>
              <td>{s['Source Host Name'] || '-'}</td>
              <td>{s['TCP Connections'] || '-'}</td>
              <td><button onClick={()=>disconnect(s.name)}>Disconnect</button></td>
            </tr>
          ))}
          {(!sessions || sessions.length===0) && <tr><td colSpan="5">No sessions</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
