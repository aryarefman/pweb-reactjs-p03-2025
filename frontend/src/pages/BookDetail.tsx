// src/pages/BookDetail.tsx
// --- INI ADALAH FILE BARU ---

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Impor useParams
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
  ArrowLeft, // Icon untuk tombol kembali
  Tag,
  Archive,
  BookMarked,
  DollarSign,
  ScanLine, // Untuk ISBN
} from 'lucide-react';
import './Book.css'; // Kita tetap pakai CSS yang sama

// 2. Interface yang lebih LENGKAP untuk detail buku
// (Sesuaikan ini dengan schema.prisma Anda)
interface BookDetail {
  id: string;
  title: string;
  writer: string;
  price: number;
  stock: number;
  description?: string;
  publisher?: string;
  publication_year?: number;
  isbn?: string;
  condition?: string;
  genre?: { // Asumsi ada relasi genre
    name: string;
  };
}

function BookDetail() {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>(); // 3. Ambil 'id' dari URL
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // --- Logika Navbar & Tema (Sama seperti Book.tsx) ---
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
  // --- Akhir Logika Navbar ---

  // 4. useEffect untuk mengambil data detail buku
  useEffect(() => {
    if (!id) return; // Jangan lakukan apa-apa jika tidak ada ID

    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 5. Panggil endpoint yang benar: 'books/:id'
        const response = await apiService.get(`books/${id}`); 

        if (response.success) {
          setBook(response.data);
        } else {
          throw new Error(response.message || 'Gagal memuat detail buku');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]); // [] Jalankan lagi jika ID berubah

  // 6. Siapkan konten (Loading, Error, atau Data)
  let content: React.ReactNode;
  if (loading) {
    content = <div className="loading-state">Memuat detail buku...</div>;
  } else if (error) {
    content = <div className="error-state">Error: {error}</div>;
  } else if (!book) {
    content = <div className="empty-state">Buku tidak ditemukan.</div>;
  } else {
    // 7. Render Halaman Detail Buku
    content = (
      <div className="book-detail-layout">
        {/* Sisi Kiri: Gambar / Icon */}
        <div className="book-detail-image-wrapper">
          <BookOpen size={150} strokeWidth={1} />
        </div>

        {/* Sisi Kanan: Info Lengkap */}
        <div className="book-detail-content">
          <h1 className="book-detail-title">{book.title}</h1>
          <h2 className="book-detail-writer">oleh {book.writer}</h2>
          
          <div className="book-detail-meta-grid">
            <div className="meta-item">
              <DollarSign size={18} />
              <span>Rp {book.price.toLocaleString('id-ID')}</span>
            </div>
            <div className="meta-item">
              <Archive size={18} />
              <span>{book.stock} Pcs Tersisa</span>
            </div>
            {book.genre && (
              <div className="meta-item">
                <Tag size={18} />
                <span>{book.genre.name}</span>
              </div>
            )}
            {book.condition && (
               <div className="meta-item">
                <BookMarked size={18} />
                <span>Kondisi: {book.condition}</span>
              </div>
            )}
          </div>

          {/* Deskripsi Lengkap (tidak dipotong) */}
          <h3 className="book-detail-section-title">Deskripsi</h3>
          <p className="book-detail-description">
            {book.description || 'Tidak ada deskripsi untuk buku ini.'}
          </p>

          <h3 className="book-detail-section-title">Detail Lainnya</h3>
          <ul className="book-detail-list">
            {book.publisher && <li><strong>Penerbit:</strong> {book.publisher}</li>}
            {book.publication_year && <li><strong>Tahun Terbit:</strong> {book.publication_year}</li>}
            {book.isbn && <li><strong>ISBN:</strong> {book.isbn}</li>}
          </ul>
          
          <button className="btn-add-to-cart">
             Tambahkan ke Keranjang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar (Sama seperti Book.tsx) */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-brand">
            <BookOpen size={28} />
            <span style={{ marginLeft: 8 }}>BookStore</span>
          </a>
          <div className="nav-links">
             {/* ... (Link Dashboard, Books, Transactions) ... */}
          </div>
          <div className="nav-user">
             {/* ... (Info User, Theme Toggle, Logout) ... */}
          </div>
        </div>
      </nav>

      {/* Konten Halaman Detail */}
      <div className="books-container" style={{ paddingTop: 20 }}>
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Buku</span>
        </button>
        {content}
      </div>
    </div>
  );
}

export default BookDetail;