import { useEffect, useState } from 'react';
import { apiService } from '../services/api'; 
import { useAuth } from '../context/useAuth'; 
import { useNavigate } from 'react-router-dom';
import './Book.css'; 

interface Book {
  id: string;
  title: string;
  writer: string;
  price: number;
  stock: number;
}

function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); 

  let content;
  if (loading) {
    content = <div>Loading data buku...</div>;
  } else if (error) {
    content = <div style={{ color: 'red' }}>Error: {error}</div>;
  } else if (books.length === 0) {
    content = <div>Belum ada buku yang tersedia.</div>;
  } else {

    content = (
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-image-wrapper" style={{ fontSize: '40px' }}>
              📖
            </div>
            <div className="book-content">
              <h3 className="book-title">{book.title}</h3>
              <div className="book-writer">{book.writer}</div>
              <div className="book-meta">
                <div className="meta-badge price">Rp {book.price.toLocaleString('id-ID')}</div>
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
            <span className="brand-icon">📚</span>
            BookStore
          </a>
          <div className="nav-links">
            <a href="/dashboard" className="nav-link">
              <span>🏠</span> Dashboard
            </a>
            <a href="/books" className="nav-link active"> 
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

      <div className="books-container" style={{ paddingTop: '20px' }}>
        <div className="page-header">
          <h1>Daftar Buku</h1>
          <p>Semua buku yang tersedia di perpustakaan.</p>
        </div>

        {content}
      </div>
    </div>
  );
}

export default BooksList;