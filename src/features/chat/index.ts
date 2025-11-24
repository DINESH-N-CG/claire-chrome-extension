/**
 * Chat feature barrel export
 * Exports all chat-related components and hooks
 */

// Components
export { ChatMessages } from './components/ChatMessages/ChatMessages';
export { ChatInput } from './components/ChatInput/ChatInput';
export { Message } from './components/Message/Message';
export { TypingIndicator } from './components/TypingIndicator/TypingIndicator';
export { InactivityNotice } from './components/InactivityNotice/InactivityNotice';

// Hooks
export { useChat } from './hooks/useChat';
export { useSelectedText } from './hooks/useSelectedText';
