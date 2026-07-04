import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? (user.role === 'admin' ? '/admin' : '/') : '/'} className="brand" onClick={closeMenu}>
          <span className="brand-mark">🍽️</span>
          <span>RRMS</span>
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle navigation">
          ☰
        </button>

        {user ? (
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {user.role === 'admin' ? (
              <>
                <Link to="/admin" onClick={closeMenu}>Dashboard</Link>
                <Link to="/admin/reservations" onClick={closeMenu}>Reservations</Link>
                <Link to="/admin/tables" onClick={closeMenu}>Tables</Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={closeMenu}>Dashboard</Link>
                <Link to="/create-reservation" onClick={closeMenu}>Book</Link>
                <Link to="/my-reservations" onClick={closeMenu}>My Bookings</Link>
              </>
            )}
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
