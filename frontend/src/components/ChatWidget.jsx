import { useState } from 'react';
import ChatWindow from './ChatWindow';

const ChatWidget = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        onClose={toggleChat}
        onMinimize={handleMinimize}
        config={config}
      />

      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          backgroundColor: isOpen ? '#ef4444' : '#0ea5e9',
          color: 'white',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(14, 165, 233, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 2147483647,
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = isOpen ? '#dc2626' : '#0284c7';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4), 0 0 0 6px rgba(14, 165, 233, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = isOpen ? '#ef4444' : '#0ea5e9';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(14, 165, 233, 0.2)';
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg
            style={{ width: '28px', height: '28px' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            style={{ width: '32px', height: '32px' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}

        {!isOpen && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '16px',
              height: '16px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          ></span>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
