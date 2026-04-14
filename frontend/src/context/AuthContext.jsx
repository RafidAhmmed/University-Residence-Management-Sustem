import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authApi';
import { userAPI } from '../api/userApi';

const AuthContext = createContext();

export { AuthContext };
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setToken(token);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const fetchUserProfile = async () => {
    try {
      if (user && user.id) {
        const response = await userAPI.getUser(user.id);
        const fullUserData = response.data;
        setUser(fullUserData);
        localStorage.setItem('user', JSON.stringify(fullUserData));
        return fullUserData;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    updateUser,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
