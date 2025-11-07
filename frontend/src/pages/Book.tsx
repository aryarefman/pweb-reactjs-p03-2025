import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
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
import './Book.css';

interface Book {
  id: string;
  title: string;
  writer: string;
  price: number;
  stock: number;
  description?: string; 
}

function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); 
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.get('books');

        if (response.success) {
          setBooks(response.data);
        } else {
          throw new Error(response.message || 'Gagal memuat data buku');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  let content: React.ReactNode;
  if (loading) {
    content = <div className="loading-state">Memuat data buku...</div>;
  } else if (error) {
    content = <div className="error-state">Error: {error}</div>;
  } else if (books.length === 0) {
    content = <div className="empty-state">Belum ada buku yang tersedia.</div>;
  } else {
    content = (
      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => setSelectedBook(book)} // <-- JADI SEPERTI INI
            style={{ cursor: 'pointer' }}
>
            <div className="book-image-wrapper">
              <BookOpen
                size={48}
                strokeWidth={1.8}
                color={theme === 'dark' ? '#f5f5f5' : '#333'}
              />
            </div>
            <div className="book-content">
              <h3 className="book-title">{book.title}</h3>
              <div className="book-writer">{book.writer}</div>
              <p className="book-description">
                {book.description || 'Tidak ada deskripsi untuk buku ini.'}
              </p>
              <div className="book-meta">
                <div className="meta-badge price">
                  Rp {book.price.toLocaleString('id-ID')}
                </div>
                <div className="meta-badge stock">{book.stock} in stock</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
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
            <a href="/books" className="nav-link active">
              <BookOpen size={20} />
              <span style={{ marginLeft: 6 }}>Books</span>
            </a>
            <a href="/transactions" className="nav-link">
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

      <div className="books-container" style={{ paddingTop: 20 }}>
        <div className="page-header">
          <h1>Daftar Buku</h1>
          <p>Semua buku yang tersedia di perpustakaan.</p>
        </div>
        {content}
      </div>
      {selectedBook && (
    <div className="modal-backdrop" onClick={() => setSelectedBook(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setSelectedBook(null)}
        >
          &times;
        </button>

        {/* Kita gunakan style dari halaman detail sebelumnya */}
        <div className="book-detail-layout-modal">
          <div className="book-detail-image-wrapper">
            <BookOpen size={100} strokeWidth={1} />
          </div>
          <div className="book-detail-content">
            <h1 className="book-detail-title">{selectedBook.title}</h1>
            <h2 className="book-detail-writer">oleh {selectedBook.writer}</h2>

            {/* Tampilkan deskripsi lengkap (tidak dipotong) */}
            <h3 className="book-detail-section-title">Deskripsi</h3>
            <p className="book-detail-description-modal">
              {selectedBook.description || 'Tidak ada deskripsi untuk buku ini.'}
            </p>

            {/* Anda bisa tambahkan detail lain di sini jika ada di data */}
            {/* <h3 className="book-detail-section-title">Detail Lainnya</h3>
            <ul className="book-detail-list">
              <li><strong>Penerbit:</strong> {selectedBook.publisher}</li>
              <li><strong>Tahun Terbit:</strong> {selectedBook.publication_year}</li>
            </ul>
            */}
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}

export default BooksList;