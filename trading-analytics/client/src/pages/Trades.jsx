import React, { useState } from 'react';
import { useTrades } from '../hooks/useTrades';
import { formatCurrency, formatDate } from '../utils/formatters';

const EMPTY_FORM = { symbol: '', type: 'buy', quantity: '', price: '', fee: '', notes: '' };

const Trades = () => {
  const { trades, loading, addTrade, removeTrade } = useTrades();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await addTrade({ ...form, quantity: Number(form.quantity), price: Number(form.price), fee: Number(form.fee || 0) });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add trade');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Trade History</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Trade'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Log New Trade</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              {[
                { name: 'symbol', label: 'Symbol', placeholder: 'BTC, AAPL...', type: 'text' },
                { name: 'quantity', label: 'Quantity', placeholder: '0.5', type: 'number' },
                { name: 'price', label: 'Price (USD)', placeholder: '45000', type: 'number' },
                { name: 'fee', label: 'Fee (optional)', placeholder: '0', type: 'number' },
              ].map((f) => (
                <div key={f.name} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                    style={styles.input} placeholder={f.placeholder} step="any" />
                </div>
              ))}
              <div style={styles.field}>
                <label style={styles.label}>Type</label>
                <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Notes</label>
                <input name="notes" type="text" value={form.notes} onChange={handleChange}
                  style={styles.input} placeholder="Optional notes..." />
              </div>
            </div>
            <button type="submit" style={styles.submitBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Trade'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading trades...</div>
      ) : trades.length === 0 ? (
        <div style={styles.empty}>No trades yet. Add your first trade above!</div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            {['Symbol', 'Type', 'Quantity', 'Price', 'Total', 'Date', ''].map((h, i) => (
              <div key={i} style={styles.th}>{h}</div>
            ))}
          </div>
          {trades.map((t) => (
            <div key={t._id} style={styles.tableRow}>
              <div style={styles.symbol}>{t.symbol}</div>
              <div style={{ ...styles.badge, ...(t.type === 'buy' ? styles.buyBadge : styles.sellBadge) }}>
                {t.type.toUpperCase()}
              </div>
              <div style={styles.td}>{t.quantity}</div>
              <div style={styles.td}>{formatCurrency(t.price)}</div>
              <div style={styles.td}>{formatCurrency(t.total)}</div>
              <div style={styles.td}>{formatDate(t.executedAt)}</div>
              <button onClick={() => removeTrade(t._id)} style={styles.deleteBtn}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: 32, maxWidth: 1200, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#f1f5f9', fontSize: 26, fontWeight: 700, margin: 0 },
  addBtn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  formCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24, marginBottom: 24 },
  formTitle: { color: '#e2e8f0', fontSize: 16, fontWeight: 600, margin: '0 0 16px' },
  error: { background: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: 500 },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, outline: 'none' },
  submitBtn: { background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14, alignSelf: 'flex-start' },
  loading: { color: '#64748b', textAlign: 'center', padding: 60 },
  empty: { color: '#64748b', textAlign: 'center', padding: 60, background: '#1e293b', borderRadius: 12, border: '1px solid #334155' },
  table: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 80px 1fr 1fr 1fr 1fr 40px', background: '#0f172a', padding: '12px 20px' },
  th: { color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 80px 1fr 1fr 1fr 1fr 40px', padding: '14px 20px', borderTop: '1px solid #0f172a', alignItems: 'center' },
  symbol: { color: '#60a5fa', fontWeight: 700, fontSize: 14 },
  td: { color: '#cbd5e1', fontSize: 14 },
  badge: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, display: 'inline-block', width: 'fit-content' },
  buyBadge: { background: '#052e16', color: '#4ade80' },
  sellBadge: { background: '#450a0a', color: '#f87171' },
  deleteBtn: { background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, padding: 4 },
};

export default Trades;
