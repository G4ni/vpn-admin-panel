const BASE = import.meta.env.VITE_API_BASE || '/api';
const API_KEY = import.meta.env.VITE_API_KEY;

async function request(path, opts = {}) {
  const headers = {
    'x-api-key': API_KEY,
    ...(opts.method === 'POST' ? {'Content-Type':'application/json'} : {}),
    ...(opts.headers || {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || res.statusText);
    return j;
  } else {
    const t = await res.text();
    if (!res.ok) throw new Error(t || res.statusText);
    return t;
  }
}

export const api = {
  health: () => request('/metrics/health'),
  listUsers: () => request('/vpn/list'),
  createUser: (email) => request('/vpn/create', { method:'POST', body: JSON.stringify({ email }) }),
  deleteUser: (email) => request('/vpn/delete', { method:'POST', body: JSON.stringify({ email }) }),
  downloadOvpn: async (username) => {
    const headers = { 'x-api-key': API_KEY };
    const res = await fetch(`${BASE}/vpn/ovpn?username=${encodeURIComponent(username)}`, { headers });
    if (!res.ok) throw new Error(await res.text());
    const blob = await res.blob();
    return blob;
  },
};

export const hub = {
  sessions: () => request('/hub/sessions'),
  disconnect: (sessionName) => request('/hub/disconnect', {
    method: 'POST',
    body: JSON.stringify({ sessionName })
  }),
};

export const acl = {
  apply: (email) => request('/acl/apply', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
};