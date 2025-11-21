import { useState } from 'react';

export const Sidebar = ({ isOpen, onClose, sessions, currentSessionId, onSelectSession, onNewSession, loading }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Chat Sessions</h3>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        <button className="new-chat-button" onClick={onNewSession}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>

        <div className="sidebar-sessions">
          {loading ? (
            <div className="loading-sessions">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="no-sessions">No chat history yet</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="session-title">{session.title}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
