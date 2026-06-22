import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <img src="/ptsc-logo.JPG" alt="PTSC M&C"
              style={{ height: 32, width: 'auto', objectFit: 'contain' }}
              onError={e => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h3 className="footer-brand">HỘI THAO <span>PHÒNG QUẢN LÝ CHẤT LƯỢNG</span></h3>
          <p className="footer-note">{t('organized_by')}</p>
        </div>

        {/* Quick links — without leaderboard */}
        <nav className="footer-links" aria-label="Liên kết nhanh">
          <Link to="/">{t('nav_home')}</Link>
          <Link to="/bracket">{t('nav_bracket')}</Link>
          <Link to="/sports">{t('nav_sports')}</Link>
          <Link to="/schedule">{t('nav_schedule')}</Link>
          <Link to="/gallery">{t('nav_gallery')}</Link>
        </nav>

        {/* Event info */}
        <div className="footer-meta">
          <p>📍 Vũng Tàu, Việt Nam</p>
          <p>📅 05 / 07 / 2026 – 19 / 07 / 2026</p>
        </div>
      </div>

      <div className="footer-bar">
        <div className="container">
          © {year} Hội Thao Phòng Quản Lý Chất Lượng · PTSC M&C
        </div>
      </div>
    </footer>
  );
}
