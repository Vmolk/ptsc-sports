/**
 * src/components/Navbar.jsx
 * Sticky top navigation with responsive hamburger menu, active-link
 * highlighting, language toggle, and login link. Mirrors the
 * reference site's nav structure.
 */
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Navbar.css';

const LINKS = [
  { to: '/',         key: 'nav_home',     end: true },
  { to: '/bracket',  key: 'nav_bracket'            },
  { to: '/gallery',  key: 'nav_gallery'            },
  { to: '/sports',   key: 'nav_sports'             },
  { to: '/schedule', key: 'nav_schedule'           },
];

export default function Navbar() {
  const { t, lang, toggle } = useLanguage();
  const [open, setOpen] = useState(false);

  // Close mobile menu whenever the route changes
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <img
            src="/ptsc-logo.JPG"
            alt="PTSC M&C"
            className="brand-logo"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div>
            <span className="brand-text">HỘI THAO</span>
            <span className="brand-sub">Phòng Quản Lý Chất Lượng</span>
          </div>
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
        </nav>
      </div>
    </header>
  );
}
