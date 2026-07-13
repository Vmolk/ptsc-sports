import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import './styles/global.css';
import './styles/pages.css';

class GlobalErrorBoundary extends Component {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#dbeafe', gap: 16, padding: 24, textAlign: 'center',
      }}>
        <img src="/ptsc-logo.JPG" alt="PTSC"
          style={{ height: 52, borderRadius: 6, objectFit: 'contain' }}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
        <p style={{ fontFamily: 'sans-serif', color: '#1565c0', fontSize: '.95rem', maxWidth: 320 }}>
          Trang gặp lỗi khi chuyển trang. Vui lòng tải lại.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 28px', background: '#1565c0', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'sans-serif', fontSize: '1rem', fontWeight: 600,
          }}>
          Tải lại trang
        </button>
      </div>
    );
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  </StrictMode>
);
