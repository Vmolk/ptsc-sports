/**
 * src/pages/Gallery.jsx
 * Photo gallery grouped by day. Each item links out to a Google Drive album.
 */
import { useState, useMemo } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

/* Colour palette used as tile backgrounds when no real photo is available */
const PALETTE = ['#1e3a5f','#2d1b69','#1a4731','#5c1a1a','#1a3c5c','#4a2c1a','#1f3a2e'];

export default function Gallery() {
  const { t } = useLanguage();
  const [day, setDay] = useState('');

  /* Fetch all items once, filter client-side so day chips are always visible */
  const { data: allData, loading, error } = useFetch(() => api.getGallery(), []);

  /* Unique sorted days from actual data */
  const availableDays = useMemo(() => {
    if (!allData) return [];
    return [...new Set(allData.map(g => g.day).filter(Boolean))].sort();
  }, [allData]);

  /* Client-side filter */
  const data = useMemo(() => {
    if (!allData) return [];
    return day ? allData.filter(g => g.day === day) : allData;
  }, [allData, day]);

  const handleOpen = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('page_gallery_title')}</h1>
          <p>{t('page_gallery_sub')}</p>
        </div>
      </header>

      <section className="section">
        <div className="container">

          {/* ---- Day filter (dynamic from data) ---- */}
          <div className="filters">
            <span className="filter-label">{t('filter_date')}</span>
            <button className={`chip ${day === '' ? 'active' : ''}`} onClick={() => setDay('')}>
              {t('all')}
            </button>
            {availableDays.map(d => (
              <button
                key={d}
                className={`chip ${day === d ? 'active' : ''}`}
                onClick={() => setDay(day === d ? '' : d)}
              >
                {d}
              </button>
            ))}
          </div>

          {loading && <Loading />}
          {error && <ErrorState message={error} />}
          {!loading && !error && data.length === 0 && <Empty label={t('no_photos')} />}

          {data && data.length > 0 && (
            <div className="gallery-grid">
              {data.map((g, i) => (
                <figure
                  className="gallery-item reveal"
                  key={g.id ?? i}
                  style={{
                    background: g.thumbnail
                      ? `url(${g.thumbnail}) center/cover no-repeat`
                      : `linear-gradient(135deg, ${PALETTE[i % PALETTE.length]}, var(--bg-900))`,
                    animationDelay: `${i * 50}ms`,
                    cursor: g.url ? 'pointer' : 'default',
                  }}
                  onClick={() => handleOpen(g.url)}
                  title={g.url ? 'Nhấn để mở album Google Drive' : ''}
                >
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

                  <span className="gallery-day">{g.day}</span>
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
