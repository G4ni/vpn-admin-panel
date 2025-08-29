import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Sessions from "./pages/Sessions.jsx";
import Tools from "./pages/Tools.jsx";
import Nav from "./components/Nav.jsx";
import Topbar from "./components/Topbar.jsx";

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Nav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main>{children}</main>
      </div>
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
