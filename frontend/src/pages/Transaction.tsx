import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Home,
  Package,
  LogOut,
  Moon,
  Sun,
  User,
  Calendar,
} from 'lucide-react';
import './Book.css';

interface Transaction {
  id: string;
  total_quantity: number;
  total_price: number;
  created_at: string;
}

function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load theme
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

  // Fetch – **API tidak diubah**, tetap `apiService.get('transactions')`
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.get('transactions');

        if (response.success) {
          setTransactions(response.data);
        } else {
          throw new Error(response.message || 'Gagal memuat transaksi');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Content
  let content: React.ReactNode;
  if (loading) {
    content = <div className="loading-state">Memuat riwayat transaksi...</div>;
  } else if (error) {
    content = <div className="error-state">Error: {error}</div>;
  } else if (transactions.length === 0) {
    content = <div className="empty-state">Anda belum memiliki transaksi.</div>;
  } else {
    content = (
      <div className="books-grid">
        {transactions.map((tx) => (
          <Link
            key={tx.id}
            to={`/transactions/${tx.id}`}
            className="book-card-link"
          >
            <div className="book-card">
              <div className="book-image-wrapper">
                <Package
                  size={48}
                  strokeWidth={1.8}
                  color={theme === 'dark' ? '#f5f5f5' : '#333'}
                />
              </div>
              <div className="book-content">
                <h3 className="book-title">
                  Transaksi #{tx.id.substring(0, 8).toUpperCase()}...
                </h3>
                <div className="book-writer">
                  <Calendar size={14} style={{ marginRight: 6 }} />
                  {new Date(tx.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className="book-meta">
                  <div className="meta-badge price">
                    Rp {tx.total_price.toLocaleString('id-ID')}
                  </div>
                  <div className="meta-badge stock">
                    {tx.total_quantity} item{tx.total_quantity > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR – identik dengan Dashboard & BooksList */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-brand">
            <BookOpen size={28} />
            <span style={{ marginLeft: 8 }}>BookStore</span>
          </a>

          <div className="nav-links">
            <a href="/dashboard" className="nav-link">
              <Home size={20} />
              <span style={{ marginLeft: 6 }}>Dashboard</span>
            </a>
            <a href="/books" className="nav-link">
              <BookOpen size={20} />
              <span style={{ marginLeft: 6 }}>Books</span>
            </a>
            <a href="/transactions" className="nav-link active">
              <Package size={20} />
              <span style={{ marginLeft: 6 }}>Transactions</span>
            </a>
          </div>

          <div className="nav-user">
            <div className="user-info">
              <User size={20} />
              <span id="userName" style={{ marginLeft: 6 }}>
                {user?.username || 'User'}
              </span>
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

      {/* HERO */}
      <div className="books-container" style={{ paddingTop: 20 }}>
        <div className="page-header">
          <h1>Riwayat Transaksi</h1>
          <p>Semua pembelian yang telah Anda lakukan.</p>
        </div>
        {content}
      </div>
    </div>
  );
}

export default TransactionsList;