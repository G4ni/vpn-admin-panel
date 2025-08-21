import React from 'react';
import { Api } from '../api';

export default function Users() {
  const [list, setList] = React.useState([]);
  const [email, setEmail] = React.useState('');

  const reload = async () => {
    const r = await Api.usersList();
    setList(r.users || []);
  };
  React.useEffect(() => { reload(); }, []);

  const createUser = async () => { if(!email) return; await Api.userCreate(email); setEmail(''); reload(); };
  const deleteUser = async (e) => { await Api.userDelete(e); reload(); };
  const setPwd     = async (e) => {
    const p = prompt(`Password baru untuk ${e}:`, 'asaku123');
    if (!p) return; await Api.setPassword(e, p); alert('Password updated'); };

  const download = async (e) => { await Api.ovpnDownload(e); };

  return (
    <div>
      <h2>Users</h2>
      <div style={{display:'flex',gap:8,margin:'12px 0'}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email user" style={{padding:8,flex:'0 0 260px'}} />
        <button onClick={createUser}>Create</button>
      </div>

      <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
        <thead><tr><th>User</th><th>Group</th><th>Aksi</th></tr></thead>
        <tbody>
          {list.map((u,i)=>(
            <tr key={i}>
              <td>{u.name}</td>
              <td>{u.group || '-'}</td>
              <td style={{display:'flex',gap:8}}>
                <button onClick={()=>setPwd(`${u.name}@example.com`)}>Set Password</button>
                <button onClick={()=>download(`${u.name}@example.com`)}>Download OVPN</button>
                <button onClick={()=>deleteUser(`${u.name}@example.com`)}>Delete</button>
              </td>
            </tr>
          ))}
          {list.length===0 && <tr><td colSpan="3">No users</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
