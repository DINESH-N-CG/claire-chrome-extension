import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export const LoginPage = () => {
  const { handleLogin, isLoading } = useAuth();

  useEffect(() => {
    // Add subtle animation on mount
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src="/claire-logo.svg" alt="Claire AI" />
        </div>
        
        <h1 className="login-title">Welcome to Claire</h1>
        <p className="login-subtitle">Your intelligent AI assistant</p>

        <button 
          className="login-button" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="login-spinner"></span>
              Connecting...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
              </svg>
              Sign in with SSO
            </>
          )}
        </button>

        <p className="login-footer">
          Secure authentication powered by SSO
        </p>
      </div>
    </div>
  );
};
