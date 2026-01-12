const Message = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '14px 18px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          backgroundColor: isUser ? '#667eea' : 'white',
          color: isUser ? 'white' : '#1a1a1a',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          fontSize: '15px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.content}
      </div>
    </div>
  );
};

export default Message;
