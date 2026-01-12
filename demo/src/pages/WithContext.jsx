import { useEffect } from 'react';

function WithContext() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:5000/sdk/vet-chatbot.iife.js';
    script.async = true;
    script.onload = () => {
      if (window.VetChatbot) {
        window.VetChatbot.init({
          apiUrl: 'http://localhost:5000/api',
          context: {
            userId: 'user_001',
            userName: 'Ruthvik',
            petName: 'Buddy',
            petType: 'Dog',
            petBreed: 'Golden Retriever',
            source: 'demo-with-context',
          },
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
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Integration with Context</h1>
          <p style={styles.subtitle}>
            Pass user and pet information to personalize the chatbot experience
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Context Data</h3>
            <p style={styles.cardDescription}>
              The chatbot is initialized with this user context:
            </p>
            <pre style={styles.code}>
{`{
  userId: 'user_001',
  userName: 'Ruthvik',
  petName: 'Buddy',
  petType: 'Dog',
  petBreed: 'Golden Retriever',
  source: 'demo-with-context'
}`}
            </pre>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Integration Code</h3>
            <p style={styles.cardDescription}>
              Add this script to your website:
            </p>
            <pre style={styles.code}>
{`<script src="http://localhost:5000/sdk/vet-chatbot.iife.js"></script>
<script>
  VetChatbot.init({
    apiUrl: 'http://localhost:5000/api',
    context: {
      userId: 'user_001',
      userName: 'Ruthvik',
      petName: 'Buddy',
      petType: 'Dog'
    }
  });
</script>`}
            </pre>
          </div>
        </div>

        <div style={styles.benefits}>
          <h3 style={styles.benefitsTitle}>Benefits of Using Context</h3>
          <div style={styles.benefitsList}>
            <div style={styles.benefit}>
              <span style={styles.benefitIcon}>👤</span>
              <div>
                <h4 style={styles.benefitTitle}>Personalized Greetings</h4>
                <p style={styles.benefitText}>Address users by name for a warm experience</p>
              </div>
            </div>
            <div style={styles.benefit}>
              <span style={styles.benefitIcon}>🐕</span>
              <div>
                <h4 style={styles.benefitTitle}>Pet-Specific Advice</h4>
                <p style={styles.benefitText}>Tailor recommendations based on pet type and breed</p>
              </div>
            </div>
            <div style={styles.benefit}>
              <span style={styles.benefitIcon}>📋</span>
              <div>
                <h4 style={styles.benefitTitle}>Pre-filled Forms</h4>
                <p style={styles.benefitText}>Speed up appointment booking with known information</p>
              </div>
            </div>
            <div style={styles.benefit}>
              <span style={styles.benefitIcon}>📊</span>
              <div>
                <h4 style={styles.benefitTitle}>Better Analytics</h4>
                <p style={styles.benefitText}>Track conversations by user and source</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.tryIt}>
          <p style={styles.tryItText}>
            👉 Click the chat button to see personalized responses!
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    padding: '40px',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '16px',
  },
  code: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: '20px',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.6',
    overflow: 'auto',
    margin: 0,
    fontFamily: 'Monaco, Consolas, monospace',
  },
  benefits: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '48px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  },
  benefitsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '24px',
    textAlign: 'center',
  },
  benefitsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
  },
  benefit: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  benefitTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  benefitText: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5',
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

export default WithContext;
