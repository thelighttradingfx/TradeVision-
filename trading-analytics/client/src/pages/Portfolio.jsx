import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { portfolioService } from '../services/api';
import { formatCurrency, formatNumber } from '../utils/formatters';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioService.getSummary()
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading portfolio...</div>;

  const holdings = data?.holdings || [];
  const summary = data?.summary || {};
  const pieData = holdings.map((h) => ({ name: h.symbol, value: parseFloat(h.totalCost.toFixed(2)) }));

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Portfolio</h1>

      <div style={styles.summaryGrid}>
        {[
          { label: 'Total Invested', value: formatCurrency(summary.totalInvested || 0) },
          { label: 'Open Positions', value: summary.totalPositions || 0 },
          { label: 'Total Trades', value: summary.totalTrades || 0 },
        ].map((s) => (
          <div key={s.label} style={styles.summaryCard}>
            <div style={styles.summaryLabel}>{s.label}</div>
            <div style={styles.summaryValue}>{s.value}</div>
          </div>
        ))}
      </div>

      {holdings.length === 0 ? (
        <div style={styles.empty}>No open positions. Start trading to build your portfolio.</div>
      ) : (
        <div style={styles.content}>
          <div style={styles.chartCard}>
            <h2 style={styles.cardTitle}>Allocation</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} labelStyle={{ color: '#f1f5f9' }} />
                <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 13 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.holdingsCard}>
            <h2 style={styles.cardTitle}>Holdings</h2>
            <div style={styles.holdingsList}>
              {holdings.map((h, i) => (
                <div key={h.symbol} style={styles.holdingRow}>
                  <div style={styles.holdingLeft}>
                    <div style={{ ...styles.dot, background: COLORS[i % COLORS.length] }} />
                    <div>
                      <div style={styles.holdingSymbol}>{h.symbol}</div>
                      <div style={styles.holdingQty}>{formatNumber(h.quantity, 6)} units</div>
                    </div>
                  </div>
                  <div style={styles.holdingRight}>
                    <div style={styles.holdingValue}>{formatCurrency(h.totalCost)}</div>
                    <div style={styles.holdingAvg}>Avg: {formatCurrency(h.avgCost)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: 32, maxWidth: 1200, margin: '0 auto' },
  title: { color: '#f1f5f9', fontSize: 26, fontWeight: 700, margin: '0 0 24px' },
  loading: { color: '#64748b', textAlign: 'center', padding: 60 },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  summaryCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '20px 24px' },
  summaryLabel: { color: '#64748b', fontSize: 13, marginBottom: 8 },
  summaryValue: { color: '#f1f5f9', fontSize: 24, fontWeight: 700 },
  empty: { color: '#64748b', textAlign: 'center', padding: 60, background: '#1e293b', borderRadius: 12, border: '1px solid #334155' },
  content: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  chartCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24 },
  holdingsCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24 },
  cardTitle: { color: '#e2e8f0', fontSize: 15, fontWeight: 600, margin: '0 0 16px' },
  holdingsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  holdingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #0f172a' },
  holdingLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  holdingSymbol: { color: '#f1f5f9', fontWeight: 700, fontSize: 14 },
  holdingQty: { color: '#64748b', fontSize: 12, marginTop: 2 },
  holdingRight: { textAlign: 'right' },
  holdingValue: { color: '#f1f5f9', fontWeight: 600, fontSize: 14 },
  holdingAvg: { color: '#64748b', fontSize: 12, marginTop: 2 },
};

export default Portfolio;
