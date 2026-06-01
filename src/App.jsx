import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Bracket from './pages/Bracket.jsx';
import Gallery from './pages/Gallery.jsx';
import Sports from './pages/Sports.jsx';
import Schedule from './pages/Schedule.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/bracket"  element={<Bracket />} />
          <Route path="/gallery"     element={<Gallery />} />
          <Route path="/sports"      element={<Sports />} />
          <Route path="/schedule"    element={<Schedule />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
