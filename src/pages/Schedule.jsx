/**
 * src/pages/Schedule.jsx
 * Match schedule with day + status filters. Matches are fetched
 * pre-enriched from the backend (team names, colors, sport icon).
 */
import { useState } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

const STATUS_LABEL = { live: 'TRỰC TIẾP', upcoming: 'SẮP DIỄN RA', finished: 'KẾT THÚC' };

export default function Schedule() {
  const { t } = useLanguage();
  const [day, setDay] = useState('');
  const [status, setStatus] = useState('');

  // Re-fetch whenever a filter changes (deps array drives useFetch).
  const { data, loading, error } = useFetch(
    () => api.getSchedule({ ...(day && { day }), ...(status && { status }) }),
    [day, status]
  );

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('nav_schedule')}</h1>
          <p>18 – 19 / 04 / 2026 · Vũng Tàu</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {/* Day filter */}
          <div className="filters">
            <button className={`chip ${day === '' ? 'active' : ''}`} onClick={() => setDay('')}>Tất cả ngày</button>
            <button className={`chip ${day === '1' ? 'active' : ''}`} onClick={() => setDay('1')}>Ngày 1</button>
            <button className={`chip ${day === '2' ? 'active' : ''}`} onClick={() => setDay('2')}>Ngày 2</button>
          </div>
          {/* Status filter */}
          <div className="filters">
            <button className={`chip ${status === '' ? 'active' : ''}`} onClick={() => setStatus('')}>Tất cả</button>
            <button className={`chip ${status === 'live' ? 'active' : ''}`} onClick={() => setStatus('live')}>Trực tiếp</button>
            <button className={`chip ${status === 'upcoming' ? 'active' : ''}`} onClick={() => setStatus('upcoming')}>Sắp diễn ra</button>
            <button className={`chip ${status === 'finished' ? 'active' : ''}`} onClick={() => setStatus('finished')}>Kết thúc</button>
          </div>

          {loading && <Loading />}
          {error && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty label="Không có trận đấu phù hợp." />}

          {data && data.length > 0 && (
            <div className="match-list">
              {data.map((m, i) => (
                <article className="card match-card reveal" key={m.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="match-when">
                    <span className="match-time">{m.time}</span>
                    <span className="match-sub">Ngày {m.day} · {m.round}</span>
                  </div>

                  <div className="match-teams">
                    <span className="match-team">
                      <span className="team-dot" style={{ background: m.homeColor }}>{m.homeName.split(' ').pop()[0]}</span>
                      {m.homeName}
                    </span>
                    <span className={`match-score ${m.homeScore == null ? 'tbd' : ''}`}>
                      {m.homeScore == null ? 'vs' : `${m.homeScore} - ${m.awayScore}`}
                    </span>
                    <span className="match-team away">
                      <span className="team-dot" style={{ background: m.awayColor }}>{m.awayName.split(' ').pop()[0]}</span>
                      {m.awayName}
                    </span>
                  </div>

                  <div className="match-info">
                    <span className={`badge badge-${m.status}`}>{STATUS_LABEL[m.status]}</span>
                    <span className="match-sport">{m.sportIcon} {m.sportName}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
