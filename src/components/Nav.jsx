import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <aside className="sidebar">
      <h3 className="nav-title">VPN Admin</h3>
      <NavLink to="/dashboard" className={({isActive})=> isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
      <NavLink to="/users" className={({isActive})=> isActive ? "nav-link active" : "nav-link"}>Users</NavLink>
      <NavLink to="/sessions" className={({isActive})=> isActive ? "nav-link active" : "nav-link"}>Sessions</NavLink>
      <NavLink to="/tools" className={({isActive})=> isActive ? "nav-link active" : "nav-link"}>Tools</NavLink>
    </aside>
  );
}
