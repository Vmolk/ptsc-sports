/**
 * src/pages/Sports.jsx
 * Sport info + danh sách VĐV theo môn và tổ.
 */
import { useState, useMemo } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

/* Team color dot */
function TeamDot({ color, size = 12 }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size, height: size,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
    }} />
  );
}

/* Category badge */
function CatBadge({ label }) {
  const colors = {
    'Nam':         '#3b82f6',
    'Nữ':          '#ec4899',
    'Đơn nam':     '#3b82f6',
    'Đơn nữ':      '#ec4899',
    'Đôi nam':     '#1d4ed8',
    'Đôi nữ':      '#be185d',
    'Cặp nam-nữ':  '#7c3aed',
  };
  const bg = colors[label] || '#555';
  return (
    <span style={{
      background: bg + '22', color: bg,
      border: `1px solid ${bg}55`,
      borderRadius: 4, padding: '1px 6px',
      fontSize: '.68rem', fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

/* Participants grid for one sport, grouped by team */
function ParticipantsGrid({ participants, teams }) {
  if (!participants?.length) return (
    <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', padding: '12px 0' }}>
      Chưa có danh sách VĐV.
    </p>
  );

  /* Group by teamId, preserving team order */
  const byTeam = useMemo(() => {
    const map = {};
    participants.forEach(p => {
      if (!map[p.teamId]) map[p.teamId] = { ...p, members: [] };
      map[p.teamId].members.push(p);
    });
    /* Sort by teamId order from teams list */
    const orderedIds = (teams || []).map(t => t.id);
    return Object.values(map).sort((a, b) =>
      orderedIds.indexOf(a.teamId) - orderedIds.indexOf(b.teamId)
    );
  }, [participants, teams]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 14, marginTop: 16,
    }}>
      {byTeam.map(({ teamId, teamName, teamColor, members }) => (
        <div key={teamId} style={{
          background: '#fff',
          border: '1px solid var(--line-blue)',
          borderRadius: 10, overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(21,101,192,.08)',
        }}>
          {/* Team header */}
          <div style={{
            background: teamColor + '22',
            borderBottom: `2px solid ${teamColor}`,
            padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <TeamDot color={teamColor} size={10} />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '.9rem', letterSpacing: '.04em', textTransform: 'uppercase',
              color: teamColor,
            }}>
              {teamName}
            </span>
            <span style={{
              marginLeft: 'auto', fontSize: '.75rem',
              color: 'var(--text-muted)', fontWeight: 600,
            }}>
              {members.length} VĐV
            </span>
          </div>

          {/* Member list */}
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {members.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {/* Số áo */}
                {m.jersey ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 26, height: 20, borderRadius: 4,
                    background: 'rgba(21,101,192,.10)', color: 'var(--blue)',
                    fontSize: '.7rem', fontWeight: 800, fontFamily: 'var(--font-display)',
                    letterSpacing: '.02em', flexShrink: 0, padding: '0 4px',
                  }}>
                    #{m.jersey}
                  </span>
                ) : (
                  <span style={{ minWidth: 26 }} />
                )}
                <span style={{ fontSize: '.82rem', color: 'var(--text)', flex: 1 }}>{m.name}</span>
                <CatBadge label={m.category} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Sports() {
  const { t } = useLanguage();

  const { data: sports,       loading: lSports, error: eSports } = useFetch(() => api.getSports(),       []);
  const { data: teams                                            } = useFetch(() => api.getTeams(),        []);
  const { data: allParticipants, loading: lPart                 } = useFetch(() => api.getParticipants(), []);

  const [activeSport, setActiveSport] = useState(null);

  const currentSport = useMemo(() => {
    if (!sports?.length) return null;
    return activeSport ? sports.find(s => s.id === activeSport) || sports[0] : sports[0];
  }, [sports, activeSport]);

  const sportParticipants = useMemo(() => {
    if (!allParticipants || !currentSport) return [];
    return allParticipants.filter(p => p.sportId === currentSport.id);
  }, [allParticipants, currentSport]);

  const loading = lSports;
  const error   = eSports;

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('sports_title')}</h1>
          <p>{t('organized_by')}</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading && <Loading />}
          {error   && <ErrorState message={error} />}
          {!loading && !error && sports?.length === 0 && <Empty />}

          {sports && sports.length > 0 && (
            <>
              {/* ── Sport selector tabs ── */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                {sports.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSport(s.id)}
                    style={{
                      padding: '9px 20px', borderRadius: 8,
                      border: `1px solid ${currentSport?.id === s.id ? 'var(--blue)' : 'var(--line)'}`,
                      background: currentSport?.id === s.id ? 'var(--blue)' : '#fff',
                      color:      currentSport?.id === s.id ? '#fff' : 'var(--text-muted)',
                      fontWeight: 600, fontSize: '.9rem', cursor: 'pointer', transition: 'all .15s',
                    }}>
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>

              {currentSport && (
                <>
                  {/* ── Sport info card ── */}
                  <div className="card" style={{ padding: '20px 24px', marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                      <span style={{ fontSize: '2.4rem' }}>{currentSport.icon}</span>
                      <div>
                        <h2 style={{
                          fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                          fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em',
                        }}>
                          {currentSport.name}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginTop: 2 }}>
                          {currentSport.format}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                      {[
                        ['📍 Địa điểm', currentSport.venue || '—'],
                        ['👥 Số đội',   currentSport.teams || '—'],
                      ].map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '.04em' }}>
                            {label}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '.95rem' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Participants section ── */}
                  <div style={{
                    borderTop: '2px solid var(--blue)',
                    paddingTop: 20,
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                      fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em',
                      color: 'var(--blue-dark)', marginBottom: 4,
                    }}>
                      Danh sách VĐV tham dự
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '.82rem', marginBottom: 0 }}>
                      {currentSport.icon} {currentSport.name} · {sportParticipants.length} VĐV đăng ký
                    </p>

                    {lPart
                      ? <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: '.9rem' }}>Đang tải...</p>
                      : <ParticipantsGrid participants={sportParticipants} teams={teams} />
                    }
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
