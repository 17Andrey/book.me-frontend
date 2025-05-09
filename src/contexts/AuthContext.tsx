import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  phone: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 часа

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const tokenReceivedAt = localStorage.getItem('tokenReceivedAt');
    if (token && userData && tokenReceivedAt) {
      const receivedAt = parseInt(tokenReceivedAt, 10);
      const now = Date.now();
      if (isNaN(receivedAt) || now - receivedAt > TOKEN_LIFETIME_MS) {
        // Токен просрочен
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenReceivedAt');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenReceivedAt');
      }
    }

    // Слушаем событие logout для глобального выхода (например, при 401)
    const handleLogout = () => logout();
    window.addEventListener('logout', handleLogout);
    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokenReceivedAt', Date.now().toString());
    setUser(userData);
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenReceivedAt');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};