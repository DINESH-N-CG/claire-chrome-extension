/**
 * Core utility helper functions
 */

/**
 * Format text by escaping HTML characters
 */
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/</g, '&gt;')
    .replace(/\n/g, '<br>');
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Format file size in KB
 */
export const formatFileSize = (bytes: number): string => {
  return `${(bytes / 1024).toFixed(1)} KB`;
};

/**
 * Check if a URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay) as unknown as number;
  };
};

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if running in Chrome extension context
 */
export const isExtensionContext = (): boolean => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id !== undefined;
};
