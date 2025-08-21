import React from 'react';
import { Api } from '../api';

export default function Tools() {
  const [days, setDays] = React.useState(30);
  const cleanup = async () => {
    const r = await Api.cleanupInactive(days);
    alert(`Deleted: ${(r.deleted||[]).length} user(s)`);
    console.log(r);
  };
  return (
    <div>
      <h2>Tools</h2>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <label>Cleanup user tidak login ≥</label>
        <input type="number" min="1" value={days} onChange={e=>setDays(+e.target.value||30)} style={{width:80,padding:6}} />
        <span>hari</span>
        <button onClick={cleanup}>Run Cleanup</button>
      </div>
    </div>
  );
}
