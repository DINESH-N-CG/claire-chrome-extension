import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import './ChatInput.css';
import './FileUpload.css';

export const ChatInput = ({ onSendMessage, isProcessing, selectedText, selectedTextUrl, selectedTextPageTitle, onClearSelectedText }) => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
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
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if ((!message.trim() && attachedFiles.length === 0) || isProcessing) return;
    onSendMessage(message, selectedText, selectedTextUrl, attachedFiles);
    setMessage('');
    setAttachedFiles([]);
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

      {attachedFiles.length > 0 && (
        <div className="attachments-preview">
          {attachedFiles.map((file, index) => (
            <div key={index} className="attachment-item">
              <div className="attachment-preview">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="preview-img"
                  />
                ) : (
                  <FontAwesomeIcon icon={faImage} />
                )}
              </div>
              <div className="attachment-meta">
                <span className="name">{file.name}</span>
              </div>
              <button
                type="button"
                className="remove-attachment"
                aria-label={`Remove ${file.name}`}
                onClick={() => handleRemoveFile(index)}
              >
                <FontAwesomeIcon icon={faTimes} style={{ color: '#333333' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="top-row">
        <div className="left-controls">
          <button
            type="button"
            className="icon-button plus-button"
            aria-label="Add attachment"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,image/*"
            multiple
          />
        </div>

        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder="Ask me anything"
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={adjustHeight}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
        </div>

        <div className="right-controls">
          <button
            className="send-button"
            onClick={handleSend}
            disabled={(!message.trim() && attachedFiles.length === 0) || isProcessing}
            aria-label="Send message"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
