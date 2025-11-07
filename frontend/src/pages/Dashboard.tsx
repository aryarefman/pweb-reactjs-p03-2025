import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  BookOpen, Home, Package, LogOut, Moon, Sun, User, Mail, Hash,
  CheckCircle, Zap, BarChart3
} from 'lucide-react';
import { apiService } from '../services/api'; // GANTI KE src/api.ts
import './Dashboard.css';

interface Stats {
  totalBooks: number;
  inStock: number;
  genres: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, inStock: 0, genres: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getBookStats();
        setStats(data);
      } catch {
        setStats({ totalBooks: 0, inStock: 0, genres: 0 });
      } finally {
        setLoading(false);
      }
    };

    if (apiService.isAuthenticated()) {
      fetchStats();
    } else {
      setLoading(false);
    }
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

  return (
    <div className="dashboard-wrapper">
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-brand">
            <BookOpen size={28} />
            <span>BookStore</span>
          </a>

          <div className="nav-links">
            <a href="/" className="nav-link active">
              <Home size={20} />
              <span>Dashboard</span>
            </a>
            <a href="/books" className="nav-link">
              <BookOpen size={20} />
              <span>Books</span>
            </a>
            <a href="/transactions" className="nav-link">
              <Package size={20} />
              <span>Transactions</span>
            </a>
          </div>

          <div className="nav-user">
            <div className="user-info">
              <User size={20} />
              <span className="username">{user?.username || 'User'}</span>
            </div>
            <button onClick={toggleTheme} className="btn-theme-toggle" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className="btn-logout" aria-label="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, {user?.username || 'User'}!</h1>
          <p>Your personal library dashboard</p>
        </header>

        {loading ? (
          <div className="loading-state">Loading statistics...</div>
        ) : (
          <div className="dashboard-grid">
            <div className="dashboard-card user-card">
              <div className="card-icon">
                <User size={64} />
              </div>
              <div className="card-content">
                <h3>Account Overview</h3>
                <div className="user-details">
                  <div className="detail-item">
                    <Mail size={16} />
                    <span>{user?.email || 'user@example.com'}</span>
                  </div>
                  <div className="detail-item">
                    <Hash size={16} />
                    <span>ID: {user?.id || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card status-card">
              <div className="card-icon success">
                <CheckCircle size={64} />
              </div>
              <div className="card-content">
                <h3>Account Status</h3>
                <p className="status-text">Active & Verified</p>
                <div className="status-badges">
                  <span className="badge success">Authenticated</span>
                  <span className="badge accent">Protected</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card actions-card">
              <div className="card-icon accent">
                <Zap size={64} />
              </div>
              <div className="card-content">
                <h3>Quick Actions</h3>
                <p className="action-subtitle">Manage your library</p>
                <div className="action-buttons">
                  <button onClick={() => navigate('/books')} className="btn-action secondary">
                    Browse Books
                  </button>
                  <button onClick={() => navigate('/books/add')} className="btn-action primary">
                    Add New Book
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-card stats-card">
              <div className="card-icon secondary">
                <BarChart3 size={64} />
              </div>
              <div className="card-content">
                <h3>Library Statistics</h3>
                <p className="stats-subtitle">Collection Overview</p>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span>Total Books</span>
                    <strong>{stats.totalBooks}</strong>
                  </div>
                  <div className="stat-item">
                    <span>In Stock</span>
                    <strong>{stats.inStock}</strong>
                  </div>
                  <div className="stat-item">
                    <span>Genres</span>
                    <strong>{stats.genres}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© 2025 BookStore. All rights reserved.</p>
      </footer>
    </div>
  );
}