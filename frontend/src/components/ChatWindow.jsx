import { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { sendMessage, createAppointment } from '../services/api';
import { saveSessionId, getSessionId, generateUUID, clearSessionId } from '../utils/storage';

const ChatWindow = ({ isOpen, onClose, onMinimize, config }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const initSession = () => {
      let sid = getSessionId();
      if (!sid) {
        sid = generateUUID();
        saveSessionId(sid);
      }
      setSessionId(sid);

      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your veterinary assistant. I can help answer questions about pet care or book an appointment for you. How can I assist you today?',
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    if (isOpen && !sessionId) {
      initSession();
    }
  }, [isOpen, sessionId]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !sessionId) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const isConfirmation = messageText.toLowerCase() === 'confirm';

      if (isConfirmation && bookingData) {
        const appointmentResponse = await createAppointment(sessionId, bookingData);

        const assistantMessage = {
          role: 'assistant',
          content: appointmentResponse.data
            ? 'Your appointment has been successfully booked! We\'ll contact you shortly to confirm. Thank you for choosing our veterinary service!'
            : 'Your appointment has been booked successfully! We\'ll be in touch soon.',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setBookingData(null);

        clearSessionId();
        setSessionId(null);
      } else {
        const response = await sendMessage(messageText, sessionId, config || null);

        if (response.success) {
          const assistantMessage = {
            role: 'assistant',
            content: response.data.message,
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);

          if (response.data.bookingData) {
            setBookingData(response.data.bookingData);
          }
        } else {
          throw new Error('Failed to get response');
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Sorry, something went wrong. Please try again.');

      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '24px',
        width: '400px',
        height: '680px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2147483646,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <ChatHeader onClose={onClose} onMinimize={onMinimize} />
      <MessageList messages={messages} isLoading={isLoading} />
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fee',
          color: '#c00',
          fontSize: '13px',
          borderTop: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;
