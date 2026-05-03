import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>📈 TradeVision</div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              style={styles.input} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              style={styles.input} placeholder="••••••••" required />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400 },
  logo: { color: '#60a5fa', fontWeight: 700, fontSize: 20, marginBottom: 24 },
  title: { color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: '0 0 4px' },
  subtitle: { color: '#94a3b8', fontSize: 14, margin: '0 0 24px' },
  error: { background: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: 500 },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, outline: 'none' },
  btn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 4 },
  footer: { color: '#64748b', fontSize: 13, textAlign: 'center', marginTop: 20 },
  link: { color: '#60a5fa', textDecoration: 'none' },
};

export default Login;
