import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Book.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
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
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-brand">
            <span className="brand-icon">📚</span>
            BookStore
          </a>
          <div className="nav-links">
            <a href="/" className="nav-link active">
              <span>🏠</span> Dashboard
            </a>
            <a href="/books" className="nav-link">
              <span>📖</span> Books
            </a>
          </div>
          <div className="nav-user">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span id="userName">{user?.username}</span>
            </div>
            <button onClick={toggleTheme} className="btn-theme-toggle">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="page-header">
          <h1>Welcome Back! 👋</h1>
          <p>Your Personal Dashboard</p>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="books-container" style={{ paddingTop: '20px' }}>
        <div className="books-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          
          {/* Welcome Card */}
          <div className="book-card" style={{ cursor: 'default' }}>
            <div className="book-image-wrapper" style={{ 
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px'
            }}>
              👤
            </div>
            <div className="book-content">
              <h3 className="book-title">Welcome, {user?.username}!</h3>
              <div className="book-writer">Account Information</div>
              <div className="book-meta" style={{ flexDirection: 'column', gap: '8px' }}>
                <div className="meta-badge" style={{ 
                  background: 'var(--card-hover)', 
                  color: 'var(--text-primary)',
                  width: '100%',
                  justifyContent: 'flex-start'
                }}>
                  📧 {user?.email}
                </div>
                <div className="meta-badge" style={{ 
                  background: 'var(--card-hover)', 
                  color: 'var(--text-primary)',
                  width: '100%',
                  justifyContent: 'flex-start'
                }}>
                  🆔 User ID: {user?.id}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="book-card" style={{ cursor: 'default' }}>
            <div className="book-image-wrapper" style={{ 
              background: 'linear-gradient(135deg, var(--success-color) 0%, #229954 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px'
            }}>
              ✅
            </div>
            <div className="book-content">
              <h3 className="book-title">Account Status</h3>
              <div className="book-writer">Active & Verified</div>
              <div className="book-meta">
                <div className="meta-badge" style={{ background: 'var(--success-color)', color: 'white' }}>
                  ✓ Authenticated
                </div>
                <div className="meta-badge" style={{ background: 'var(--accent-color)', color: 'white' }}>
                  ✓ Protected
                </div>
              </div>
              <p style={{ 
                marginTop: '12px', 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}>
                You are successfully logged in and have access to all protected features of the application.
              </p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="book-card" style={{ cursor: 'default' }}>
            <div className="book-image-wrapper" style={{ 
              background: 'linear-gradient(135deg, var(--accent-color) 0%, #3498db 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px'
            }}>
              ⚡
            </div>
            <div className="book-content">
              <h3 className="book-title">Quick Actions</h3>
              <div className="book-writer">Manage Your Library</div>
              <div className="book-actions" style={{ flexDirection: 'column', marginTop: '16px' }}>
                <button 
                  onClick={() => navigate('/books')} 
                  className="btn-view"
                  style={{ width: '100%' }}
                >
                  📚 Browse Books
                </button>
                <button 
                  onClick={() => navigate('/books/add')} 
                  className="btn-view"
                  style={{ width: '100%', background: 'var(--success-color)' }}
                >
                  ➕ Add New Book
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="book-card" style={{ cursor: 'default' }}>
            <div className="book-image-wrapper" style={{ 
              background: 'linear-gradient(135deg, var(--secondary-color) 0%, #6d5d3a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px'
            }}>
              📊
            </div>
            <div className="book-content">
              <h3 className="book-title">Library Statistics</h3>
              <div className="book-writer">Your Collection Overview</div>
              <div className="book-meta" style={{ flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <div className="meta-badge price" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>Total Books</span>
                  <span style={{ fontWeight: '700' }}>-</span>
                </div>
                <div className="meta-badge stock" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>In Stock</span>
                  <span style={{ fontWeight: '700' }}>-</span>
                </div>
                <div className="meta-badge condition" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>Genres</span>
                  <span style={{ fontWeight: '700' }}>-</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}>
        <p>© 2025 BookStore. All rights reserved.</p>
      </div>
    </div>
  );
}