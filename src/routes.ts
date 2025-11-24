/**
 * Centralized route/path configuration
 * Provides type-safe path constants throughout the application
 */

// Base API URL Configuration - Vite uses hardcoded value, runtime uses env variable from shared/config.js
export const API_BASE_URL = 'http://localhost:8080';

// Extension Internal Routes
export const EXTENSION_ROUTES = {
  SIDEPANEL: '/sidepanel.html',
  AUTH_CALLBACK: '/auth-callback.html',
} as const;

// API Route Configuration (only routes actually used by the extension)
export const API_ROUTES = {
  // Authentication & Authorization
  SSO: {
    LOGIN: '/sso/login',
  },
  
  AUTH: {
    IDENTITY: '/auth/identity',
    LOGOUT: '/auth/logout',
  },

  // Project Management
  PROJECT: {
    BASE: '/project',
    ALL: '/project/all',
  },

  // Chat Routes
  CHAT: {
    BASE: '/chat',
  },

  // Development Routes (Chat History)
  DEV: {
    CHAT_HISTORY: '/dev/chat-history',
  },
} as const;

/**
 * Helper to construct full API URLs
 * @param path - API path (use API_ROUTES constants)
 * @param baseUrl - Base API URL (defaults to API_BASE_URL)
 * @returns Full API URL
 */
export const getApiUrl = (path: string, baseUrl: string = API_BASE_URL): string => {
  return `${baseUrl}${path}`;
};

/**
 * Helper to construct extension URLs
 * @param path - Extension path (use EXTENSION_ROUTES constants)
 * @returns Full extension URL
 */
export const getExtensionUrl = (path: string): string => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return chrome.runtime.getURL(path);
  }
  return path;
};

/**
 * Helper to replace route parameters with actual values
 * @param path - Route path with parameters (e.g., '/project/:id')
 * @param params - Object with parameter values (e.g., { id: '123' })
 * @returns Path with parameters replaced
 * @example
 * buildPath('/project/:id', { id: '123' }) // '/project/123'
 */
export const buildPath = (path: string, params: Record<string, string | number>): string => {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

/**
 * Helper to build full API URL with parameters
 * @param path - Route path with parameters
 * @param params - Object with parameter values
 * @param baseUrl - Base API URL
 * @returns Full API URL with parameters replaced
 * @example
 * buildApiUrl('/project/:id', { id: '123' }) // 'http://localhost:8080/project/123'
 */
export const buildApiUrl = (
  path: string, 
  params?: Record<string, string | number>, 
  baseUrl: string = API_BASE_URL
): string => {
  const finalPath = params ? buildPath(path, params) : path;
  return getApiUrl(finalPath, baseUrl);
};

/**
 * Export all routes for easy access
 */
export default {
  API_BASE_URL,
  EXTENSION_ROUTES,
  API_ROUTES,
  getApiUrl,
  getExtensionUrl,
  buildPath,
  buildApiUrl,
};
