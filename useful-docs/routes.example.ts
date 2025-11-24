/**
 * Route Usage Examples
 * This file demonstrates how to use the centralized routes configuration
 * Only includes routes actually used by the Claire Chrome Extension
 */

import {
  API_ROUTES,
  EXTENSION_ROUTES,
  getApiUrl,
  getExtensionUrl,
} from '../src/routes';

// ==================== Basic Usage ====================

// 1. Get simple API URL
const chatUrl = getApiUrl(API_ROUTES.CHAT.BASE);
// Result: 'http://localhost:8080/chat'

const loginUrl = getApiUrl(API_ROUTES.SSO.LOGIN);
// Result: 'http://localhost:8080/sso/login'

// 2. Get extension URL
const sidepanelUrl = getExtensionUrl(EXTENSION_ROUTES.SIDEPANEL);
// Result: 'chrome-extension://<id>/sidepanel.html'

const authCallbackUrl = getExtensionUrl(EXTENSION_ROUTES.AUTH_CALLBACK);
// Result: 'chrome-extension://<id>/auth-callback.html'

// ==================== Real-World Examples ====================

// Example 1: Check authentication
async function checkAuthentication() {
  const url = getApiUrl(API_ROUTES.AUTH.IDENTITY);
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

// Example 2: Logout user
async function logoutUser() {
  const url = getApiUrl(API_ROUTES.AUTH.LOGOUT);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
  return response.json();
}

// Example 3: Get all projects
async function fetchAllProjects() {
  const url = getApiUrl(API_ROUTES.PROJECT.ALL);
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

// Example 4: Send chat message
async function sendMessage(message: string, projectId: string) {
  const url = getApiUrl(API_ROUTES.CHAT.BASE);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      projectId,
    }),
  });
  return response.json();
}

// Example 5: Get chat history
async function fetchChatHistory(sessionId?: string) {
  let url = getApiUrl(API_ROUTES.DEV.CHAT_HISTORY);
  if (sessionId) {
    url += `?sessionId=${sessionId}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// ==================== Using Enhanced API Client ====================

import { api } from '../src/shared/api/apiClient';

// Example 6: Using the API client (preferred method)
async function exampleUsingApiClient() {
  // Authentication
  const identity = await api.auth.checkIdentity();
  const ssoUrl = api.auth.getSsoLoginUrl();
  await api.auth.logout();

  // Projects
  const projects = await api.project.getAll();

  // Chat
  await api.chat.send('Hello AI!', 'project-123', []);
  const history = await api.chat.getHistory(); // or pass sessionId if available
}

// ==================== React Hook Examples ====================

import { useState, useEffect } from 'react';

// Example 7: Custom hook for API calls
function useProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await api.project.getAll();
        setProjects(response.data);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

// Example 8: Custom hook for chat
function useChatSend() {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendChatMessage = async (message: string, projectId: string) => {
    try {
      setIsProcessing(true);
      const response = await api.chat.send(message, projectId);
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { sendChatMessage, isProcessing };
}

// ==================== Component Helper Functions ====================

// Example 9: Login handler
function handleLogin() {
  const loginUrl = api.auth.getSsoLoginUrl();
  chrome.tabs.create({ url: loginUrl });
}

// Example 10: Project loading helper
async function loadProjectsForDropdown() {
  const response = await api.project.getAll();
  const projects = response.data.rows || response.data || [];
  return projects;
}

export {
  checkAuthentication,
  logoutUser,
  fetchAllProjects,
  sendMessage,
  fetchChatHistory,
  exampleUsingApiClient,
  useProjectList,
  useChatSend,
  handleLogin,
  loadProjectsForDropdown,
};
