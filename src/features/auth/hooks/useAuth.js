import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/auth/identity`, {
        withCredentials: true,
      });
      
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        
        // Store user in chrome storage
        await chrome.storage.local.set({ 
          user: response.data,
          isAuthenticated: true 
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      await chrome.storage.local.remove(['user', 'isAuthenticated']);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle SSO login
  const handleLogin = () => {
    try {
      setIsLoading(true);
      // Redirect to SSO login in a new tab
      const loginUrl = `${API_BASE_URL}/sso/login`;
      chrome.tabs.create({ url: loginUrl });
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
      
      setUser(null);
      setIsAuthenticated(false);
      await chrome.storage.local.remove(['user', 'isAuthenticated']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check auth on mount and listen for storage changes
  useEffect(() => {
    checkAuth();

    // Listen for authentication success from callback
    const handleStorageChange = (changes) => {
      if (changes.isAuthenticated?.newValue) {
        checkAuth();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    handleLogin,
    handleLogout,
    checkAuth,
  };
};
