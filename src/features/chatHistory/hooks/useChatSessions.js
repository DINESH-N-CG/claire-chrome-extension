import { useState, useEffect } from 'react';
import { CONFIG } from '../../../shared/config';

const safeChrome = typeof chrome !== 'undefined' && chrome?.storage?.local;

export const useChatSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);

    try {
      // Get current project ID from storage
      let projectId = 1; // default
      if (safeChrome) {
        const stored = await chrome.storage.local.get(['currentProjectId']);
        projectId = stored.currentProjectId || 1;
      }

      const response = await fetch(`${CONFIG.CHAT_HISTORY_API}/all/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          projectId: projectId,
          limit: 50,
          offset: 0
        })
      });

      let transformedSessions = [];

      if (response.ok) {
        const data = await response.json();
        
        console.log('Loaded sessions:', data); // Debug log

        transformedSessions = data.rows.map((session) => {
          const msg = session.message || '';
          return {
            id: session.session,
            title: msg.length > 50 ? msg.substring(0, 50) + '...' : msg || 'Untitled Chat',
            date: new Date(session.createdAt).toLocaleDateString(),
          timestamp: new Date(session.createdAt).getTime()
        };
      });
      } else {
        console.error('Failed to load sessions:', response.status, response.statusText);
      }

      // Set sessions in UI
      setSessions(transformedSessions);
      console.log('Sessions set:', transformedSessions); // Debug log

      // Load current session from chrome.storage
      if (safeChrome) {
        const stored = await chrome.storage.local.get(['currentSessionId']);
        if (stored.currentSessionId) {
          setCurrentSessionId(stored.currentSessionId);
        }
      }

    } catch (error) {
      console.error('Error loading sessions:', error);

      // fallback to local chrome storage
      if (safeChrome) {
        const data = await chrome.storage.local.get(['chatSessions', 'currentSessionId']);
        if (data.chatSessions) setSessions(data.chatSessions);
        if (data.currentSessionId) setCurrentSessionId(data.currentSessionId);
      }
    }

    setLoading(false);
  };

  // Load a specific session chat history
  const loadSession = async (sessionId) => {
    try {
      // Get current project ID from storage
      let projectId = 1; // default
      if (safeChrome) {
        const stored = await chrome.storage.local.get(['currentProjectId']);
        projectId = stored.currentProjectId || 1;
      }

      const response = await fetch(
        `${CONFIG.CHAT_HISTORY_API}/session/${sessionId}?projectId=${projectId}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (response.ok) {
        const messages = await response.json();

        const transformedHistory = messages.map((msg) => ({
          text: msg.message || '',
          sender: msg.role?.toLowerCase() === 'user' ? 'user' : 'assistant',
          isHtml: false,
          isError: false
        }));

        setCurrentSessionId(sessionId);

        if (safeChrome) {
          await chrome.storage.local.set({ currentSessionId: sessionId });
        }

        return transformedHistory;
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
    return null;
  };

  const createNewSession = async () => {
    let newSessionId =
      crypto?.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    setCurrentSessionId(newSessionId);

    if (safeChrome) {
      await chrome.storage.local.set({ currentSessionId: newSessionId });
    }

    return newSessionId;
  };

  const refreshSessions = () => loadSessions();

  return {
    sessions,
    currentSessionId,
    loading,
    loadSession,
    createNewSession,
    refreshSessions
  };
};
