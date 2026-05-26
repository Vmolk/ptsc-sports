/**
 * src/pages/Sports.jsx
 * Full list of sports disciplines with format, teams, and venue.
 */
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

export default function Sports() {
  const { t } = useLanguage();
  const { data, loading, error } = useFetch(() => api.getSports(), []);

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
          {error && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty />}
          {data && data.length > 0 && (
            <div className="sports-full">
              {data.map((s, i) => (
                <article
                  className="card sport-full-card reveal"
                  key={s.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="sport-full-head">
                    <span className="icon" aria-hidden="true">{s.icon}</span>
                    <h3>{s.name}</h3>
                  </div>
                  <div className="sport-detail">
                    <span>Thể thức</span><span>{s.format}</span>
                  </div>
                  <div className="sport-detail">
                    <span>Số đội</span><span>{s.teams || '—'}</span>
                  </div>
                  <div className="sport-detail">
                    <span>Địa điểm</span><span>{s.venue}</span>
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
