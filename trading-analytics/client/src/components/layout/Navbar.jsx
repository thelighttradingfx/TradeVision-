import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/trades', label: 'Trades' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/watchlist', label: 'Watchlist' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>📈</span>
        <span style={styles.brandName}>TradeVision</span>
      </div>
      <div style={styles.links}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{ ...styles.link, ...(location.pathname === link.path ? styles.activeLink : {}) }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={styles.userArea}>
        <span style={styles.userName}>{user?.name}</span>
        <span style={styles.plan}>{user?.plan}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60, background: '#0f172a', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: 8 },
  logo: { fontSize: 20 },
  brandName: { color: '#f1f5f9', fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' },
  links: { display: 'flex', gap: 4 },
  link: { color: '#94a3b8', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 500, transition: 'all 0.15s' },
  activeLink: { color: '#60a5fa', background: '#1e3a5f' },
  userArea: { display: 'flex', alignItems: 'center', gap: 12 },
  userName: { color: '#e2e8f0', fontSize: 14, fontWeight: 500 },
  plan: { background: '#1e40af', color: '#93c5fd', fontSize: 11, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', fontWeight: 600 },
  logoutBtn: { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
};

export default Navbar;
