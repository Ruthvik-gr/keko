import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import WithContext from './pages/WithContext';
import ListChats from './pages/ListChats';

function App() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🐾</span>
          <span style={styles.navTitle}>Vet Chatbot</span>
        </div>
        <div style={styles.navLinks}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive('/') ? styles.navLinkActive : {}),
            }}
          >
            Basic Demo
          </Link>
          <Link
            to="/with-context"
            style={{
              ...styles.navLink,
              ...(isActive('/with-context') ? styles.navLinkActive : {}),
            }}
          >
            With Context
          </Link>
          <Link
            to="/list-chats"
            style={{
              ...styles.navLink,
              ...(isActive('/list-chats') ? styles.navLinkActive : {}),
            }}
          >
            Conversations
          </Link>
        </div>
      </nav>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/with-context" element={<WithContext />} />
          <Route path="/list-chats" element={<ListChats />} />
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navLogo: {
    fontSize: '28px',
  },
  navTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
  },
  navLink: {
    color: '#64748b',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    backgroundColor: '#667eea',
    color: 'white',
  },
  main: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
};

export default App;
