import { Component, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Bracket from './pages/Bracket.jsx';
import Gallery from './pages/Gallery.jsx';
import Sports from './pages/Sports.jsx';
import Schedule from './pages/Schedule.jsx';
import NotFound from './pages/NotFound.jsx';

class PageErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false }; }
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidUpdate(prevProps) {
    /* Reset when the user navigates to a different page */
    if (prevProps.routeKey !== this.props.routeKey) this.setState({ crashed: false });
  }
  render() {
    if (this.state.crashed) return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: 12 }}>⚠️ Trang gặp lỗi khi tải.</p>
        <button
          onClick={() => this.setState({ crashed: false })}
          style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--line)', cursor: 'pointer' }}>
          Thử lại
        </button>
      </div>
    );
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function AppRoutes() {
  const { pathname } = useLocation();
  return (
    <PageErrorBoundary routeKey={pathname}>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/bracket"  element={<Bracket />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="/sports"   element={<Sports />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
    </PageErrorBoundary>
  );
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1 }}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
