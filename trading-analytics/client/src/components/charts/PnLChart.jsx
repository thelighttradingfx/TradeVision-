import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { portfolioService } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const PnLChart = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data: res } = await portfolioService.getPnL(period);
        setData(res.pnl);
      } catch (_) {}
      setLoading(false);
    };
    fetch();
  }, [period]);

  const totalPnL = data.length ? data[data.length - 1].cumulativePnl : 0;
  const isPositive = totalPnL >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>{label}</p>
        <p style={{ color: isPositive ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 600, margin: '4px 0 0' }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Cumulative P&L</div>
          <div style={{ ...styles.totalPnL, color: isPositive ? '#10b981' : '#ef4444' }}>
            {isPositive ? '+' : ''}{formatCurrency(totalPnL)}
          </div>
        </div>
        <div style={styles.periods}>
          {['7', '30', '90'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{ ...styles.periodBtn, ...(period === p ? styles.activePeriod : {}) }}
            >
              {p}D
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div style={styles.loading}>Loading chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#334155" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="cumulativePnl"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              fill="url(#pnlGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const styles = {
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { color: '#94a3b8', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  totalPnL: { fontSize: 22, fontWeight: 700, marginTop: 4 },
  periods: { display: 'flex', gap: 4 },
  periodBtn: { background: 'transparent', border: '1px solid #334155', color: '#64748b', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  activePeriod: { background: '#1e3a5f', border: '1px solid #3b82f6', color: '#60a5fa' },
  loading: { height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' },
};

export default PnLChart;
