import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Sessions from './pages/Sessions.jsx';
import Tools from './pages/Tools.jsx';

export default function App() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'100vh',fontFamily:'system-ui,Segoe UI,Roboto,Arial'}}>
      <Nav />
      <main style={{padding:'20px',maxWidth:1200,margin:'0 auto',width:'100%'}}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}
