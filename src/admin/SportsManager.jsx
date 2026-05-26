import { useState, useEffect } from 'react';
import { adminApi } from '../utils/api.js';

const EMPTY = { name: '', icon: '🏆', format: '', venue: '', teams_count: 0 };
const ICONS = ['⚽','🏸','🏓','🎾','🏐','♟️','🏃','🤝','🏀','🏈','🎱','🥊','🏊','🚴'];

export default function SportsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => { setLoading(true); adminApi.getSports().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setForm(EMPTY); setError(''); setModal('new'); };
  const openEdit = (item) => { setForm({ name: item.name || '', icon: item.icon || '🏆', format: item.format || '', venue: item.venue || '', teams_count: item.teams || item.teams_count || 0 }); setError(''); setModal(item); };
  const close = () => setModal(null);

  const save = async () => {
    if (!form.name.trim()) { setError('Tên môn thể thao không được để trống'); return; }
    setSaving(true); setError('');
    try {
      if (modal === 'new') await adminApi.createSport(form);
      else await adminApi.updateSport(modal.id, form);
      close(); load();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!confirm(`Xoá môn "${item.name}"?`)) return;
    try { await adminApi.deleteSport(item.id); load(); } catch (e) { alert(e.message); }
  };

  const filtered = items.filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Môn thể thao</h1><p className="admin-page-subtitle">Các môn thi đấu trong giải</p></div>
        <button className="btn btn-gold" onClick={openNew}>+ Thêm môn</button>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <input className="admin-search" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span style={{ fontSize: '.8rem', color: '#889' }}>{filtered.length} môn</span>
        </div>
        {loading ? <div style={{ padding: 32, textAlign: 'center', color: '#889' }}>Đang tải...</div> : filtered.length === 0 ? (
          <div className="admin-empty"><span className="empty-icon">⚽</span><p>Chưa có môn thể thao nào</p><button className="btn btn-primary" onClick={openNew}>Thêm môn đầu tiên</button></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Icon</th><th>Tên môn</th><th>Số đội</th><th>Thể thức</th><th>Địa điểm</th><th>Hành động</th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontSize: '1.4rem' }}>{s.icon}</td>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.teams || s.teams_count || 0}</td>
                  <td>{s.format || '—'}</td>
                  <td>{s.venue || '—'}</td>
                  <td><div className="actions"><button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>✏️ Sửa</button><button className="btn btn-danger btn-sm" onClick={() => remove(s)}>🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header"><h2>{modal === 'new' ? 'Thêm môn thể thao' : 'Chỉnh sửa'}</h2><button className="modal-close" onClick={close}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group"><label className="form-label">Tên môn *</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {ICONS.map((ic) => <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })} style={{ fontSize: '1.3rem', background: form.icon === ic ? '#0b1f3a' : '#f5f5f5', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>{ic}</button>)}
                </div>
                <input className="form-control" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Emoji hoặc text" />
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Số đội</label><input type="number" className="form-control" value={form.teams_count} onChange={(e) => setForm({ ...form, teams_count: +e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Thể thức</label><input className="form-control" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} placeholder="Loại trực tiếp" /></div>
              </div>
              <div className="form-group"><label className="form-label">Địa điểm</label><input className="form-control" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={close}>Huỷ</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
