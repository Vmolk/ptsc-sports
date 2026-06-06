# Hướng dẫn điền dữ liệu Google Sheet — QAQC Sport Tournament

> Sheet phải được **chia sẻ công khai** (Chia sẻ → Bất kỳ ai có đường liên kết → Người xem)  
> Mỗi tab dưới đây phải đặt **đúng tên** (chữ thường, không dấu cách thừa)

---

## 1. Tab `event` — Thông tin giải đấu

| key | value |
|-----|-------|
| name | QAQC SPORT TOURNAMENT |
| start_date | 2026-07-01T08:00:00+07:00 |
| end_date | 2026-07-02T17:00:00+07:00 |
| days | 2 |
| location | Vũng Tàu |
| organizer | QAQC |

**Lưu ý:**
- Cột A là `key`, cột B là `value` — không thêm cột khác
- `start_date` / `end_date` phải đúng format `YYYY-MM-DDTHH:MM:SS+07:00`
- `days` là số ngày thi đấu (chỉ điền số)

---

## 2. Tab `sports` — Danh sách môn thể thao

| id | name | icon | format | venue | category |
|----|------|------|--------|-------|----------|
| football | Bóng đá | ⚽ | Vòng bảng + KO | Sân cỏ | team |
| badminton | Cầu lông | 🏸 | Knock-out | Nhà thi đấu | individual,doubles |
| tabletennis | Bóng bàn | 🏓 | Knock-out | Hội trường | individual,doubles |
| volleyball | Bóng chuyền | 🏐 | Vòng bảng | Sân thi đấu | team |

**Lưu ý:**
- `id` — viết liền, không dấu, không khoảng trắng (dùng để liên kết với `matches`)
- `icon` — dán emoji trực tiếp vào ô
- `category` — các giá trị hợp lệ: `team`, `individual`, `doubles`, hoặc kết hợp `individual,doubles`

---

## 3. Tab `teams` — Danh sách đội / phòng ban

| id | name | short | color |
|----|------|-------|-------|
| ei | E&I | E&I | #3b82f6 |
| painting | Painting | PAI | #e63946 |
| dim | Dim | DIM | #2a9d8f |
| vattu | Vật tư | VT | #f59e0b |
| tonghop | Tổng hợp | TH | #8b5cf6 |
| ketkau | Kết cấu | KK | #f97316 |
| piping | Piping | PIP | #10b981 |

**Lưu ý:**
- `id` — viết liền, không dấu (dùng ở cột `home`/`away` trong `matches` và `team` trong `medals`)
- `short` — tối đa 4 ký tự, hiển thị trên ô màu trong bảng xếp hạng
- `color` — mã màu hex, có thể chọn tại [htmlcolorcodes.com](https://htmlcolorcodes.com)

---

## 4. Tab `matches` — Lịch thi đấu

| id | sport_id | home | away | home_score | away_score | date | time | day | round | venue | status |
|----|----------|------|------|------------|------------|------|------|-----|-------|-------|--------|
| m01 | football | ei | painting | 3 | 1 | 2026-07-01 | 07:30 | 1 | group | Sân cỏ | |
| m02 | badminton | ei | dim | 21 | 15 | 2026-07-01 | 08:00 | 1 | qf | Nhà thi đấu | |
| m03 | football | tonghop | ketkau | | | 2026-07-02 | 09:00 | 2 | final | Sân cỏ | |

**Giải thích từng cột:**

| Cột | Mô tả | Ví dụ |
|-----|-------|-------|
| `id` | Mã trận (duy nhất) | m01, m02... |
| `sport_id` | ID môn thể thao (lấy từ tab `sports`) | football, badminton |
| `home` | ID đội nhà (lấy từ tab `teams`) | ei, painting |
| `away` | ID đội khách (lấy từ tab `teams`) | dim, vattu |
| `home_score` | Tỉ số đội nhà — **để trống** nếu chưa đấu | 2 |
| `away_score` | Tỉ số đội khách — **để trống** nếu chưa đấu | 1 |
| `date` | Ngày thi đấu | 2026-07-01 |
| `time` | Giờ thi đấu (24h) | 08:30 |
| `day` | Ngày thứ mấy (1 hoặc 2) | 1 |
| `round` | Vòng đấu (xem bảng bên dưới) | group |
| `venue` | Địa điểm thi đấu | Sân cỏ |
| `status` | **Để trống** để tự tính, hoặc ghi đè thủ công | (để trống) |

**Các giá trị `round`:**

| Giá trị | Hiển thị |
|---------|----------|
| group | Vòng bảng |
| r16 | Vòng 1/8 |
| qf | Tứ kết |
| sf | Bán kết |
| 3rd | Tranh hạng 3 |
| final | Chung kết |

**Trạng thái tự động theo giờ (khi `status` để trống):**

| Thời điểm | Trạng thái hiển thị |
|-----------|-------------------|
| Chưa tới giờ | ⏳ Sắp diễn ra |
| Trong vòng 90 phút từ giờ bắt đầu | 🔴 Trực tiếp |
| Quá 90 phút | ✅ Kết thúc |

> Điền `finished` vào cột `status` để khoá kết thúc thủ công (dù chưa đủ 90 phút)

---

## 5. Tab `medals` — Huy chương đồng đội

| team | gold | silver | bronze |
|------|------|--------|--------|
| ei | 3 | 1 | 2 |
| painting | 2 | 3 | 1 |
| dim | 2 | 1 | 2 |
| vattu | 1 | 2 | 1 |
| tonghop | 1 | 1 | 3 |
| ketkau | 1 | 2 | 0 |
| piping | 0 | 1 | 2 |

**Lưu ý:**
- `team` — điền `id` của đội (lấy từ tab `teams`)
- Điểm tự tính: Vàng×3, Bạc×2, Đồng×1
- Bảng xếp hạng tự sắp xếp theo điểm → số vàng → số bạc

---

## 6. Tab `individual_medals` — Huy chương cá nhân

| athlete | dept | sport | medal |
|---------|------|-------|-------|
| Nguyễn Văn A | E&I | Cầu lông | gold |
| Nguyễn Văn A | E&I | Bóng bàn | silver |
| Trần Thị B | Painting | Cầu lông | silver |
| Lê Văn C | Dim | Bóng bàn | gold |

**Lưu ý:**
- `medal` chỉ nhận 3 giá trị: `gold`, `silver`, `bronze`
- 1 người thi **nhiều môn** → thêm **nhiều dòng** (mỗi dòng 1 huy chương)
- `dept` điền tên phòng ban để hiển thị trên bảng cá nhân

---

## 7. Tab `gallery` — Thư viện ảnh

| id | url | caption | day |
|----|-----|---------|-----|
| g1 | https://i.imgur.com/abc123.jpg | Lễ khai mạc | 1 |
| g2 | https://i.imgur.com/def456.jpg | Trận bóng đá mở màn | 1 |
| g3 | https://i.imgur.com/ghi789.jpg | Chung kết cầu lông | 2 |

**Lưu ý:**
- `url` — link ảnh trực tiếp (đuôi `.jpg`/`.png`). Khuyên dùng [imgbb.com](https://imgbb.com) để upload
- `day` — ảnh thuộc ngày 1 hay ngày 2 (dùng để filter)
- Để trống `url` sẽ không hiển thị ảnh

---

## 8. Tab `athletes` — Thống kê vận động viên *(không bắt buộc)*

| key | value |
|-----|-------|
| total | 210 |
| male | 134 |
| female | 76 |

---

## 9. Tab `participants` — Danh sách VĐV tham dự

| sport_id | team_id | name | category | jersey |
|----------|---------|------|----------|--------|
| football | dieu_khien | Phạm Minh Tuấn | Nam | 10 |
| football | han_ndt | Trần Minh Hoàng | Nam | 7 |
| badminton | dieu_khien | Nguyễn Văn A | Đơn | |
| pickleball | kich_thuoc | Hoàng A – Trần B | Đôi | |

**Giải thích từng cột:**

| Cột | Mô tả | Ví dụ |
|-----|-------|-------|
| `sport_id` | ID môn thể thao (lấy từ tab `sports`) | football, badminton, pickleball |
| `team_id` | ID đội/tổ (lấy từ tab `teams`) | dieu_khien, han_ndt |
| `name` | Tên VĐV (hoặc "Tên A – Tên B" cho cặp đôi) | Phạm Minh Tuấn |
| `category` | Nội dung thi đấu | Nam, Nữ, Đơn, Đôi |
| `jersey` | Số áo (để trống nếu không có) | 10 |

**Lưu ý:**
- Tên tab phải là **`participants`** (chính xác, không dấu cách thừa)
- Cặp đôi (pickleball/badminton đôi): điền `name` dạng `"Tên A – Tên B"` (dùng dấu `–` en-dash)
- `jersey` có thể để trống — chỉ hiện badge số áo khi có giá trị

---

## Checklist trước khi dùng

- [ ] Sheet đã **chia sẻ công khai** (Bất kỳ ai có đường liên kết → Người xem)
- [ ] Tên các tab đúng chính xác: `event`, `sports`, `teams`, `matches`, `medals`, `individual_medals`, `gallery`, `athletes`, `participants`
- [ ] `GOOGLE_SHEET_ID` đã điền trong Render → Environment variables
- [ ] Tab `event` có dòng `teams_count` = số đội thực tế nếu muốn override
