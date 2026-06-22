/**
 * src/pages/Sports.jsx
 * Sport info + danh sách VĐV theo môn và tổ.
 */
import { useState, useMemo, useEffect } from 'react';
import SportIcon from '../components/SportIcon.jsx';
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

/* ── Flat list with category tab buttons (for badminton / pickleball) ── */
function ParticipantsFlatList({ participants }) {
  const byCategory = useMemo(() => {
    const map = {};
    participants.forEach(p => {
      const cat = p.category || 'Khác';
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return map;
  }, [participants]);

  const categories = Object.keys(byCategory);
  const [activecat, setActivecat] = useState(categories[0] || '');

  useEffect(() => {
    if (!byCategory[activecat] && categories.length) setActivecat(categories[0]);
  }, [categories.join(',')]);

  const members = byCategory[activecat] || [];

  return (
    <div style={{ marginTop: 16 }}>
      {/* Category tab buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActivecat(cat)}
            style={{
              padding: '7px 20px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9rem',
              border: `1px solid ${activecat === cat ? 'var(--blue)' : 'var(--line-blue)'}`,
              background: activecat === cat ? 'var(--blue)' : '#fff',
              color: activecat === cat ? '#fff' : 'var(--text-muted)',
              transition: 'all .15s',
            }}
          >
            {cat}
            <span style={{
              marginLeft: 6, fontSize: '.75rem', opacity: .8,
              fontWeight: activecat === cat ? 700 : 500,
            }}>
              ({byCategory[cat].length})
            </span>
          </button>
        ))}
      </div>

      {/* Participant rows for active category */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 6,
      }}>
        {members.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px', borderRadius: 8,
            background: '#fff', border: '1px solid var(--line)',
            boxShadow: '0 1px 4px rgba(21,101,192,.05)',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '.72rem', color: 'var(--text-muted)', minWidth: 20, textAlign: 'right',
            }}>{i + 1}</span>
            <span style={{ fontSize: '.85rem', color: 'var(--text)', flex: 1 }}>{m.name}</span>
            {m.jersey && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 26, height: 20, borderRadius: 4,
                background: 'rgba(21,101,192,.10)', color: 'var(--blue)',
                fontSize: '.7rem', fontWeight: 800, fontFamily: 'var(--font-display)',
                flexShrink: 0, padding: '0 4px',
              }}>{m.jersey}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Sports that group by category (Đơn/Đôi) instead of by team */
const CATEGORY_SPORTS = ['badminton', 'pickleball'];

/* ── Team-grouped grid (for football / tugofwar) ── */
function ParticipantsGrid({ participants, teams, sportId }) {
  if (!participants?.length) return (
    <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', padding: '12px 0' }}>
      {t('no_athletes')}
    </p>
  );

  /* Badminton & pickleball always use flat category-tab layout */
  if (CATEGORY_SPORTS.includes(sportId)) {
    return <ParticipantsFlatList participants={participants} />;
  }

  /* Group by teamId, preserving team order */
  const byTeam = useMemo(() => {
    const map = {};
    participants.forEach(p => {
      const key = p.teamId || '__none__';
      if (!map[key]) map[key] = { ...p, members: [] };
      map[key].members.push(p);
    });
    const orderedIds = (teams || []).map(t => t.id);
    return Object.values(map).sort((a, b) =>
      orderedIds.indexOf(a.teamId) - orderedIds.indexOf(b.teamId)
    );
  }, [participants, teams]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 12, marginTop: 16,
    }}>
      {byTeam.map(({ teamId, teamName, teamColor, members }) => (
        <div key={teamId} style={{
          background: '#fff',
          border: '1px solid var(--line-blue)',
          borderRadius: 10, overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(21,101,192,.08)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Team header */}
          <div style={{
            background: (teamColor || '#888') + '22',
            borderBottom: `2px solid ${teamColor || '#888'}`,
            padding: '8px 12px',
            display: 'flex', alignItems: 'flex-start', gap: 8,
            minHeight: 52,
          }}>
            <TeamDot color={teamColor || '#888'} size={10} />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '.82rem', letterSpacing: '.03em', textTransform: 'uppercase',
              color: teamColor || '#888', flex: 1, lineHeight: 1.3,
              wordBreak: 'break-word',
            }}>
              {teamName || teamId}
            </span>
            <span style={{
              flexShrink: 0, fontSize: '.72rem',
              color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {members.length} VĐV
            </span>
          </div>

          {/* Member list */}
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {members.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {m.jersey ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 26, height: 20, borderRadius: 4,
                    background: 'rgba(21,101,192,.10)', color: 'var(--blue)',
                    fontSize: '.7rem', fontWeight: 800, fontFamily: 'var(--font-display)',
                    letterSpacing: '.02em', flexShrink: 0, padding: '0 4px',
                  }}>{m.jersey}</span>
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
          <h1>{t('page_sports_title')}</h1>
          <p>{t('page_sports_sub')}</p>
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
                    <SportIcon icon={s.icon} size="1.1em" /> {s.name}
                  </button>
                ))}
              </div>

              {currentSport && (
                <>
                  {/* ── Sport info card ── */}
                  <div className="card" style={{ padding: '20px 24px', marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                      <SportIcon icon={currentSport.icon} size="2.4rem" />
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
                      {t('athletes_list')}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '.82rem', marginBottom: 0 }}>
                      <SportIcon icon={currentSport.icon} size="1em" /> {currentSport.name} ·{' '}
                      {CATEGORY_SPORTS.includes(currentSport.id)
                        ? (() => {
                            const byCat = {};
                            sportParticipants.forEach(p => {
                              const c = p.category || 'Khác';
                              byCat[c] = (byCat[c] || 0) + 1;
                            });
                            return Object.entries(byCat)
                              .map(([cat, n]) => `${cat}: ${n}`)
                              .join(' · ');
                          })()
                        : `${sportParticipants.length} VĐV đăng ký`
                      }
                    </p>

                    {lPart
                      ? <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: '.9rem' }}>Đang tải...</p>
                      : <ParticipantsGrid participants={sportParticipants} teams={teams} sportId={currentSport.id} />
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
