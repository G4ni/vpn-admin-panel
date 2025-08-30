const API_BASE = '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '17AgustusTahun1945ItulahHariKemerdekaanKitaHariMerdekaNusaDanBangsa';

async function api(path, { retries = 0, retryDelay = 1000, headers = {}, ...opts } = {}) {
  const url = API_BASE + path;
  const init = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...headers,
    },
    ...opts,
  };
  try {
    const res = await fetch(url, init);
    const raw = await res.text();
    let data;
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { raw }; }
    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      if (retries > 0) {
        await new Promise(r => setTimeout(r, retryDelay));
        return api(path, { retries: retries - 1, retryDelay: retryDelay * 2, headers, ...opts });
      }
      throw new Error(msg);
    }
    return data;
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, retryDelay));
      return api(path, { retries: retries - 1, retryDelay: retryDelay * 2, headers, ...opts });
    }
    throw err;
  }
}

export const getHealth    = () => api('/metrics', { retries: 2 });
export const listUsers    = () => api('/vpn/list', { retries: 2 });
export const createUser   = (email) => api('/vpn/create', { method:'POST', body: JSON.stringify({ email }) });
export const setPassword  = (email, password) =>
  api('/vpn/set-password', { method: 'POST', body: JSON.stringify({ email, password }) });
export const delUser      = (email) => api('/vpn/delete', { method:'POST', body: JSON.stringify({ email }) });
export const listSessions = () => api('/hub/sessions', { retries: 2 });
export const disconnect   = (sessionName) =>
  api('/hub/disconnect', { method: 'POST', body: JSON.stringify({ sessionName }) });
export const downloadOvpn = (emailOrUser) =>
  `/api/vpn/ovpn?${new URLSearchParams({ email: emailOrUser, x_api_key: API_KEY }).toString()}`;

export default api;
