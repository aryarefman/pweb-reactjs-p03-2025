// src/context/AuthContext.tsx

import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';

// ... (Interface User dan AuthContextType Anda tetap sama) ...
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // <-- 1. TAMBAHKAN STATE LOADING

  useEffect(() => {
    try { // <-- Tambahkan try...finally untuk keamanan
      const token = apiService.getToken();
      const savedUser = apiService.getUser();

      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Gagal memuat sesi:", error);
      // Jika ada error, pastikan kita logout
      apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); 
    }
  }, []); 

  const login = async (email: string, password: string) => {
    const response = await apiService.login({ email, password });
    if (response.data) {
      setUser(response.data.user);
      setIsAuthenticated(true);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    await apiService.register({ username, email, password });
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };


  if (loading) {
    return <div>Loading application...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };