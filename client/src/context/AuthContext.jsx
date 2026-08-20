import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mcq_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mcq_user');
    if (savedUser && token) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        // Clear corrupt data
        localStorage.removeItem('mcq_token');
        localStorage.removeItem('mcq_user');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      const { token: userToken, user } = response.data;
      
      localStorage.setItem('mcq_token', userToken);
      localStorage.setItem('mcq_user', JSON.stringify(user));
      
      setToken(userToken);
      setCurrentUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  // Role-based registration helper
  const registerUser = async (name, email, password, role) => {
    try {
      const response = await api.auth.register({ name, email, password, role });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('mcq_token');
    localStorage.removeItem('mcq_user');
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, login, register: registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
