import dotenv from 'dotenv';
dotenv.config();  // ← HARUS DI SINI, SEBELUM IMPORT LAINNYA!

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';
import genreRoutes from './routes/genre.routes';
import transactionRoutes from './routes/transaction.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware - HARUS SEBELUM routes!
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to IT Literature Shop API'
  });
});

app.get('/health-check', (req, res) => {
  const currentDate = new Date().toDateString();
  res.status(200).json({
    success: true,
    message: 'Hello World!',
    date: currentDate
  });
});

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/genre', genreRoutes);
app.use('/transactions', transactionRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});