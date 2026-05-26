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
          <h3 className="footer-brand">QAQC <span>Sport Tournament</span></h3>
          <p className="footer-note">{t('organized_by')}</p>
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
          <p>📅 01 / 07 / 2026</p>
        </div>
      </div>

      <div className="footer-bar">
        <div className="container">
          © {year} QAQC Sport Tournament.
        </div>
      </div>
    </footer>
  );
}
