import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cwsms_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cwsms_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('cwsms_token', token);
    } else {
      localStorage.removeItem('cwsms_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cwsms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cwsms_user');
    }
  }, [user]);

  function setAuthHeaders(tokenValue) {
    api.defaults.headers.common.Authorization = tokenValue ? `Bearer ${tokenValue}` : '';
  }

  useEffect(() => {
    setAuthHeaders(token);
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    setToken(response.data.token);
    setLoading(false);
  };

  const register = async (payload) => {
    setLoading(true);
    const response = await api.post('/auth/register', payload);
    setUser(response.data.user);
    setToken(response.data.token);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
