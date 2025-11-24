import axios from 'axios';
import { API_BASE_URL, API_ROUTES } from '../../routes';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - trigger re-authentication
      chrome.storage.local.remove(['user', 'isAuthenticated']);
    }
    return Promise.reject(error);
  }
);

// ==================== API Methods (Only routes actually used) ====================

/**
 * Authentication APIs
 */
export const authApi = {
  checkIdentity: () => apiClient.get(API_ROUTES.AUTH.IDENTITY),
  logout: () => apiClient.post(API_ROUTES.AUTH.LOGOUT),
  getSsoLoginUrl: () => `${API_BASE_URL}${API_ROUTES.SSO.LOGIN}`,
};

/**
 * Project APIs
 */
export const projectApi = {
  getAll: () => apiClient.get(API_ROUTES.PROJECT.ALL),
};

/**
 * Chat APIs
 */
export const chatApi = {
  send: (message, projectId, attachments = []) => 
    apiClient.post(API_ROUTES.CHAT.BASE, {
      message,
      projectId,
      attachments,
    }),
  getHistory: (sessionId = null) => {
    const url = sessionId 
      ? `${API_ROUTES.DEV.CHAT_HISTORY}?sessionId=${sessionId}`
      : API_ROUTES.DEV.CHAT_HISTORY;
    return apiClient.get(url);
  },
};

// Export default client and all API methods
export default apiClient;

// Export all APIs for convenience
export const api = {
  auth: authApi,
  project: projectApi,
  chat: chatApi,
};
