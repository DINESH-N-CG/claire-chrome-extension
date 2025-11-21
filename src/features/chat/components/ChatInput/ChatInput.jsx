import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowUp, faSpinner } from '@fortawesome/free-solid-svg-icons';

export const ChatInput = ({
  onSendMessage,
  isProcessing,
  selectedText,
  selectedTextUrl,
  selectedTextPageTitle,
  onClearSelectedText
}) => {

  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 100);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if ((!message.trim() && !attachedFile) || isProcessing) return;

    onSendMessage(message, selectedText, selectedTextUrl, attachedFile);

    setMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    if (selectedText) onClearSelectedText();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const previewText = selectedText?.length > 100
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
            <FontAwesomeIcon icon={faPlus} />
            <span className="file-name">{attachedFile.name}</span>
            <span className="file-size">
              ({(attachedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button className="file-remove" onClick={handleRemoveFile}>×</button>
        </div>
      )}

      {/* NEW INPUT BAR DESIGN */}
      <div className="chat-input-bar">

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        {/* Attach Icon */}
        <button
          className="attach-icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          title="Attach file"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          className="chat-input-textarea"
          placeholder="Ask me anything..."
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Send Icon (spinner when sending) */}
        <button
          className="send-icon"
          onClick={handleSend}
          disabled={(!message.trim() && !attachedFile) || isProcessing}
        >
          {isProcessing ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FontAwesomeIcon icon={faArrowUp} />
          )}
        </button>
      </div>
    </div>
  );
};
