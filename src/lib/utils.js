export function isOnline(u) {
  const val = u.online ?? u.status ?? u.state ?? u.onlineStatus;
  if (val === true || val === 1) return true;
  if (typeof val === 'string') {
    const v = val.toLowerCase();
    return v === 'online' || v === 'true' || v === '1';
  }
  return false;
}
