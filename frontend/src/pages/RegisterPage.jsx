import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(form.name, form.email, form.password);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-shell">
      <div className="auth-copy">
        <p className="eyebrow">Join RRMS</p>
        <h2>Create an account and reserve with confidence.</h2>
        <p>Sign up to manage your bookings, save time, and enjoy a smoother restaurant experience on every visit.</p>
        <ul className="feature-list">
          <li>One account for all future reservations</li>
          <li>Quick access to your booking history</li>
          <li>Easy cancellations and updates</li>
        </ul>
      </div>

      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          {error && <div className="alert alert-error">{error}</div>}
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" type="email" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Choose a password" type="password" required />
          </label>
          <button className="btn btn-primary" disabled={loading}>{loading ? <span className="spinner" /> : 'Create account'}</button>
        </form>
        <p style={{ marginTop: 12 }}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
