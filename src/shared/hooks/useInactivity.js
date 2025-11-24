import { useState, useEffect, useCallback } from 'react';

export const useInactivity = (timeoutMinutes = 5) => {
  const [isInactive, setIsInactive] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  const resetActivity = useCallback(() => {
    setIsInactive(false);
    setLastActivityTime(Date.now());
    
    // Send activity update to background script
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'USER_ACTIVITY' }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Track user activity
    const handleActivity = () => {
      resetActivity();
    };

    // Send initial activity signal
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'USER_ACTIVITY' }).catch(() => {});
    }

    // Listen for user interactions
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [resetActivity]);

  useEffect(() => {
    const checkInactivity = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityTime;
      const inactiveThreshold = timeoutMinutes * 60 * 1000;

      if (timeSinceActivity >= inactiveThreshold && !isInactive) {
        setIsInactive(true);
      }
    }, 1000); // Check every second

    return () => clearInterval(checkInactivity);
  }, [lastActivityTime, timeoutMinutes, isInactive]);

  return { isInactive, resetActivity };
};
