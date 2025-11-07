// src/pages/TransactionsList.tsx
// --- INI ADALAH FILE BARU ---

import { useEffect, useState } from 'react';
import { apiService } from '../services/api'; // 1. Impor apiService
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom'; // 2. Impor 'Link'
import './Book.css'; // Kita pakai CSS yang sama

// 3. Definisikan interface untuk Transaksi
interface Transaction {
  id: string;
  total_quantity: number; // <-- Benar
  total_price: number;    // <-- Benar
  created_at: string;     // <-- Benar
  // 'status' tidak ada, jadi kita hapus
}

function TransactionsList() {
  // State untuk data, loading, dan error
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State & Fungsi untuk Navbar (copy dari Dashboard Anda) ---
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
  // --- Akhir dari State & Fungsi Navbar ---

  // 4. useEffect untuk mengambil data transaksi
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // 5. Panggil endpoint yang benar: 'transactions'
        const response = await apiService.get('transactions');

        if (response.success) {
          setTransactions(response.data);
        } else {
          throw new Error(response.message || 'Gagal memuat transaksi');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 6. Render UI (Loading, Error, Data Kosong)
  let content;
  if (loading) {
    content = <div>Loading riwayat transaksi...</div>;
  } else if (error) {
    content = <div style={{ color: 'red' }}>Error: {error}</div>;
  } else if (transactions.length === 0) {
    content = <div>Anda belum memiliki transaksi.</div>;
  } else {
    // 7. Render jika data ada (kita gunakan card lagi)
    content = (
      <div className="books-grid">
        {transactions.map((tx) => (
  <Link to={`/transactions/${tx.id}`} key={tx.id} className="book-card-link">
    <div className="book-card">
      {/* ... */}
      <div className="book-content">
        <h3 className="book-title">Transaction #{tx.id.substring(0, 8)}...</h3>
        <div className="book-writer">{new Date(tx.created_at).toLocaleDateString('id-ID')}</div> {/* <-- Benar */}
        <div className="book-meta">
          <div className="meta-badge price">Rp {tx.total_price.toLocaleString('id-ID')}</div> {/* <-- Benar */}
          <div className="meta-badge stock">{tx.total_quantity} items</div> {/* <-- Benar */}
          {/* 'status' kita hilangkan karena tidak ada di data */}
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
    {/* Navbar */}
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-brand">
          <span className="brand-icon">📚</span>
          BookStore
        </a>
        <div className="nav-links">
          <a href="/dashboard" className="nav-link">
            <span>🏠</span> Dashboard
          </a>
          <a href="/books" className="nav-link">
            <span>📖</span> Books
          </a>
          {/* Tambahkan link Transaksi di sini */}
          <a href="/transactions" className="nav-link active">
            <span>💳</span> Transactions
          </a>
        </div>
        <div className="nav-user">
          {/* ... (sisa navbar: user info, theme toggle, logout button) ... */}
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

    {/* Hero Section (Baru ditambahkan) */}
    <section className="hero-section">
      <div className="page-header">
        <h1>Riwayat Transaksi</h1>
        <p>Semua pembelian yang telah Anda lakukan.</p>
      </div>
    </section>

    {/* Konten Halaman Transaksi */}
    <div className="books-container" style={{ paddingTop: '20px' }}>
      {/* page-header sudah dipindahkan dari sini */}
      
      {/* Render konten (loading, error, atau daftar transaksi) */}
      {content}
    </div>
  </div>
);

}

export default TransactionsList;