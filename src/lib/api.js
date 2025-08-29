// Gunakan VITE_API_BASE bila tersedia agar panel dapat diarahkan ke API yang benar.
// Default ke '/api' untuk kompatibilitas lokal.
const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_KEY  = import.meta.env.VITE_API_KEY || '17AgustusTahun1945ItulahHariKemerdekaanKitaHariMerdekaNusaDanBangsa';

async function api(path, opts = {}) {
  const url = API_BASE + path;
  const init = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...(opts.headers || {}),
    },
    ...opts,
  };
  const res = await fetch(url, init);
  const raw = await res.text();
  let data;
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = { raw }; }
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  return data;
}

// Gunakan endpoint yang EXIST di server:
// metrics = GET /metrics
export const getHealth    = () => api('/metrics');

// Users
export const listUsers    = () => api('/vpn/list');
export const createUser   = (email) => api('/vpn/create', { method:'POST', body: JSON.stringify({ email }) });
export const setPassword  = (email, password) => api('/vpn/set-password', { method:'POST', body: JSON.stringify({ email, password }) });
export const delUser      = (email) => api('/vpn/delete', { method:'POST', body: JSON.stringify({ email }) });

// Sessions
export const listSessions = () => api('/hub/sessions');
export const disconnect   = (sessionName) => api('/hub/disconnect', { method:'POST', body: JSON.stringify({ sessionName }) });

// Download OVPN via <a href> (tidak bisa header), kirim api-key via query yang didukung server
export const downloadOvpn = (emailOrUser) => {
  const q = new URLSearchParams({ email: emailOrUser, x_api_key: API_KEY }).toString();
  return `${API_BASE}/vpn/ovpn?${q}`;
};

export default api;
