/* eslint-disable @typescript-eslint/no-unused-vars */
const BASE_URL = 'http://localhost:3000'; 

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
    };
    token: string;
  };
}

export interface BookStats {
  totalBooks: number;
  inStock: number;
  genres: number;
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      const token = result.data?.access_token;

      if (token) {
        localStorage.setItem('token', token);

        const userData = parseJwt(token); 
        
        const user = {
          id: userData.id,
          email: userData.email,
          username: userData.username || 'User' 
        };
        localStorage.setItem('user', JSON.stringify(user));

        return {
          ...result,
          data: {
            user: user,
            token: token
          }
        };
      } else {
        throw new Error('Login response missing token');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private _getAuthHeaders(): HeadersInit {
    const token = this.getToken(); 
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get(endpoint: string) {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'GET',
        headers: this._getAuthHeaders(), 
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          this.logout();
          window.location.reload();
        }
        throw new Error(result.message || 'Failed to fetch data');
      }
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getBookStats(): Promise<BookStats> {
    const result = await this.get('books/stats');
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch book stats');
    }
    return result.data;
  }
}

export const apiService = new ApiService();