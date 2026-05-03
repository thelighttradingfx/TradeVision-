import React, { useEffect, useState } from 'react';
import { watchlistService } from '../services/api';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ symbol: '', name: '', alertPrice: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    watchlistService.getAll()
      .then(({ data }) => setItems(data.watchlist))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await watchlistService.add({ ...form, alertPrice: form.alertPrice ? Number(form.alertPrice) : null });
      setItems((prev) => [data.item, ...prev]);
      setForm({ symbol: '', name: '', alertPrice: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add asset');
    }
  };

  const handleRemove = async (symbol) => {
    await watchlistService.remove(symbol);
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
  };

  // Simulate mock prices
  const mockPrice = (symbol) => {
    const seed = symbol.charCodeAt(0) + symbol.charCodeAt(symbol.length - 1);
    return ((seed * 137.5) % 50000 + 50).toFixed(2);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Watchlist</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Asset'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleAdd} style={styles.form}>
            {[
              { name: 'symbol', label: 'Symbol', placeholder: 'BTC', type: 'text' },
              { name: 'name', label: 'Asset Name', placeholder: 'Bitcoin', type: 'text' },
              { name: 'alertPrice', label: 'Alert Price (optional)', placeholder: '50000', type: 'number' },
            ].map((f) => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input name={f.name} type={f.type} value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                  style={styles.input} placeholder={f.placeholder} />
              </div>
            ))}
            <button type="submit" style={styles.submitBtn}>Add to Watchlist</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading watchlist...</div>
      ) : items.length === 0 ? (
        <div style={styles.empty}>Your watchlist is empty. Add assets to monitor.</div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => {
            const price = mockPrice(item.symbol);
            const change = ((Math.random() - 0.48) * 10).toFixed(2);
            const isUp = Number(change) >= 0;
            return (
              <div key={item._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.cardSymbol}>{item.symbol}</div>
                    <div style={styles.cardName}>{item.name}</div>
                  </div>
                  <button onClick={() => handleRemove(item.symbol)} style={styles.removeBtn}>✕</button>
                </div>
                <div style={styles.cardPrice}>${price}</div>
                <div style={{ ...styles.cardChange, color: isUp ? '#10b981' : '#ef4444' }}>
                  {isUp ? '▲' : '▼'} {Math.abs(change)}%
                </div>
                {item.alertPrice && (
                  <div style={styles.alert}>🔔 Alert at ${item.alertPrice}</div>
                )}
              </div>
            );
          })}
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
  form: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: 16, alignItems: 'flex-end' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: 500 },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, outline: 'none' },
  submitBtn: { background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 14, height: 42 },
  error: { background: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  loading: { color: '#64748b', textAlign: 'center', padding: 60 },
  empty: { color: '#64748b', textAlign: 'center', padding: 60, background: '#1e293b', borderRadius: 12, border: '1px solid #334155' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardSymbol: { color: '#f1f5f9', fontWeight: 700, fontSize: 18 },
  cardName: { color: '#64748b', fontSize: 13, marginTop: 2 },
  removeBtn: { background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14 },
  cardPrice: { color: '#f1f5f9', fontSize: 22, fontWeight: 700, marginBottom: 4 },
  cardChange: { fontSize: 14, fontWeight: 600 },
  alert: { color: '#fbbf24', fontSize: 12, marginTop: 10, background: '#1c1a09', border: '1px solid #854d0e', borderRadius: 6, padding: '4px 8px' },
};

export default Watchlist;
