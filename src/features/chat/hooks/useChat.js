import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../../../shared/config';

export const useChat = () => {
  const [session, setSession] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('Ready to help');
  const [greetingVisible, setGreetingVisible] = useState(false);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    // Reset chat after panel was closed
    const flags = await chrome.storage.local.get(['forceNewConversation']);
    
    if (flags.forceNewConversation) {
      await chrome.storage.local.remove(['forceNewConversation']);
      await chrome.storage.local.remove(['chatHistory']);
      setConversationHistory([]);
    }

    const stored = await chrome.storage.local.get(['claireSession']);
    const newSession = stored.claireSession || crypto.randomUUID();
    setSession(newSession);
    await chrome.storage.local.set({ claireSession: newSession });

    // Load chat history
    const historyData = await chrome.storage.local.get(['chatHistory']);
    if (historyData.chatHistory) {
      setConversationHistory(historyData.chatHistory);
    } else {
      setGreetingVisible(true);
    }
  };

  const addMessage = useCallback((text, sender, isError = false, isHtml = false) => {
    const newMessage = { text, sender, isHtml, isError };
    setConversationHistory(prev => [...prev, newMessage]);
    setGreetingVisible(false);
  }, []);

  const sendMessage = async (message, selectedText = '', selectedTextUrl = '', attachedFile = null) => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);
    setStatus('Thinking...');

    // Display user message with context if selected text exists
    let displayMessage = message;
    let hasContext = false;
    if (selectedText) {
      const truncatedContext = selectedText.length > 200 
        ? selectedText.substring(0, 200) + '...' 
        : selectedText;
      displayMessage = `<div class="message-with-context">
        <div class="context-text">${truncatedContext.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <div class="user-question">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>`;
      hasContext = true;
    }
    
    addMessage(displayMessage, 'user', false, hasContext);

    // Prepare message with full context for API
    const msgToSend = selectedText
      ? `Context: "${selectedText}"\n\nQuestion: ${message}`
      : message;

    try {
      const response = await sendToAI(msgToSend, session, selectedTextUrl, attachedFile);
      addMessage(response, 'assistant');
    } catch (error) {
      addMessage('Error occurred.', 'assistant', true);
    }

    setIsProcessing(false);
    setStatus('Ready to help');
  };

  const sendToAI = async (text, sessionId, selectedTextUrl = '', attachedFile = null) => {
    // Get current project ID from storage
    const safeChrome = typeof chrome !== 'undefined' && chrome?.storage?.local;
    let projectId = 1; // default
    if (safeChrome) {
      const stored = await chrome.storage.local.get(['currentProjectId']);
      projectId = stored.currentProjectId || 1;
    }

    const response = await fetch(CONFIG.CLAIRE_CONTROLLER_SERVER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        projectId: projectId,
        session: sessionId,
        message: text,
        url: selectedTextUrl || undefined,
        file: attachedFile ? {
          name: attachedFile.name,
          size: attachedFile.size,
          type: attachedFile.type
        } : undefined
      })
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    return data.response || data.message || data.text || data.content;
  };

  const refreshChat = async () => {
    if (isProcessing) return;

    // Clear chat history
    setConversationHistory([]);
    await chrome.storage.local.remove(['chatHistory']);

    // Generate new session
    const newSession = crypto.randomUUID();
    setSession(newSession);
    await chrome.storage.local.set({ claireSession: newSession });

    // Show greeting
    setGreetingVisible(true);
    setStatus('Ready to help');
  };

  const loadHistory = (history) => {
    setConversationHistory(history);
    setGreetingVisible(false);
  };

  // Save history whenever it changes
  useEffect(() => {
    if (conversationHistory.length > 0) {
      chrome.storage.local.set({
        chatHistory: conversationHistory.slice(-50)
      });
    }
  }, [conversationHistory]);

  return {
    conversationHistory,
    isProcessing,
    status,
    greetingVisible,
    sendMessage,
    refreshChat,
    loadHistory
  };
};
