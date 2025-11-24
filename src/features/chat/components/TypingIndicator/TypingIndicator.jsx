import './TypingIndicator.css';

export const TypingIndicator = () => {
  return (
    <div className="message assistant">
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
};
