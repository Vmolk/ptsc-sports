import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import Countdown from '../components/Countdown.jsx';
import { Loading, ErrorState } from '../components/States.jsx';
import './Home.css';

export default function Home() {
  const { t } = useLanguage();
  const { data: stats, loading, error } = useFetch(() => api.getStats(), []);
  const { data: sports } = useFetch(() => api.getSports(), []);

  const eventDate =
    stats?.event?.startDate ||
    import.meta.env.VITE_EVENT_DATE ||
    '2026-07-05T08:00:00+07:00';

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-content reveal">

          {/* Organiser logo + kicker */}
          <div className="hero-org">
            <img
              src="/ptsc-logo.png"
              alt="PTSC M&C"
              className="hero-org-logo"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <p className="hero-kicker">{t('organized_by')}</p>

          {/* Main title */}
          <h1 className="hero-title">
            HỘI THAO
            <span className="hero-title-sub">PHÒNG QUẢN LÝ CHẤT LƯỢNG</span>
            <span className="hero-title-year">2026</span>
          </h1>

          {/* Date range */}
          <div className="hero-dates">
            🏟️&nbsp; 05 / 07 / 2026 &nbsp;–&nbsp; 18 / 07 / 2026
          </div>

          {/* Countdown */}
          <Countdown date={eventDate} />

          <Link to="/schedule" className="btn btn-primary hero-btn">
            {t('hero_cta')} →
          </Link>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats-section">
        <div className="container">
          {loading && <Loading />}
          {error && <ErrorState message={error} />}
          {stats && <StatsRow stats={stats} t={t} />}
        </div>
      </section>

      {/* ── SPORTS ── */}
      <section className="sports-section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{t('sports_title')}</h2>
            <p className="section-sub">{t('organized_by')}</p>
          </div>

          <div className="sports-grid">
            {(sports || []).slice(0, 8).map((s, i) => (
              <article
                className="sport-card reveal"
                key={s.id}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="sport-icon" aria-hidden="true">{s.icon}</span>
                <h3 className="sport-name">{s.name}</h3>
                <p className="sport-meta">{s.format}</p>
              </article>
            ))}
          </div>

          <div className="sports-cta">
            <Link to="/sports" className="btn btn-ghost">{t('nav_sports')} →</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatsRow({ stats, t }) {
  const a = stats.athletes || {};
  const items = [
    { num: stats.sportsCount,            label: t('stat_sports')   },
    { num: stats.days,                   label: t('stat_days')     },
    { num: stats.teamsCount,             label: t('stat_teams')    },
    { num: a.total,                      label: t('stat_athletes') },
    { num: `${a.male}/${a.female}`,      label: t('stat_gender')   },
    { num: stats.matchesCount,           label: t('stat_matches')  },
  ];
  return (
    <div className="stats-grid">
      {items.map((it, i) => (
        <div className="stat-cell reveal" key={i} style={{ animationDelay: `${i * 50}ms` }}>
          <span className="stat-num">{it.num ?? '—'}</span>
          <span className="stat-label">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
