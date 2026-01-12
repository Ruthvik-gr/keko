import { useEffect } from 'react';

function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:5000/sdk/vet-chatbot.iife.js';
    script.async = true;
    script.onload = () => {
      if (window.VetChatbot) {
        window.VetChatbot.init({
          apiUrl: 'http://localhost:5000/api',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const container = document.getElementById('vet-chatbot-container');
      if (container) {
        container.remove();
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Veterinary Chatbot SDK</h1>
          <p style={styles.subtitle}>
            AI-powered conversational assistant for veterinary clinics.
            Book appointments, answer pet care questions, and more.
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🤖</span>
              <span>AI-Powered</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📅</span>
              <span>Appointment Booking</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>💬</span>
              <span>Real-time Chat</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>🚀</div>
          <h3 style={styles.cardTitle}>Easy Integration</h3>
          <p style={styles.cardText}>
            Add the chatbot to any website with just a few lines of code.
            Works with React, Vue, Angular, or vanilla JavaScript.
          </p>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>🎨</div>
          <h3 style={styles.cardTitle}>Customizable</h3>
          <p style={styles.cardText}>
            Pass user context, customize colors, and configure behavior
            to match your clinic's branding.
          </p>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>🔒</div>
          <h3 style={styles.cardTitle}>Secure</h3>
          <p style={styles.cardText}>
            Session management, secure API communication, and
            data protection built-in.
          </p>
        </div>
      </div>

      <div style={styles.tryIt}>
        <p style={styles.tryItText}>
          👉 Click the chat button in the bottom right to try it out!
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    padding: '40px',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 60px',
  },
  heroContent: {
    padding: '60px 40px',
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '16px',
    lineHeight: '1.1',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '32px',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto 32px',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
  },
  featureIcon: {
    fontSize: '18px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto 60px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  },
  cardText: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0,
  },
  tryIt: {
    textAlign: 'center',
  },
  tryItText: {
    display: 'inline-block',
    padding: '16px 32px',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
  },
};

export default Home;
