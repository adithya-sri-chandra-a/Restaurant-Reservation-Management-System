import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleAdminLogin = async () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    setLoading(true);
    setError('');

    try {
      const res = await login(adminEmail, adminPassword);
      const role = res?.user?.role;
      window.location.href = role === 'admin' ? '/admin' : '/';
    } catch (err) {
      console.error('Admin login error:', err);
      const serverMsg = err?.response?.data?.message;
      const details = err?.response?.data || err.message;
      setError(serverMsg || 'Admin login failed');
      // Attach debugging details to console for developer
      console.debug('Admin login debug:', { adminEmail, details });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerLogin = async () => {
    const customerEmail = import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || 'demo@example.com';
    const customerPassword = import.meta.env.VITE_DEMO_CUSTOMER_PASSWORD || 'demo123';
    setLoading(true);
    setError('');

    try {
      const res = await login(customerEmail, customerPassword);
      const role = res?.user?.role;
      window.location.href = role === 'admin' ? '/admin' : '/';
    } catch (err) {
      console.error('Customer login error:', err);
      setError(err.response?.data?.message || 'Customer login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      const role = res?.user?.role;
      window.location.href = role === 'admin' ? '/admin' : '/';
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-shell">
      <div className="auth-copy">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in and continue your dining plan.</h2>
        <p>Access your reservations, manage your bookings, and enjoy a faster restaurant experience.</p>
        <ul className="feature-list">
          <li>Book tables in seconds</li>
          <li>Track your upcoming visits</li>
          <li>Stay updated on every reservation</li>
        </ul>
      </div>

      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          {error && <div className="alert alert-error">{error}</div>}
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" type="password" required />
          </label>
          
        </form>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div>
            <button className="btn btn-ghost" onClick={handleCustomerLogin} disabled={loading}>Login as customer</button>
            <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
              Uses: <strong>{import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || 'demo@example.com'}</strong>
            </div>
          </div>

          <div>
            <button className="btn btn-ghost" onClick={handleAdminLogin} disabled={loading}>Login as admin</button>
            <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
              Uses: <strong>{import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'}</strong>
            </div>
          </div>
        </div>
        <p style={{ marginTop: 12 }}>No account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
