import { useState, useEffect } from 'react';
import { adminApi } from '../utils/api.js';

const EMPTY = { name: '', description: '', start_date: '', end_date: '', location: '', status: 'upcoming', banner_url: '' };
const STATUS_OPTS = ['upcoming', 'live', 'finished', 'cancelled'];

export default function TournamentManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => { setLoading(true); adminApi.getTournaments().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setForm(EMPTY); setError(''); setModal('new'); };
  const openEdit = (item) => {
    setForm({ name: item.name || '', description: item.description || '',
      start_date: item.start_date ? item.start_date.slice(0,16) : '',
      end_date: item.end_date ? item.end_date.slice(0,16) : '',
      location: item.location || '', status: item.status || 'upcoming', banner_url: item.banner_url || '' });
    setError(''); setModal(item);
  };
  const close = () => setModal(null);

  const save = async () => {
    if (!form.name.trim()) { setError('Tên giải đấu không được để trống'); return; }
    setSaving(true); setError('');
    try {
      if (modal === 'new') await adminApi.createTournament(form);
      else await adminApi.updateTournament(modal.id, form);
      close(); load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!confirm(`Xoá giải đấu "${item.name}"?`)) return;
    try { await adminApi.deleteTournament(item.id); load(); } catch (e) { alert(e.message); }
  };

  const filtered = items.filter((t) => t.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Giải đấu</h1><p className="admin-page-subtitle">Quản lý tất cả giải đấu</p></div>
        <button className="btn btn-gold" onClick={openNew}>+ Thêm giải đấu</button>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <input className="admin-search" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span style={{ fontSize: '.8rem', color: '#889' }}>{filtered.length} giải đấu</span>
        </div>
        {loading ? <div style={{ padding: 32, textAlign: 'center', color: '#889' }}>Đang tải...</div> : filtered.length === 0 ? (
          <div className="admin-empty"><span className="empty-icon">🏆</span><p>Chưa có giải đấu nào</p><button className="btn btn-primary" onClick={openNew}>Tạo giải đấu đầu tiên</button></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Tên</th><th>Thời gian</th><th>Địa điểm</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong>{t.description && <div style={{ fontSize: '.75rem', color: '#889', marginTop: 2 }}>{t.description.slice(0,60)}…</div>}</td>
                  <td style={{ fontSize: '.8rem' }}>{t.start_date ? new Date(t.start_date).toLocaleDateString('vi-VN') : '—'}</td>
                  <td>{t.location || '—'}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td><div className="actions"><button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>✏️ Sửa</button><button className="btn btn-danger btn-sm" onClick={() => remove(t)}>🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header">
              <h2>{modal === 'new' ? 'Thêm giải đấu' : 'Chỉnh sửa giải đấu'}</h2>
              <button className="modal-close" onClick={close}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group"><label className="form-label">Tên giải đấu *</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="QAQC Sport Tournament 2026" /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Ngày bắt đầu</label><input type="datetime-local" className="form-control" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Ngày kết thúc</label><input type="datetime-local" className="form-control" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Địa điểm</label><input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Trạng thái</label><select className="form-control form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="form-label">Banner URL</label><input className="form-control" value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} placeholder="https://..." />{form.banner_url && <img src={form.banner_url} alt="" className="img-preview" onError={(e) => e.target.style.display='none'} />}</div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={close}>Huỷ</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
