import { useState } from 'react';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onClose, sessions, currentSessionId, onSelectSession, onNewSession, loading }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Chat Sessions</h3>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

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
