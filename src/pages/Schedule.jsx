import { useState } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

const STATUS_LABEL = { live: 'TRỰC TIẾP', upcoming: 'SẮP DIỄN RA', finished: 'KẾT THÚC' };

export default function Schedule() {
  const [day,    setDay]    = useState('');
  const [status, setStatus] = useState('');
  const [sport,  setSport]  = useState('');

  const { data: sports } = useFetch(() => api.getSports(), []);

  const { data, loading, error } = useFetch(
    () => api.getSchedule({
      ...(day    && { day }),
      ...(status && { status }),
      ...(sport  && { sport }),
    }),
    [day, status, sport]
  );

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>Lịch thi đấu</h1>
          <p>01 – 02 / 07 / 2026</p>
        </div>
      </header>

      <section className="section">
        <div className="container">

          {/* ---- Filter: Ngày ---- */}
          <div className="filters">
            <span className="filter-label">Ngày</span>
            <button className={`chip ${day === ''  ? 'active' : ''}`} onClick={() => setDay('')}>Tất cả</button>
            <button className={`chip ${day === '1' ? 'active' : ''}`} onClick={() => setDay('1')}>Ngày 1</button>
            <button className={`chip ${day === '2' ? 'active' : ''}`} onClick={() => setDay('2')}>Ngày 2</button>
          </div>

          {/* ---- Filter: Môn ---- */}
          <div className="filters">
            <span className="filter-label">Môn</span>
            <button className={`chip ${sport === '' ? 'active' : ''}`} onClick={() => setSport('')}>Tất cả</button>
            {(sports || []).map((s) => (
              <button
                key={s.id}
                className={`chip ${sport === s.id ? 'active' : ''}`}
                onClick={() => setSport(sport === s.id ? '' : s.id)}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {/* ---- Filter: Trạng thái ---- */}
          <div className="filters">
            <span className="filter-label">Trạng thái</span>
            <button className={`chip ${status === ''         ? 'active' : ''}`} onClick={() => setStatus('')}>Tất cả</button>
            <button className={`chip ${status === 'live'     ? 'active' : ''}`} onClick={() => setStatus('live')}>🔴 Trực tiếp</button>
            <button className={`chip ${status === 'upcoming' ? 'active' : ''}`} onClick={() => setStatus('upcoming')}>⏳ Sắp diễn ra</button>
            <button className={`chip ${status === 'finished' ? 'active' : ''}`} onClick={() => setStatus('finished')}>✅ Kết thúc</button>
          </div>

          {loading && <Loading />}
          {error   && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty label="Không có trận đấu phù hợp." />}

          {/* ---- Match count summary ---- */}
          {data && data.length > 0 && (
            <p className="match-summary">
              {data.length} trận{day ? ` · Ngày ${day}` : ''}{sport ? ` · ${sports?.find(s => s.id === sport)?.name || sport}` : ''}
            </p>
          )}

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
                      <span className="team-dot" style={{ background: m.homeColor }}>
                        {(m.homeName || '?').split(' ').pop()[0]}
                      </span>
                      {m.homeName}
                    </span>
                    <span className={`match-score ${m.homeScore == null ? 'tbd' : ''}`}>
                      {m.homeScore == null ? 'vs' : `${m.homeScore} – ${m.awayScore}`}
                    </span>
                    <span className="match-team away">
                      <span className="team-dot" style={{ background: m.awayColor }}>
                        {(m.awayName || '?').split(' ').pop()[0]}
                      </span>
                      {m.awayName}
                    </span>
                  </div>

                  <div className="match-info">
                    <span className={`badge badge-${m.status}`}>{STATUS_LABEL[m.status]}</span>
                    <span className="match-sport">{m.sportIcon} {m.sportName}</span>
                    {m.venue && <span className="match-venue">📍 {m.venue}</span>}
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
