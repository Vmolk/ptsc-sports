/**
 * src/components/States.jsx
 * Tiny presentational components for loading / error / empty states.
 * Kept together because they're trivial and always used as a set.
 */

export function Loading({ label = 'Đang tải dữ liệu…' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" />
      {label}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="error-box" role="alert">
      ⚠️ {message || 'Không thể tải dữ liệu. Vui lòng thử lại.'}
    </div>
  );
}

export function Empty({ label = 'Chưa có dữ liệu.' }) {
  return <div className="empty">{label}</div>;
}
