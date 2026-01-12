import { useEffect, useRef } from 'react';
import Message from './Message';

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f7f7f8',
      }}
    >
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '18px 18px 18px 4px',
              padding: '16px 20px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#a0a0a0', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }}></span>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#a0a0a0', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }}></span>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#a0a0a0', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out 0.4s infinite' }}></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
