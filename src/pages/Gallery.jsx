/**
 * src/pages/Gallery.jsx
 * Photo gallery with day filter. Uses styled gradient tiles as
 * placeholders (no external image dependency needed for the demo).
 */
import { useState } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

export default function Gallery() {
  const { t } = useLanguage();
  const [day, setDay] = useState('');
  const { data, loading, error } = useFetch(
    () => api.getGallery(day || undefined),
    [day]
  );

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('nav_gallery')}</h1>
          <p>Khoảnh khắc đáng nhớ của hội thao</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="filters">
            <button className={`chip ${day === '' ? 'active' : ''}`} onClick={() => setDay('')}>Tất cả</button>
            <button className={`chip ${day === '1' ? 'active' : ''}`} onClick={() => setDay('1')}>Ngày 1</button>
            <button className={`chip ${day === '2' ? 'active' : ''}`} onClick={() => setDay('2')}>Ngày 2</button>
          </div>

          {loading && <Loading />}
          {error && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty label="Chưa có ảnh." />}

          {data && data.length > 0 && (
            <div className="gallery-grid">
              {data.map((g, i) => (
                <figure
                  className="gallery-item reveal"
                  key={g.id}
                  style={{
                    background: `linear-gradient(135deg, ${g.color}, var(--navy-800))`,
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <span className="gallery-day">Ngày {g.day}</span>
                  <figcaption className="gallery-caption">{g.title}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
