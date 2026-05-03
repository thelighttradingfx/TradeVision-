import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trades from './pages/Trades';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#64748b', textAlign: 'center', padding: 60 }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#0f172a' }}>
    <Navbar />
    <main>{children}</main>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
    <Route path="/trades" element={<PrivateRoute><Layout><Trades /></Layout></PrivateRoute>} />
    <Route path="/portfolio" element={<PrivateRoute><Layout><Portfolio /></Layout></PrivateRoute>} />
    <Route path="/watchlist" element={<PrivateRoute><Layout><Watchlist /></Layout></PrivateRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
