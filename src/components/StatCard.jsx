import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, title, value, sub, color = '#3b82f6', bg = 'rgba(59,130,246,0.15)' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            background: bg,
            color,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}
        >
          <Icon size={14} />
        </span>
        {title}
      </div>
      <div className="card-value">{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#666' }}>{sub}</div>}
    </motion.div>
  );
}
