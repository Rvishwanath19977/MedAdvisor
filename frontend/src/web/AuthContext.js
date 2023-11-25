// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, getUserDetails, register } from './apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      await fetchUserDetails();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRegister = async (username, email, password, role) => {
    try {
      await register(username, email, password, role);
      await fetchUserDetails();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const fetchUserDetails = async () => {
    try {
      const data = await getUserDetails();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleRegister, fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
