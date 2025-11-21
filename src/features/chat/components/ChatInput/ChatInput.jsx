import { useState, useRef, useEffect } from 'react';

export const ChatInput = ({ onSendMessage, isProcessing, selectedText, selectedTextUrl, selectedTextPageTitle, onClearSelectedText }) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 100); // Max 100px
      textarea.style.height = newHeight + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if ((!message.trim() && !attachedFile) || isProcessing) return;
    onSendMessage(message, selectedText, selectedTextUrl, attachedFile);
    setMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    // Clear selected text after sending
    if (selectedText) {
      onClearSelectedText();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const previewText = selectedText.length > 100 
    ? selectedText.slice(0, 100) + '...' 
    : selectedText;

  return (
    <div className="chat-input-container">
      {selectedText && (
        <div className="selected-text-preview">
          <div className="arrow">↳</div>
          <div className="preview-text">{previewText}</div>
          <button className="preview-close" onClick={onClearSelectedText}>×</button>
        </div>
      )}

      {attachedFile && (
        <div className="file-preview">
          <div className="file-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <span className="file-name">{attachedFile.name}</span>
            <span className="file-size">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button className="file-remove" onClick={handleRemoveFile}>×</button>
        </div>
      )}

      <div className="chat-input-wrapper">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <button
          className="attach-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          title="Attach file"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
        </button>
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask me anything..."
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="send-button"
          onClick={handleSend}
          disabled={(!message.trim() && !attachedFile) || isProcessing}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
