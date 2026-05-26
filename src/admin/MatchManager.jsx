import { useState, useEffect } from 'react';
import { adminApi } from '../utils/api.js';

const EMPTY = { sport_id: '', round: '', day: 1, match_time: '08:00', venue: '', home_team_id: '', away_team_id: '', home_score: '', away_score: '', status: 'upcoming' };
const STATUS_OPTS = ['upcoming', 'live', 'finished'];

export default function MatchManager() {
  const [items, setItems] = useState([]);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      adminApi.getMatches(),
      adminApi.getSports(),
      adminApi.getTeams(),
    ]).then(([m, s, t]) => { setItems(m); setSports(s); setTeams(t); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(EMPTY); setError(''); setModal('new'); };
  const openEdit = (item) => {
    setForm({
      sport_id: item.sport_id || item.sportId || '',
      round: item.round || '',
      day: item.day || 1,
      match_time: item.match_time || item.time || '08:00',
      venue: item.venue || '',
      home_team_id: item.home_team_id || item.home || '',
      away_team_id: item.away_team_id || item.away || '',
      home_score: item.home_score ?? item.homeScore ?? '',
      away_score: item.away_score ?? item.awayScore ?? '',
      status: item.status || 'upcoming',
    });
    setError(''); setModal(item);
  };
  const close = () => setModal(null);

  const save = async () => {
    setSaving(true); setError('');
    try {
      const payload = { ...form, home_score: form.home_score === '' ? null : +form.home_score, away_score: form.away_score === '' ? null : +form.away_score };
      if (modal === 'new') await adminApi.createMatch(payload);
      else await adminApi.updateMatch(modal.id, payload);
      close(); load();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!confirm('Xoá trận đấu này?')) return;
    try { await adminApi.deleteMatch(item.id); load(); } catch (e) { alert(e.message); }
  };

  const sportName = (id) => sports.find((s) => s.id === id)?.name || id;
  const teamName = (id) => teams.find((t) => t.id === id)?.name || id;

  const filtered = filterStatus ? items.filter((m) => m.status === filterStatus) : items;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Trận đấu</h1><p className="admin-page-subtitle">Quản lý lịch & kết quả thi đấu</p></div>
        <button className="btn btn-gold" onClick={openNew}>+ Thêm trận</button>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', gap: 8 }}>
            {['', ...STATUS_OPTS].map((s) => (
              <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterStatus(s)}>
                {s || 'Tất cả'}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '.8rem', color: '#889' }}>{filtered.length} trận</span>
        </div>
        {loading ? <div style={{ padding: 32, textAlign: 'center', color: '#889' }}>Đang tải...</div> : filtered.length === 0 ? (
          <div className="admin-empty"><span className="empty-icon">🎯</span><p>Chưa có trận đấu nào</p><button className="btn btn-primary" onClick={openNew}>Thêm trận đầu tiên</button></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Ngày</th><th>Giờ</th><th>Môn</th><th>Đội nhà</th><th>Tỷ số</th><th>Đội khách</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>Ngày {m.day}</td>
                  <td>{m.match_time || m.time || '—'}</td>
                  <td>{m.sportName || sportName(m.sport_id || m.sportId)}</td>
                  <td>{m.homeName || teamName(m.home_team_id || m.home)}</td>
                  <td><strong style={{ fontVariantNumeric: 'tabular-nums' }}>{m.home_score ?? m.homeScore ?? '—'} : {m.away_score ?? m.awayScore ?? '—'}</strong></td>
                  <td>{m.awayName || teamName(m.away_team_id || m.away)}</td>
                  <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                  <td><div className="actions"><button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}>✏️</button><button className="btn btn-danger btn-sm" onClick={() => remove(m)}>🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header"><h2>{modal === 'new' ? 'Thêm trận đấu' : 'Chỉnh sửa trận'}</h2><button className="modal-close" onClick={close}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-row">
                <div className="form-group"><label className="form-label">Môn thể thao</label><select className="form-control form-select" value={form.sport_id} onChange={(e) => setForm({ ...form, sport_id: e.target.value })}><option value="">-- Chọn --</option>{sports.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Vòng / Giai đoạn</label><input className="form-control" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} placeholder="Tứ kết" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Ngày thi đấu</label><input type="number" min={1} className="form-control" value={form.day} onChange={(e) => setForm({ ...form, day: +e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Giờ</label><input type="time" className="form-control" value={form.match_time} onChange={(e) => setForm({ ...form, match_time: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Địa điểm</label><input className="form-control" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Đội nhà</label><select className="form-control form-select" value={form.home_team_id} onChange={(e) => setForm({ ...form, home_team_id: e.target.value })}><option value="">-- Chọn --</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Đội khách</label><select className="form-control form-select" value={form.away_team_id} onChange={(e) => setForm({ ...form, away_team_id: e.target.value })}><option value="">-- Chọn --</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Bàn thắng đội nhà</label><input type="number" min={0} className="form-control" value={form.home_score} onChange={(e) => setForm({ ...form, home_score: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Bàn thắng đội khách</label><input type="number" min={0} className="form-control" value={form.away_score} onChange={(e) => setForm({ ...form, away_score: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Trạng thái</label><select className="form-control form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={close}>Huỷ</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
