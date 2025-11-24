/**
 * Custom React hooks used across the application
 * Re-exported from their respective feature modules for convenience
 */

// Export hooks from features
export { useAuth } from '../features/auth/useAuth';
export { useChat, useSelectedText } from '../features/chat/hooks';
export { useChatSessions } from '../features/chatHistory/useChatSessions';
export { useProjects } from '../features/projects/useProjects';
export { useInactivity } from '../shared/hooks/useInactivity';
