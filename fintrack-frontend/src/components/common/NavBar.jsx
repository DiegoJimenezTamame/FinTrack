// NavBar.jsx (Updated)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">FinTrack</Link>
        </div>

        {user ? (
          <>
            <div className="hamburger" onClick={toggleMenu}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>

            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/transactions" onClick={() => setMenuOpen(false)}>Transactions</Link></li>
              <li><Link to="/budgets" onClick={() => setMenuOpen(false)}>Budgets</Link></li>
              <li><Link to="/reports" onClick={() => setMenuOpen(false)}>Reports</Link></li>
              <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
            </ul>
          </>
        ) : (
          <ul className="nav-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;