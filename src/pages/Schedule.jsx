import { useState, useMemo } from 'react';
import SportIcon from '../components/SportIcon.jsx';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

/* Team avatar: logo image or coloured badge */
function TeamAvatar({ name, color, logo, size = 36 }) {
  if (logo) return (
    <img src={logo} alt={name}
      style={{ width: size, height: size, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
  );
  return (
    <span className="team-dot" style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}>
      {(name || '?').split(' ').pop()[0]}
    </span>
  );
}

/* Parse "Nguyễn A 23, Trần B 45+2" or "Nguyễn A 22; Nguyễn A 45" → [{name, min}] */
function parseEvents(str) {
  if (!str?.trim()) return [];
  return str.split(/[,;]/).map(s => {
    const m = s.trim().match(/^(.+?)\s+(\d+(?:\+\d+)?)'?$/);
    return m ? { name: m[1].trim(), min: m[2] } : { name: s.trim(), min: '' };
  }).filter(e => e.name);
}

function EventRow({ homeEvents, awayEvents, icon }) {
  if (!homeEvents.length && !awayEvents.length) return null;
  return (
    <div className="event-row">
      <div className="event-col event-home">
        {homeEvents.map((e, i) => (
          <span key={i} className="event-item">{e.name}{e.min ? ` ${e.min}'` : ''}</span>
        ))}
      </div>
      <span className="event-icon">{icon}</span>
      <div className="event-col event-away">
        {awayEvents.map((e, i) => (
          <span key={i} className="event-item">{e.name}{e.min ? ` ${e.min}'` : ''}</span>
        ))}
      </div>
    </div>
  );
}

function MatchEvents({ m }) {
  const played = m.homeScore != null && m.awayScore != null;
  if (!played) return null;
  const hG = parseEvents(m.homeScorers), aG = parseEvents(m.awayScorers);
  const hY = parseEvents(m.homeYellows), aY = parseEvents(m.awayYellows);
  const hR = parseEvents(m.homeReds),    aR = parseEvents(m.awayReds);
  if (!hG.length && !aG.length && !hY.length && !aY.length && !hR.length && !aR.length) return null;
  return (
    <div className="match-events">
      <EventRow homeEvents={hG} awayEvents={aG} icon="⚽" />
      <EventRow homeEvents={hY} awayEvents={aY} icon="🟨" />
      <EventRow homeEvents={hR} awayEvents={aR} icon="🟥" />
    </div>
  );
}

/* STATUS_LABEL and ROUND_LABEL are built dynamically using t() inside the component */

/* "2026-07-05" → "05/07/2026" */
function formatDate(iso) {
  if (!iso) return '';
  try { const [y, mo, d] = iso.split('-'); return `${d}/${mo}/${y}`; }
  catch { return iso; }
}

/* Group matches by date, sorted ascending */
function groupByDate(matches) {
  const map = {};
  matches.forEach(m => {
    const key = m.date || 'unknown';
    if (!map[key]) map[key] = [];
    map[key].push(m);
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, list]) => [
      date,
      [...list].sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    ]);
}

export default function Schedule() {
  const { t } = useLanguage();

  const STATUS_LABEL = { live: t('badge_live'), upcoming: t('badge_upcoming'), finished: t('badge_finished') };
  const ROUND_LABEL  = {
    group: t('round_group'), r16: t('round_r16'), qf: t('round_qf'),
    sf: t('round_sf'), '3rd': t('round_3rd'), final: t('round_final'),
  };

  const [selectedDate, setSelectedDate] = useState('');
  const [status,       setStatus]       = useState('');
  const [sport,        setSport]        = useState('');

  const { data: sports } = useFetch(() => api.getSports(), []);

  /* Fetch ALL matches once — filter client-side so date chips are always dynamic */
  const { data: allData, loading, error } = useFetch(() => api.getSchedule(), []);

  /* Unique sorted dates from actual data */
  const availableDates = useMemo(() => {
    if (!allData) return [];
    return [...new Set(allData.map(m => m.date).filter(Boolean))].sort();
  }, [allData]);

  /* Client-side filtering */
  const filtered = useMemo(() => {
    if (!allData) return [];
    return allData.filter(m => {
      if (selectedDate && m.date    !== selectedDate) return false;
      if (status       && m.status  !== status)       return false;
      if (sport        && m.sportId !== sport)         return false;
      return true;
    });
  }, [allData, selectedDate, status, sport]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('page_schedule_title')}</h1>
          <p>{t('page_schedule_sub')}</p>
        </div>
      </header>

      <section className="section">
        <div className="container">

          {/* ── Filter: Ngày (dynamic from data) ── */}
          <div className="filters">
            <span className="filter-label">{t('filter_date')}</span>
            <button
              className={`chip ${selectedDate === '' ? 'active' : ''}`}
              onClick={() => setSelectedDate('')}>
              {t('all')}
            </button>
            {availableDates.map(d => (
              <button
                key={d}
                className={`chip ${selectedDate === d ? 'active' : ''}`}
                onClick={() => setSelectedDate(selectedDate === d ? '' : d)}>
                {formatDate(d)}
              </button>
            ))}
          </div>

          {/* ── Filter: Môn ── */}
          <div className="filters">
            <span className="filter-label">{t('filter_sport')}</span>
            <button className={`chip ${sport === '' ? 'active' : ''}`} onClick={() => setSport('')}>{t('all')}</button>
            {(sports || []).map(s => (
              <button
                key={s.id}
                className={`chip ${sport === s.id ? 'active' : ''}`}
                onClick={() => setSport(sport === s.id ? '' : s.id)}>
                <SportIcon icon={s.icon} size="1.1em" /> {s.name}
              </button>
            ))}
          </div>

          {/* ── Filter: Trạng thái ── */}
          <div className="filters">
            <span className="filter-label">{t('filter_status')}</span>
            <button className={`chip ${status === ''         ? 'active' : ''}`} onClick={() => setStatus('')}>{t('all')}</button>
            <button className={`chip ${status === 'live'     ? 'active' : ''}`} onClick={() => setStatus('live')}>{t('status_live')}</button>
            <button className={`chip ${status === 'upcoming' ? 'active' : ''}`} onClick={() => setStatus('upcoming')}>{t('status_upcoming')}</button>
            <button className={`chip ${status === 'finished' ? 'active' : ''}`} onClick={() => setStatus('finished')}>{t('status_finished')}</button>
          </div>

          {loading && <Loading />}
          {error   && <ErrorState message={error} />}
          {!loading && !error && filtered.length === 0 && <Empty label={t('no_matches_filter')} />}

          {filtered.length > 0 && (
            <p className="match-summary">
              {filtered.length} trận
              {sport ? ` · ${sports?.find(s => s.id === sport)?.name || sport}` : ''}
            </p>
          )}

          {/* ── Matches grouped by date ── */}
          {grouped.map(([dateKey, matches]) => (
            <div key={dateKey} style={{ marginBottom: 36 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 16, paddingBottom: 10,
                borderBottom: '2px solid var(--blue)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                  fontWeight: 800, letterSpacing: '.04em', color: 'var(--blue-light)',
                }}>
                  📅 {formatDate(dateKey)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                  {matches.length} trận
                </span>
              </div>

              <div className="match-list">
                {matches.map((m, i) => (
                  <article className="card match-card reveal" key={m.id}
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="match-when">
                      <span className="match-time">{m.time}</span>
                      <span className="match-sub">{ROUND_LABEL[m.round] ?? m.round}</span>
                    </div>

                    {(() => {
                      const played  = m.homeScore != null && m.awayScore != null;
                      const hasPens = played && m.homePens != null && m.awayPens != null;
                      const homeWin = played && (m.homeScore > m.awayScore || (hasPens && m.homePens > m.awayPens));
                      const awayWin = played && (m.awayScore > m.homeScore || (hasPens && m.awayPens > m.homePens));
                      /* Hide avatar for pairs and when no real logo (only football has logos) */
                      const isPair  = name => name?.includes('–') || name?.includes(' - ');
                      const hideHomeAvatar = isPair(m.homeName) || !m.homeLogo;
                      const hideAwayAvatar = isPair(m.awayName) || !m.awayLogo;
                      return (
                        <div className="match-teams">
                          <span className="match-team" style={{
                            fontWeight: homeWin ? 700 : 400,
                            color: homeWin ? 'var(--blue-dark)' : awayWin ? 'var(--text-muted)' : 'var(--text)',
                          }}>
                            {!hideHomeAvatar && <TeamAvatar name={m.homeName} color={m.homeColor} logo={m.homeLogo} />}
                            {m.homeName}
                          </span>
                          <span className={`match-score ${m.homeScore == null ? 'tbd' : ''}`}>
                            {m.homeScore == null ? 'vs' : `${m.homeScore} – ${m.awayScore}`}
                            {m.homePens != null && (
                              <span style={{
                                display: 'block', fontSize: '.78rem', fontWeight: 600,
                                color: 'var(--blue)', letterSpacing: 0, whiteSpace: 'nowrap',
                              }}>
                                Phạt luân lưu: {m.homePens} – {m.awayPens}
                              </span>
                            )}
                          </span>
                          <span className="match-team away" style={{
                            fontWeight: awayWin ? 700 : 400,
                            color: awayWin ? 'var(--blue-dark)' : homeWin ? 'var(--text-muted)' : 'var(--text)',
                          }}>
                            {!hideAwayAvatar && <TeamAvatar name={m.awayName} color={m.awayColor} logo={m.awayLogo} />}
                            {m.awayName}
                          </span>
                        </div>
                      );
                    })()}

                    <div className="match-info">
                      <span className={`badge badge-${m.status}`}>{STATUS_LABEL[m.status]}</span>
                      <span className="match-sport"><SportIcon icon={m.sportIcon} size="1em" /> {m.sportName}</span>
                      {m.venue && <span className="match-venue">📍 {m.venue}</span>}
                    </div>
                    {m.sportId === 'football' && <MatchEvents m={m} />}
                  </article>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}
