import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';
  return (
    <aside className="sidebar">
      <div className="brand">VPN Admin</div>
      <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/users" className={linkClass}>Users</NavLink>
      <NavLink to="/sessions" className={linkClass}>Sessions</NavLink>
      <NavLink to="/tools" className={linkClass}>Tools</NavLink>
    </aside>
  );
}
