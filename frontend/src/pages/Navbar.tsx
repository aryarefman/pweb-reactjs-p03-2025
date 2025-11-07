// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  BookOpen,
  Home,
  Package,
  LogOut,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css'; // Opsional, kalau butuh style khusus

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load theme dari localStorage
  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Jangan tampilkan navbar di halaman login/register
  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* BRAND */}
        <Link to="/" className="nav-brand">
          <BookOpen size={28} />
          <span style={{ marginLeft: 8 }}>BookStore</span>
        </Link>

        {/* LINKS */}
        <div className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <Home size={20} />
            <span style={{ marginLeft: 6 }}>Dashboard</span>
          </Link>
          <Link
            to="/books"
            className={`nav-link ${location.pathname.startsWith('/books') ? 'active' : ''}`}
          >
            <BookOpen size={20} />
            <span style={{ marginLeft: 6 }}>Books</span>
          </Link>
          <Link
            to="/transactions"
            className={`nav-link ${location.pathname.startsWith('/transactions') ? 'active' : ''}`}
          >
            <Package size={20} />
            <span style={{ marginLeft: 6 }}>Transactions</span>
          </Link>
        </div>

        {/* USER ACTIONS */}
        <div className="nav-user">
          <div className="user-info">
            <User size={20} />
            <span style={{ marginLeft: 6 }}>{user?.username || 'User'}</span>
          </div>
          <button onClick={toggleTheme} className="btn-theme-toggle">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}