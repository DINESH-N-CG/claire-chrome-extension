import { useRef, useEffect } from 'react';
import { Message } from '../Message/Message';
import { WelcomeGreeting } from '../../../welcome';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import './ChatMessages.css';

export const ChatMessages = ({ messages, greetingVisible, isProcessing }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const hasContent = messages.length > 0 || !greetingVisible;

  return (
    <div className={`chat-messages ${hasContent ? 'has-content' : ''}`}>
      {greetingVisible && messages.length === 0 ? (
        <WelcomeGreeting />
      ) : (
        <>
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          {isProcessing && <TypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
