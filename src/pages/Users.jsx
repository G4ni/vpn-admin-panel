import { useEffect, useState } from 'react'
import { api, acl } from '../lib/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function refresh() {
    setLoading(true)
    setMsg('')
    try {
      const data = await api.listUsers()
      setUsers(Array.isArray(data.users) ? data.users : [])
    } catch (e) {
      setMsg('Error: ' + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  async function onCreate(e) {
    e.preventDefault()
    if (!email) return
    setMsg(''); setLoading(true)
    try {
      const r = await api.createUser(email)
      setMsg(r.message || 'User created')
      setEmail('')
      await refresh()
    } catch (e) {
      setMsg('Error: ' + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(nameOrEmail) {
    const emailLike = nameOrEmail.includes('@') ? nameOrEmail : `${nameOrEmail}@example.com`
    if (!confirm(`Delete user ${emailLike}?`)) return
    setMsg(''); setLoading(true)
    try {
      const r = await api.deleteUser(emailLike)
      setMsg(r.message || 'User deleted')
      await refresh()
    } catch (e) {
      setMsg('Error: ' + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  async function onDownloadOvpn(username) {
    try {
      const blob = await api.downloadOvpn(username)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${username}.ovpn`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      setMsg('Download error: ' + (e.message || e))
    }
  }

  async function onApplyAcl(nameOrEmail) {
    const emailLike = nameOrEmail.includes('@') ? nameOrEmail : `${nameOrEmail}@example.com`
    setMsg(''); setLoading(true)
    try {
      const r = await acl.apply(emailLike)
      setMsg(r.message || 'ACL applied')
    } catch (e) {
      setMsg('Error: ' + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Users</h2>

      <form onSubmit={onCreate} style={{display:'flex', gap:8, margin:'12px 0'}}>
        <input
          type="email" placeholder="email@domain.tld"
          value={email} onChange={e=>setEmail(e.target.value)}
          style={{padding:8, minWidth:260}}
        />
        <button disabled={loading}>Create</button>
        <button type="button" onClick={refresh} disabled={loading}>Refresh</button>
      </form>

      {msg && <div style={{margin:'8px 0', color: msg.startsWith('Error')?'crimson':'#0a0'}}>
        {msg}
      </div>}

      <div style={{overflow:'auto'}}>
        <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users||[]).length === 0 ? (
              <tr><td colSpan="3" style={{textAlign:'center', color:'#64748b'}}>No users</td></tr>
            ) : users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.group || '-'}</td>
                <td style={{display:'flex', gap:8}}>
                  <button onClick={() => onApplyAcl(u.name)}>ACL</button>
                  <button onClick={() => onDownloadOvpn(u.name)}>OVPN</button>
                  <button onClick={() => onDelete(u.name)} style={{color:'crimson'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}