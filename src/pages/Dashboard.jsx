import React from 'react';
import { Cpu, HardDrive, MemoryStick, Timer, Users, UserCheck, UserX } from 'lucide-react';
import { getHealth, listUsers } from '../lib/api';
import StatCard from '../components/StatCard';
import { isOnline } from '../lib/utils';

function formatBytes(b) {
  if (!b && b !== 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let n = b;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${units[i]}`;
}

function formatUptime(sec) {
  if (!sec && sec !== 0) return '-';
  const h = Math.floor(sec / 3600).toString().padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function Dashboard() {
  const [metrics, setMetrics] = React.useState(null);
  const [users, setUsers] = React.useState({ total: 0, online: 0, offline: 0 });
  const [status, setStatus] = React.useState('Down');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let timer;
    let attempt = 0;
    const load = async () => {
      try {
        const [m, u] = await Promise.all([getHealth(), listUsers()]);
        setMetrics(m);
        const list = u.users || [];
        const online = list.filter(isOnline).length;
        setUsers({ total: list.length, online, offline: list.length - online });
        setStatus('OK');
        setError('');
        attempt = 0;
        timer = setTimeout(load, 15000);
      } catch (e) {
        setError(e.message || String(e));
        attempt += 1;
        setStatus(attempt === 1 ? 'Degraded' : 'Down');
        const delay = 15000 * Math.pow(2, attempt);
        timer = setTimeout(load, delay);
      }
    };
    load();
    return () => clearTimeout(timer);
  }, []);

  const cpu = metrics?.cpu ?? metrics?.cpuUsage;
  const memUsed = metrics?.memory?.used ?? metrics?.memUsed;
  const memTotal = metrics?.memory?.total ?? metrics?.memTotal;
  const memPct = metrics?.memory?.percent ?? metrics?.memoryUsage ?? (memUsed && memTotal ? (memUsed / memTotal) * 100 : undefined);
  const diskUsed = metrics?.disk?.used ?? metrics?.diskUsed;
  const diskTotal = metrics?.disk?.total ?? metrics?.diskTotal;
  const diskPct = metrics?.disk?.percent ?? metrics?.diskUsage ?? (diskUsed && diskTotal ? (diskUsed / diskTotal) * 100 : undefined);
  const uptime = formatUptime(metrics?.uptime);

  const badgeColor =
    status === 'OK' ? '#16a34a' : status === 'Degraded' ? '#f59e0b' : '#dc2626';

  return (
    <div>
      <h2 style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        Dashboard
        <span style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 4, background: badgeColor, color: '#fff', fontSize: 12 }}>
          {status}
        </span>
      </h2>
      {error && <div className="alert" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon={Cpu} title="CPU Usage" value={cpu !== undefined ? `${cpu}%` : '-'} color="#3b82f6" bg="rgba(59,130,246,0.15)" />
        <StatCard
          icon={MemoryStick}
          title="Memory Usage"
          value={memPct !== undefined ? `${memPct.toFixed(1)}%` : '-'}
          sub={memUsed !== undefined ? `${formatBytes(memUsed)} / ${formatBytes(memTotal)}` : undefined}
          color="#22c55e"
          bg="rgba(34,197,94,0.15)"
        />
        <StatCard
          icon={HardDrive}
          title="Disk Usage"
          value={diskPct !== undefined ? `${diskPct.toFixed(1)}%` : '-'}
          sub={diskUsed !== undefined ? `${formatBytes(diskUsed)} / ${formatBytes(diskTotal)}` : undefined}
          color="#a855f7"
          bg="rgba(168,85,247,0.15)"
        />
        <StatCard icon={Timer} title="Uptime" value={uptime} color="#14b8a6" bg="rgba(20,184,166,0.15)" />
      </div>
      <div className="grid grid-3">
        <StatCard icon={Users} title="Total Users" value={users.total} color="#2563eb" bg="rgba(37,99,235,0.15)" />
        <StatCard icon={UserCheck} title="Online Users" value={users.online} color="#22c55e" bg="rgba(34,197,94,0.15)" />
        <StatCard icon={UserX} title="Offline Users" value={users.offline} color="#ef4444" bg="rgba(239,68,68,0.15)" />
      </div>
    </div>
  );
}
