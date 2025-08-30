const BASE = import.meta.env.VITE_API_BASE;
const KEY  = import.meta.env.VITE_API_KEY;

async function req(path, opts={}) {
  const r = await fetch(`${BASE}${path}`, {
    headers: { 'x-api-key': KEY, 'Content-Type': 'application/json', ...(opts.headers||{}) },
    ...opts
  });
  const ct = r.headers.get('content-type') || '';
  if (ct.includes('application/json')) return r.json();
  return r; // untuk download file
}

export const Api = {
  // metrics
  health:      () => req('/metrics'),

  // users
  usersList:   () => req('/vpn/list'),
  userCreate:  (email) => req('/vpn/create', { method:'POST', body: JSON.stringify({ email }) }),
  userDelete:  (email) => req('/vpn/delete', { method:'POST', body: JSON.stringify({ email }) }),
  setPassword: (email, password) => req('/vpn/set-password', { method:'POST', body: JSON.stringify({ email, password }) }),

  // sessions
  sessions:      () => req('/hub/sessions'),
  disconnect:    (sessionName) => req('/hub/disconnect', { method:'POST', body: JSON.stringify({ sessionName }) }),
  disconnectAll: () => req('/hub/disconnect-all', { method:'POST' }),

  // cleanup
  cleanupInactive: (days=30) => req('/cleanup/inactive', { method:'POST', body: JSON.stringify({ days }) }),

  // ovpn download
  ovpnDownload: async (email) => {
    const r = await fetch(`${BASE}/vpn/ovpn`, {
      method:'POST',
      headers:{ 'x-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!r.ok) throw new Error(`OVPN download failed: ${r.status}`);
    const blob = await r.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${email.split('@')[0]}.ovpn`;
    document.body.appendChild(a); a.click(); a.remove();
  }
};
