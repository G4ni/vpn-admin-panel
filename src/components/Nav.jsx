import React from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle = ({isActive}) => ({
  display:'block', padding:'10px 12px', borderRadius:10, margin:'6px 8px',
  textDecoration:'none', color:isActive?'#fff':'#333', background:isActive?'#3b82f6':'transparent'
});

export default function Nav() {
  return (
    <aside style={{width:180, borderRight:'1px solid #eee', padding:'18px 10px'}}>
      <h3 style={{margin:'0 8px 12px'}}>VPN Admin</h3>
      <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/users" style={linkStyle}>Users</NavLink>
      <NavLink to="/sessions" style={linkStyle}>Sessions</NavLink>
      <NavLink to="/tools" style={linkStyle}>Tools</NavLink>
    </aside>
  );
}
