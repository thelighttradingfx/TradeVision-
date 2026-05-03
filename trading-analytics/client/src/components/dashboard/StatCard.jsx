import React from 'react';

const StatCard = ({ title, value, subtitle, trend, icon, color = '#3b82f6' }) => {
  const isPositive = trend >= 0;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <span style={{ ...styles.icon, background: color + '22', color }}>{icon}</span>
      </div>
      <div style={styles.value}>{value}</div>
      {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
      {trend !== undefined && (
        <div style={{ ...styles.trend, color: isPositive ? '#10b981' : '#ef4444' }}>
          {isPositive ? '▲' : '▼'} {Math.abs(trend).toFixed(2)}%
        </div>
      )}
    </div>
  );
};

const styles = {
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { color: '#94a3b8', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  icon: { fontSize: 16, padding: '6px 8px', borderRadius: 8 },
  value: { color: '#f1f5f9', fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', fontSize: 13 },
  trend: { fontSize: 13, fontWeight: 600, marginTop: 2 },
};

export default StatCard;
