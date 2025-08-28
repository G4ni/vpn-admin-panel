import { NavLink, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Users from './pages/Users.jsx'
import Sessions from './pages/Sessions.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex" style={{fontFamily:'sans-serif'}}>
      <aside style={{width: 220, background:'#0f172a', color:'#fff', padding:16}}>
        <h3 style={{marginBottom:16}}>VPN Admin</h3>
        <nav style={{display:'grid', gap:8}}>
          <NavLink to="/" end style={{color:'#fff'}}>Dashboard</NavLink>
          <NavLink to="/users" style={{color:'#fff'}}>Users</NavLink>
          <NavLink to="/sessions" style={{color:'#fff'}}>Sessions</NavLink>
        </nav>
      </aside>

      <main style={{flex:1, padding:24}}>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/sessions" element={<Sessions/>} />
        </Routes>
      </main>
    </div>
  )
}