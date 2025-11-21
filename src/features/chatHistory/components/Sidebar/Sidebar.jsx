import { useState } from 'react';

export const Sidebar = ({ isOpen, onClose, sessions, currentSessionId, onSelectSession, loading }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Chat History</h3>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        {/* NEW CHAT BUTTON REMOVED */}

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
