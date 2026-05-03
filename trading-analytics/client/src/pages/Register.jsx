import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>📈 TradeVision</div>
        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.subtitle}>Start tracking your trades today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map((f) => (
            <div key={f.name} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                name={f.name} type={f.type} value={form[f.name]}
                onChange={handleChange} style={styles.input}
                placeholder={f.placeholder} required
              />
            </div>
          ))}
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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

export default Register;
