import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Sessions from "./pages/Sessions.jsx";
import Tools from "./pages/Tools.jsx";

function ErrorBoundary({ children }) {
  const [err, setErr] = React.useState(null);
  if (err) {
    return (
      <div style={{ padding: 16 }}>
        <h3>Something went wrong</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(err)}</pre>
      </div>
    );
  }
  return (
    <React.Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
      <BoundarySetter onError={setErr}>{children}</BoundarySetter>
    </React.Suspense>
  );
}

function BoundarySetter({ children, onError }) {
  React.useEffect(() => {
    const handler = (e) => onError(e.reason || e.error || e);
    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler);
    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler);
    };
  }, [onError]);
  return children;
}

function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, Arial" }}>
      <aside style={{ width: 180, borderRight: "1px solid #eee", padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>VPN Admin</h3>
        <nav style={{ display: "grid", gap: 8 }}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/sessions">Sessions</NavLink>
          <NavLink to="/tools">Tools</NavLink>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="*" element={<div>Not found</div>} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
