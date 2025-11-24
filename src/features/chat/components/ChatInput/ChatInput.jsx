import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowUp,
  faCircleNotch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export const ChatInput = ({
  onSendMessage,
  isProcessing,
  selectedText,
  selectedTextUrl,
  selectedTextPageTitle,
  onClearSelectedText,
}) => {
  const [message, setMessage] = useState("");
const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewURL: URL.createObjectURL(file),
    }));

    const updated = [...attachments, ...newFiles];
    setAttachments(updated);

    e.target.value = "";
  };

  const removeAttachment = (id) => {
    const updated = attachments.filter((f) => f.id !== id);

    const removed = attachments.find((f) => f.id === id);
    if (removed) URL.revokeObjectURL(removed.previewURL);

    setAttachments(updated);
  };


  const handleSend = () => {
    if (isProcessing) return;
    if (!message.trim() && attachments.length === 0) return;

    const filesOnly = attachments.map((a) => a.file);

    onSendMessage(message, selectedText, selectedTextUrl, filesOnly);


    setMessage("");
    attachments.forEach((a) => URL.revokeObjectURL(a.previewURL));
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (selectedText) onClearSelectedText();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const previewText =
    selectedText?.length > 100
      ? selectedText.slice(0, 100) + "..."
      : selectedText;

  return (
    <div className="chat-input-container">
      {/* SELECTED TEXT PREVIEW */}
      {selectedText && (
        <div className="selected-text-preview">
          <div className="arrow">↳</div>
          <div className="preview-text">{previewText}</div>
          <button className="preview-close" onClick={onClearSelectedText}>
            ×
          </button>
        </div>
      )}

      {/* FILE PREVIEW LIST */}
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map((a) => (
            <div key={a.id} className="file-preview">
              <div className="file-info">
                <span className="file-name">{a.file.name}</span>
                <span className="file-size">
                  ({(a.file.size / 1024).toFixed(1)} KB)
                </span>
              </div>

              <button className="file-remove" onClick={() => removeAttachment(a.id)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <div className="chat-input-bar">
        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        {/* ATTACH BUTTON */}
        <button
          className="attach-icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          title="Attach files"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>

        {/* TEXTAREA */}
        <textarea
          ref={textareaRef}
          className="chat-input-textarea"
          placeholder="Ask me anything..."
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* SEND BUTTON */}
        <button
          className="send-icon"
          onClick={handleSend}
          disabled={(attachments.length === 0 && !message.trim()) || isProcessing}
        >
          {isProcessing ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : (
            <FontAwesomeIcon icon={faArrowUp} />
          )}
        </button>
      </div>
    </div>
  );
};
