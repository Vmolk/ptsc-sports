/**
 * src/components/Footer.jsx
 * Site footer with event identity, quick links, and anniversary note.
 */
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">PTSC M&amp;C <span>Sports Day 2026</span></h3>
          <p className="footer-note">{t('organized_by')}</p>
          <p className="footer-note">Kỷ niệm 25 năm thành lập (2001 – 2026)</p>
        </div>

        <nav className="footer-links" aria-label="Liên kết nhanh">
          <Link to="/">{t('nav_home')}</Link>
          <Link to="/leaderboard">{t('nav_leaderboard')}</Link>
          <Link to="/sports">{t('nav_sports')}</Link>
          <Link to="/schedule">{t('nav_schedule')}</Link>
          <Link to="/gallery">{t('nav_gallery')}</Link>
        </nav>

        <div className="footer-meta">
          <p>📍 Vũng Tàu, Việt Nam</p>
          <p>📅 18 – 19 / 04 / 2026</p>
        </div>
      </div>

      <div className="footer-bar">
        <div className="container">
          © {year} PTSC M&amp;C Sports Day. Bản demo phục vụ trình diễn.
        </div>
      </div>
    </footer>
  );
}
