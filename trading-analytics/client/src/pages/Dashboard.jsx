import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { portfolioService } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import PnLChart from '../components/charts/PnLChart';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioService.getSummary()
      .then(({ data }) => setPortfolio(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={styles.subtitle}>Here's your trading overview</p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          title="Total Invested"
          value={loading ? '—' : formatCurrency(portfolio?.summary?.totalInvested || 0)}
          icon="💰"
          color="#3b82f6"
        />
        <StatCard
          title="Open Positions"
          value={loading ? '—' : portfolio?.summary?.totalPositions || 0}
          icon="📊"
          color="#8b5cf6"
        />
        <StatCard
          title="Total Trades"
          value={loading ? '—' : portfolio?.summary?.totalTrades || 0}
          icon="🔄"
          color="#06b6d4"
        />
        <StatCard
          title="Plan"
          value={user?.plan?.toUpperCase() || 'FREE'}
          icon="⭐"
          color="#f59e0b"
        />
      </div>

      <div style={styles.chartSection}>
        <PnLChart />
      </div>

      {!loading && portfolio?.holdings?.length > 0 && (
        <div style={styles.holdingsSection}>
          <h2 style={styles.sectionTitle}>Current Holdings</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              {['Symbol', 'Quantity', 'Avg Cost', 'Total Value'].map((h) => (
                <div key={h} style={styles.th}>{h}</div>
              ))}
            </div>
            {portfolio.holdings.map((h) => (
              <div key={h.symbol} style={styles.tableRow}>
                <div style={styles.symbol}>{h.symbol}</div>
                <div style={styles.td}>{h.quantity}</div>
                <div style={styles.td}>{formatCurrency(h.avgCost)}</div>
                <div style={styles.td}>{formatCurrency(h.totalCost)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: 32, maxWidth: 1200, margin: '0 auto' },
  header: { marginBottom: 28 },
  title: { color: '#f1f5f9', fontSize: 26, fontWeight: 700, margin: 0 },
  subtitle: { color: '#64748b', fontSize: 14, margin: '4px 0 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  chartSection: { marginBottom: 24 },
  holdingsSection: {},
  sectionTitle: { color: '#e2e8f0', fontSize: 16, fontWeight: 600, margin: '0 0 12px' },
  table: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#0f172a', padding: '12px 20px' },
  th: { color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  tableRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '14px 20px', borderTop: '1px solid #1e293b', background: '#1e293b' },
  symbol: { color: '#60a5fa', fontWeight: 700, fontSize: 14 },
  td: { color: '#cbd5e1', fontSize: 14 },
};

export default Dashboard;
