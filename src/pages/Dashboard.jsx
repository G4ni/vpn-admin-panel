import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Dashboard() {
  const [health, setHealth] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setErr('')
        const h = await api.health()
        setHealth(h)
      } catch (e) {
        setErr(String(e.message || e))
      }
    })()
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      {err && <div style={{color:'crimson'}}>Error: {err}</div>}
      {health ? (
        <pre style={{background:'#0b1220', color:'#cbd5e1', padding:12, borderRadius:8}}>
{JSON.stringify(health, null, 2)}
        </pre>
      ) : (
        !err && <div>Loading...</div>
      )}
    </div>
  )
}