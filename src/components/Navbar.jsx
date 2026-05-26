/**
 * src/components/Navbar.jsx
 * Sticky top navigation with responsive hamburger menu, active-link
 * highlighting, language toggle, and login link. Mirrors the
 * reference site's nav structure.
 */
import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Navbar.css';

const LINKS = [
  { to: '/', key: 'nav_home', end: true },
  { to: '/leaderboard', key: 'nav_leaderboard' },
  { to: '/gallery', key: 'nav_gallery' },
  { to: '/sports', key: 'nav_sports' },
  { to: '/schedule', key: 'nav_schedule' },
];

export default function Navbar() {
  const { t, lang, toggle } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever the route changes
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">🏆</span>
          <span className="brand-text">QAQC <em>Sport Tournament</em></span>
        </Link>

        <button
          className={`hamburger ${open ? 'is-open' : ''}`}
          aria-label="Mở menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${open ? 'is-open' : ''}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={close}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {t(link.key)}
            </NavLink>
          ))}

          <button className="lang-toggle" onClick={toggle} aria-label="Đổi ngôn ngữ">
            {lang === 'vi' ? 'EN' : 'VI'}
          </button>

          <Link
            to="/login"
            className="btn btn-gold nav-login"
            onClick={close}
            state={{ from: location.pathname }}
          >
            {t('login')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
