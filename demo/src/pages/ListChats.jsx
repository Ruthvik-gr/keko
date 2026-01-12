import { useState, useEffect } from 'react';

function ListChats() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const result = await response.json();
      setSessions(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`http://localhost:5000/api/conversations/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const result = await response.json();
      setMessages(result.data?.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    fetchMessages(session.sessionId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>!</div>
          <h2 style={styles.errorTitle}>Something went wrong</h2>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryButton} onClick={fetchSessions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Conversations</h2>
          <span style={styles.badge}>{sessions.length}</span>
        </div>

        {sessions.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <p style={styles.emptyText}>No conversations yet</p>
            <p style={styles.emptySubtext}>Start chatting to see conversations here</p>
          </div>
        ) : (
          <div style={styles.sessionList}>
            {sessions.map((session) => (
              <div
                key={session._id}
                style={{
                  ...styles.sessionItem,
                  ...(selectedSession?._id === session._id ? styles.sessionItemActive : {}),
                }}
                onClick={() => handleSelectSession(session)}
              >
                <div style={styles.sessionAvatar}>
                  {session.bookingData?.ownerName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={styles.sessionInfo}>
                  <div style={styles.sessionName}>
                    {session.bookingData?.ownerName || 'Anonymous User'}
                  </div>
                  <div style={styles.sessionPreview}>
                    {session.bookingData?.petName ? `Pet: ${session.bookingData.petName}` : `${session.messageCount} messages`}
                  </div>
                </div>
                <div style={styles.sessionMeta}>
                  <div style={styles.sessionTime}>{formatDate(session.lastActivityAt)}</div>
                  <div style={{
                    ...styles.statusPill,
                    backgroundColor: session.status === 'appointment_completed' ? '#dcfce7' :
                                    session.status === 'booking_in_progress' ? '#fef3c7' : '#e0e7ff',
                    color: session.status === 'appointment_completed' ? '#16a34a' :
                           session.status === 'booking_in_progress' ? '#d97706' : '#4f46e5',
                  }}>
                    {session.status === 'appointment_completed' ? 'Booked' :
                     session.status === 'booking_in_progress' ? 'In Progress' : 'Active'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.mainContent}>
        {selectedSession ? (
          <>
            <div style={styles.conversationHeader}>
              <div style={styles.conversationHeaderLeft}>
                <div style={styles.conversationAvatar}>
                  {selectedSession.bookingData?.ownerName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 style={styles.conversationTitle}>
                    {selectedSession.bookingData?.ownerName || 'Anonymous User'}
                  </h3>
                  <p style={styles.conversationSubtitle}>
                    {selectedSession.bookingData?.petName && `Pet: ${selectedSession.bookingData.petName}`}
                    {selectedSession.bookingData?.phoneNumber && ` | ${selectedSession.bookingData.phoneNumber}`}
                  </p>
                </div>
              </div>
              <div style={styles.conversationHeaderRight}>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: selectedSession.status === 'appointment_completed' ? '#dcfce7' :
                                  selectedSession.status === 'booking_in_progress' ? '#fef3c7' : '#e0e7ff',
                  color: selectedSession.status === 'appointment_completed' ? '#16a34a' :
                         selectedSession.status === 'booking_in_progress' ? '#d97706' : '#4f46e5',
                }}>
                  {selectedSession.status === 'appointment_completed' ? '✓ Booked' :
                   selectedSession.status === 'booking_in_progress' ? '⏳ In Progress' : '● Active'}
                </div>
              </div>
            </div>

            <div style={styles.conversationDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Session ID</span>
                <span style={styles.detailValue}>{selectedSession.sessionId.substring(0, 8)}...</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Created</span>
                <span style={styles.detailValue}>{formatFullDate(selectedSession.createdAt)}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Messages</span>
                <span style={styles.detailValue}>{selectedSession.messageCount}</span>
              </div>
              {selectedSession.bookingData?.preferredDate && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Appointment</span>
                  <span style={styles.detailValue}>
                    {selectedSession.bookingData.preferredDate} {selectedSession.bookingData.preferredTime}
                  </span>
                </div>
              )}
            </div>

            <div style={styles.messagesContainer}>
              {loadingMessages ? (
                <div style={styles.messagesLoading}>
                  <div style={styles.spinnerSmall}></div>
                  <span>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div style={styles.noMessages}>No messages found</div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.message,
                      ...(msg.role === 'user' ? styles.userMessage : styles.botMessage),
                    }}
                  >
                    <div style={styles.messageHeader}>
                      <span style={msg.role === 'user' ? styles.userLabel : styles.botLabel}>
                        {msg.role === 'user' ? 'User' : 'Assistant'}
                      </span>
                      <span style={styles.messageTime}>
                        {formatFullDate(msg.createdAt)}
                      </span>
                    </div>
                    <div style={styles.messageContent}>{msg.content}</div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div style={styles.noSelection}>
            <div style={styles.noSelectionIcon}>📋</div>
            <h3 style={styles.noSelectionTitle}>Select a conversation</h3>
            <p style={styles.noSelectionText}>
              Choose a conversation from the sidebar to view the messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 60px)',
    backgroundColor: '#f8fafc',
  },
  sidebar: {
    width: '380px',
    backgroundColor: 'white',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
  },
  badge: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  sessionList: {
    flex: 1,
    overflowY: 'auto',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 24px',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.2s',
  },
  sessionItemActive: {
    backgroundColor: '#f0f4ff',
    borderLeft: '3px solid #667eea',
  },
  sessionAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    marginRight: '16px',
    flexShrink: 0,
  },
  sessionInfo: {
    flex: 1,
    minWidth: 0,
  },
  sessionName: {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
    fontSize: '15px',
  },
  sessionPreview: {
    color: '#64748b',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sessionMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  sessionTime: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  statusPill: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
  },
  conversationHeader: {
    padding: '20px 32px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  conversationAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '600',
  },
  conversationTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  conversationSubtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#64748b',
  },
  conversationHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  conversationDetails: {
    display: 'flex',
    gap: '32px',
    padding: '16px 32px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#334155',
    fontFamily: 'monospace',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messagesLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '40px',
    color: '#64748b',
  },
  noMessages: {
    textAlign: 'center',
    padding: '40px',
    color: '#94a3b8',
  },
  message: {
    padding: '16px 20px',
    borderRadius: '12px',
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#667eea',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
  },
  botMessage: {
    backgroundColor: 'white',
    color: '#1e293b',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '12px',
  },
  userLabel: {
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  botLabel: {
    fontWeight: '600',
    color: '#64748b',
  },
  messageTime: {
    opacity: 0.7,
    fontSize: '11px',
  },
  messageContent: {
    lineHeight: '1.6',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
  },
  noSelection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
  },
  noSelectionIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  noSelectionTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: '#334155',
    fontWeight: '600',
  },
  noSelectionText: {
    margin: 0,
    fontSize: '14px',
    color: '#94a3b8',
  },
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  spinnerSmall: {
    width: '24px',
    height: '24px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  errorIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  errorTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: '#dc2626',
  },
  errorText: {
    margin: '0 0 24px 0',
    color: '#64748b',
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    color: '#334155',
    fontWeight: '600',
  },
  emptySubtext: {
    margin: 0,
    fontSize: '14px',
    color: '#94a3b8',
  },
};

export default ListChats;
