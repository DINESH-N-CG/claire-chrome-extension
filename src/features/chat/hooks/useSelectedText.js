import { useState, useEffect } from 'react';
import { CONFIG } from '../../../shared/config';

export const useSelectedText = () => {
  const [selectedText, setSelectedText] = useState('');
  const [selectedTextUrl, setSelectedTextUrl] = useState('');
  const [selectedTextPageTitle, setSelectedTextPageTitle] = useState('');

  useEffect(() => {
    // Check for selected text on mount
    chrome.storage.local.get(['selectedText', 'selectedTextUrl', 'selectedTextPageTitle', 'timestamp'], (result) => {
      if (!result.selectedText) return;

      if (Date.now() - result.timestamp < CONFIG.TEXT_FRESHNESS_TIMEOUT) {
        setSelectedText(result.selectedText);
        setSelectedTextUrl(result.selectedTextUrl || '');
        setSelectedTextPageTitle(result.selectedTextPageTitle || '');
      }

      chrome.storage.local.remove(['selectedText', 'selectedTextUrl', 'selectedTextPageTitle', 'timestamp']);
    });

    // Listen for live text updates from background
    const messageListener = (msg) => {
      if (msg.type === 'UPDATE_SELECTED_TEXT') {
        setSelectedText(msg.text);
        setSelectedTextUrl(msg.url || '');
        setSelectedTextPageTitle(msg.pageTitle || '');
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const clearSelectedText = () => {
    setSelectedText('');
    setSelectedTextUrl('');
    setSelectedTextPageTitle('');
  };

  return {
    selectedText,
    selectedTextUrl,
    selectedTextPageTitle,
    clearSelectedText
  };
};
