import './Message.css';

export const Message = ({ message }) => {
  const formatText = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
  };

  const content = message.isHtml 
    ? message.text 
    : formatText(message.text);

  return (
    <div className={`message ${message.sender}`}>
      <div 
        className="message-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
