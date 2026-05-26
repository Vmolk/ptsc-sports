/**
 * src/pages/NotFound.jsx
 * Friendly 404 page for unknown routes.
 */
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', textAlign: 'center', padding: 40 }}>
      <div>
        <h1 style={{ fontSize: '5rem', color: 'var(--navy-800)' }}>404</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Không tìm thấy trang bạn yêu cầu.</p>
        <Link to="/" className="btn btn-primary">Về trang chủ</Link>
      </div>
    </div>
  );
}
