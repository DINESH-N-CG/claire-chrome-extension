/**
 * Core application constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    CHAT: '/chat',
    CHAT_HISTORY: '/dev/chat-history',
    PROJECT: '/project',
    AUTH_IDENTITY: '/auth/identity',
    AUTH_LOGOUT: '/auth/logout',
    SSO_LOGIN: '/sso/login',
  },
} as const;

// Timing Constants
export const TIMING = {
  TEXT_FRESHNESS_TIMEOUT: 10000, // 10 seconds
  INACTIVITY_TIMEOUT: 30000, // 30 seconds
  AUTH_REDIRECT_DELAY: 2000, // 2 seconds
  ERROR_REDIRECT_DELAY: 3000, // 3 seconds
} as const;

// UI Constants
export const UI = {
  MAX_INPUT_HEIGHT: 150,
  MESSAGE_MAX_WIDTH: '65%',
  INPUT_WIDTH: 'calc(100% - 40px)',
  MAX_INPUT_WIDTH: '800px',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  IS_AUTHENTICATED: 'isAuthenticated',
  SELECTED_TEXT: 'selectedText',
  SELECTED_TEXT_URL: 'selectedTextUrl',
  SELECTED_TEXT_PAGE_TITLE: 'selectedTextPageTitle',
  CONTEXT: 'context',
  LAST_ACTIVITY_TIME: 'lastActivityTime',
  FORCE_NEW_CONVERSATION: 'forceNewConversation',
  CURRENT_PROJECT_ID: 'currentProjectId',
} as const;

// Message Types
export const MESSAGE_TYPES = {
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  UPDATE_SELECTED_TEXT: 'UPDATE_SELECTED_TEXT',
  OPEN_SIDE_PANEL: 'OPEN_SIDE_PANEL',
  CLOSE_SIDE_PANEL: 'CLOSE_SIDE_PANEL',
  PING: 'PING',
} as const;
