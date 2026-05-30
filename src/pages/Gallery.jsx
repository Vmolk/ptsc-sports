/**
 * src/pages/Gallery.jsx
 * Photo gallery grouped by day. Each item links out to a Google Drive album.
 */
import { useState } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

/* Colour palette used as tile backgrounds when no real photo is available */
const PALETTE = ['#1e3a5f','#2d1b69','#1a4731','#5c1a1a','#1a3c5c','#4a2c1a','#1f3a2e'];

function dayLabel(d) {
  if (d === 1 || d === '1') return '01/07/2026';
  if (d === 2 || d === '2') return '02/07/2026';
  return `Ngày ${d}`;
}

export default function Gallery() {
  const { t } = useLanguage();
  const [day, setDay] = useState('');

  const { data, loading, error } = useFetch(
    () => api.getGallery(day || undefined),
    [day]
  );

  const handleOpen = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('nav_gallery')}</h1>
          <p>Khoảnh khắc đáng nhớ · Nhấn vào ảnh để xem album Drive</p>
        </div>
      </header>

      <section className="section">
        <div className="container">

          {/* ---- Day filter ---- */}
          <div className="filters">
            <span className="filter-label">Ngày</span>
            <button className={`chip ${day === ''  ? 'active' : ''}`} onClick={() => setDay('')}>Tất cả</button>
            <button className={`chip ${day === '1' ? 'active' : ''}`} onClick={() => setDay('1')}>01/07/2026</button>
            <button className={`chip ${day === '2' ? 'active' : ''}`} onClick={() => setDay('2')}>02/07/2026</button>
          </div>

          {loading && <Loading />}
          {error && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty label="Chưa có ảnh." />}

          {data && data.length > 0 && (
            <div className="gallery-grid">
              {data.map((g, i) => (
                <figure
                  className="gallery-item reveal"
                  key={g.id ?? i}
                  style={{
                    background: `linear-gradient(135deg, ${PALETTE[i % PALETTE.length]}, var(--bg-900))`,
                    animationDelay: `${i * 50}ms`,
                    cursor: g.url ? 'pointer' : 'default',
                  }}
                  onClick={() => handleOpen(g.url)}
                  title={g.url ? 'Nhấn để mở album Google Drive' : ''}
                >
                  {/* Drive link badge */}
                  {g.url && (
                    <span style={{
                      position: 'absolute', top: 10, right: 10,
                      background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)',
                      borderRadius: 6, padding: '3px 8px',
                      fontSize: '.7rem', fontWeight: 700, color: '#fff',
                      display: 'flex', alignItems: 'center', gap: 4, zIndex: 2,
                    }}>
                      🔗 Drive
                    </span>
                  )}

                  <span className="gallery-day">{dayLabel(g.day)}</span>
                  <figcaption className="gallery-caption">{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
