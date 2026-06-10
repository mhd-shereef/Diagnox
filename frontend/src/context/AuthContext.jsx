import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('diagnox_token');
    const storedUser = localStorage.getItem('diagnox_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Validate token in background
      axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).then(res => {
        setUser(res.data.user);
        localStorage.setItem('diagnox_user', JSON.stringify(res.data.user));
      }).catch(() => {
        // Token expired or invalid
        setUser(null);
        setToken(null);
        localStorage.removeItem('diagnox_token');
        localStorage.removeItem('diagnox_user');
      });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('diagnox_token', newToken);
    localStorage.setItem('diagnox_user', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('diagnox_token');
    localStorage.removeItem('diagnox_user');
    sessionStorage.clear();
  }, []);

  const register = useCallback(async (userData) => {
    const res = await axios.post(`${API_URL}/auth/register`, {
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      dob: userData.dob || '',
      gender: userData.gender || '',
    });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('diagnox_token', newToken);
    localStorage.setItem('diagnox_user', JSON.stringify(newUser));
    return newUser;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('diagnox_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch {
      // Fallback to local update if backend fails
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('diagnox_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ 
      user, token, login, logout, register, updateProfile, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
