/**
 * hoSoNL.js
 * Screen module: Hồ Sơ Năng Lực Cá Nhân
 * Manages profile view/edit mode, localStorage persistence, and update history modal.
 */

(function (global) {
  'use strict';

  let profileEditMode = false;

  // Key order must match the DOM order of .input-text elements
  const profileFieldKeys = [
    'fullname', 'birthday', 'gender', 'ethnicity', 'origin',
    'party', 'policy', 'studentCode', 'address',
    'achievement', 'activity', 'certificate', 'skill',
    'study', 'product', 'roadmap',
    'goalShort', 'goalMedium', 'goalLong',
    'hobby', 'favoriteSubject', 'studyMethod',
  ];

  function getProfileDefaults() {
    return {
      fullname:      'Nguyễn Văn Hoàng Anh',
      birthday:      '14 / 05 / 2010',
      gender:        'Nam',
      ethnicity:     'Kinh / Không',
      origin:        'Đà Nẵng, Việt Nam',
      party:         'Đã kết nạp (26/03/2026)',
      policy:        'Con thương binh (Ưu đãi A)',
      studentCode:   'HS101001',
      address:       '123 Lê Lợi, Phường Hải Châu I, Quận Hải Châu, Thành phố Đà Nẵng',
      achievement:   '- Giải Nhất cuộc thi Tin học trẻ cấp Thành phố 2025.\n- Danh hiệu Học sinh Xuất sắc toàn diện năm 2024 - 2025.',
      activity:      '- Trưởng ban Nội dung Câu lạc bộ STEM trường Nguyễn Văn Cừ.\n- Tình nguyện viên chương trình "Áo ấm cho em 2025".',
      certificate:   '- Chứng chỉ Cambridge KET / B1 Preliminary (Merit).\n- Khóa học Lập trình Python cơ bản - EduPortal.',
      skill:         '- Tư duy logic, giải quyết vấn đề toán học tốt.\n- Kỹ năng làm việc nhóm, thuyết trình trước đám đông tự tin.',
      study:         '- Điểm trung bình học kỳ I: 9.1/10 | Hạnh kiểm: Tốt.\n- Môn thế mạnh: Toán (9.6), Tiếng Anh (9.2), KHTN (9.0).',
      product:       '- Mô hình Robot dọn rác mini tự động (Dự án STEM).\n- Website sơ đồ tư duy môn Lịch sử địa phương Đà Nẵng.',
      roadmap:       '- 2024: Gia nhập CLB Tin học & STEM Trường.\n- 2025 - 2026: Đạt chứng chỉ B1 Tiếng Anh & Tham gia đội tuyển thi HSG cấp Quận.',
      goalShort:     'Hoàn thành tốt tất cả các bài kiểm tra giữa kỳ HK2 với kết quả điểm trên 9.0.',
      goalMedium:    'Đạt danh hiệu Học sinh Xuất sắc cuối năm; Đạt giải trong cuộc thi Khoa học Kỹ thuật trường.',
      goalLong:      'Thi đậu vào lớp chuyên Tin/Toán trường THPT Chuyên Lê Quý Đôn; Đạt IELTS 7.0+.',
      hobby:         'Đọc truyện khoa học viễn tưởng, chơi bóng đá cùng bạn bè cuối tuần.',
      favoriteSubject: 'Toán, Tiếng Anh, Khoa học tự nhiên, Tin học.',
      studyMethod:   'Học qua ví dụ thực tế, thực hành dự án nhóm và dùng sơ đồ tư duy.',
    };
  }

  function getProfileFieldNodes() {
    const container = document.getElementById('screen-hoSoNL');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.input-text'));
  }

  function renderProfileValues(data) {
    const nodes = getProfileFieldNodes();
    nodes.forEach((node, index) => {
      const key = profileFieldKeys[index];
      if (!key) return;
      node.textContent = data[key] ?? '';
    });
  }

  function saveProfileData(data) {
    localStorage.setItem('studentProfileData', JSON.stringify(data));
  }

  function loadProfileData() {
    const defaults = getProfileDefaults();
    const saved = localStorage.getItem('studentProfileData');
    if (!saved) return defaults;
    try {
      return { ...defaults, ...JSON.parse(saved) };
    } catch {
      return defaults;
    }
  }

  function populateProfileForm() {
    renderProfileValues(loadProfileData());
  }

  function updateProfileStatus(message, tone) {
    window.SPMSToast?.show(tone || 'info', 'Hồ sơ năng lực', message, 2400);
  }

  function showSystemInfo(message, tone) {
    updateProfileStatus(message, tone || 'info');
  }

  function setProfileEditMode(isEditing) {
    profileEditMode = isEditing;

    const container  = document.querySelector('#screen-hoSoNL .form-container');
    const actionBtn  = document.getElementById('profileActionBtn');
    const actionsBar = document.getElementById('profileActionsBar');
    const nodes      = getProfileFieldNodes();

    if (container)  container.classList.toggle('is-editing', isEditing);
    if (actionsBar) actionsBar.classList.toggle('is-visible', isEditing);

    if (actionBtn) {
      // Nút header chỉ hiện "Cập Nhật Hồ Sơ", ẩn đi khi đang edit
      // — việc Lưu / Hủy do action bar dưới đảm nhiệm
      actionBtn.style.visibility = isEditing ? 'hidden' : '';
    }

    nodes.forEach((node, index) => {
      const isEditable = isEditing && !!profileFieldKeys[index];
      node.setAttribute('contenteditable', isEditable ? 'true' : 'false');
      node.classList.toggle('is-editing', isEditable);
    });

    if (isEditing) {
      const firstNode = nodes.find(n => n.getAttribute('contenteditable') === 'true');
      if (firstNode) {
        firstNode.focus();
        const range = document.createRange();
        range.selectNodeContents(firstNode);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  function toggleProfileEdit() {
    if (!profileEditMode) {
      setProfileEditMode(true);
    }
  }

  function cancelProfileEdit() {
    populateProfileForm();
    setProfileEditMode(false);
    updateProfileStatus('Đã hủy chỉnh sửa, giữ nguyên dữ liệu trước đó.', 'info');
  }

  function saveProfile() {
    const nodes    = getProfileFieldNodes();
    const prevData = loadProfileData();
    const data     = getProfileDefaults();

    nodes.forEach((node, index) => {
      const key = profileFieldKeys[index];
      if (!key) return;
      data[key] = node.textContent.replace(/\n/g, '\n').trim();
    });

    saveProfileData(data);
    recordProfileHistory('save', data, prevData);
    setProfileEditMode(false);
    updateProfileStatus('Cập nhật hồ sơ thành công.', 'success');
  }

  function resetProfile() {
    const prevData = loadProfileData();
    const defaults = getProfileDefaults();
    renderProfileValues(defaults);
    saveProfileData(defaults);
    recordProfileHistory('reset', defaults, prevData);
    updateProfileStatus('Đã đặt lại về dữ liệu mặc định.', 'info');
  }

  /* ===== PROFILE HISTORY ENGINE ===== */
  const HISTORY_KEY = 'studentProfileHistory';
  const HISTORY_MAX = 50;

  const FIELD_LABELS = {
    fullname: 'Họ và tên',    birthday: 'Ngày sinh',      gender: 'Giới tính',
    ethnicity: 'Dân tộc',     origin: 'Nơi sinh',          party: 'Đoàn viên',
    policy: 'Diện chính sách', studentCode: 'Mã học sinh',  address: 'Địa chỉ',
    achievement: 'Thành tích', activity: 'Hoạt động',       certificate: 'Chứng chỉ',
    skill: 'Kỹ năng',          study: 'Học tập',             product: 'Sản phẩm',
    roadmap: 'Lộ trình',       goalShort: 'MT ngắn hạn',    goalMedium: 'MT trung hạn',
    goalLong: 'MT dài hạn',    hobby: 'Sở thích',           favoriteSubject: 'Môn yêu thích',
    studyMethod: 'Phương pháp học',
  };

  function loadProfileHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveProfileHistory(entries) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries)); } catch { /* quota */ }
  }

  function recordProfileHistory(action, newData, prevData) {
    const history = loadProfileHistory();

    const changedFields = Object.keys(FIELD_LABELS).filter(
      k => (newData[k] || '').trim() !== (prevData[k] || '').trim()
    );

    const entry = {
      id:            Date.now(),
      action,
      timestamp:     new Date().toISOString(),
      changedFields,
      snapshot:      { ...newData },
    };

    history.unshift(entry);
    if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
    saveProfileHistory(history);
  }

  function clearProfileHistory() {
    if (!confirm('Xóa toàn bộ lịch sử cập nhật? Hành động này không thể hoàn tác.')) return;
    localStorage.removeItem(HISTORY_KEY);
    renderHistoryModal();
    window.SPMSToast?.show('info', 'Lịch sử', 'Đã xóa toàn bộ lịch sử cập nhật.', 2200);
  }

  function formatHistoryTime(isoStr) {
    try {
      const d    = new Date(isoStr);
      const now  = new Date();
      const diff = (now - d) / 1000;
      if (diff < 60)    return 'Vừa xong';
      if (diff < 3600)  return `${Math.floor(diff / 60)} phút trước`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
      return d.toLocaleDateString('vi-VN');
    } catch { return isoStr; }
  }

  function formatHistoryTimeFull(isoStr) {
    try {
      const d    = new Date(isoStr);
      const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return `${time} — ${date}`;
    } catch { return isoStr; }
  }

  function renderHistoryModal() {
    const history  = loadProfileHistory();
    const empty    = document.getElementById('historyEmpty');
    const timeline = document.getElementById('historyTimeline');
    const totalEl  = document.getElementById('historyTotalCount');
    const lastEl   = document.getElementById('historyLastTime');
    const clearBtn = document.getElementById('historyClearBtn');
    const subtitle = document.getElementById('historySubtitle');

    if (totalEl) totalEl.textContent = history.length;
    if (lastEl)  lastEl.textContent  = history.length ? formatHistoryTime(history[0].timestamp) : 'Chưa có';
    if (clearBtn) clearBtn.style.display = history.length ? 'inline-flex' : 'none';

    if (subtitle) {
      let user = null;
      try { user = JSON.parse(sessionStorage.getItem('spms_user')); } catch {}
      subtitle.textContent = `Nhật ký thay đổi hồ sơ năng lực của ${user?.name || 'Nguyễn Văn Hoàng Anh'}`;
    }

    if (!timeline || !empty) return;

    if (history.length === 0) {
      empty.style.display    = 'flex';
      timeline.style.display = 'none';
      return;
    }

    empty.style.display    = 'none';
    timeline.style.display = 'block';

    timeline.innerHTML = history.map((entry, idx) => {
      const isLatest   = idx === 0;
      const isSave     = entry.action === 'save';
      const dotClass   = isLatest ? 'history-item__dot--latest' : isSave ? 'history-item__dot--save' : 'history-item__dot--reset';
      const badgeClass = isLatest ? 'history-item__badge--latest' : isSave ? 'history-item__badge--save' : 'history-item__badge--reset';
      const icon       = isSave ? 'fas fa-save' : 'fas fa-undo';
      const label      = isSave ? 'Đã lưu' : 'Đặt lại';
      const actionTxt  = isSave ? 'Cập nhật hồ sơ' : 'Đặt lại về mặc định';
      const itemClass  = isLatest ? 'history-item history-item--latest' : 'history-item';

      let changesHtml = '';
      if (entry.changedFields && entry.changedFields.length > 0) {
        const tags = entry.changedFields.slice(0, 8).map(f =>
          `<span class="history-change-tag history-change-tag--modified">${FIELD_LABELS[f] || f}</span>`
        ).join('');
        const more = entry.changedFields.length > 8
          ? `<span class="history-change-tag">+${entry.changedFields.length - 8} trường</span>`
          : '';
        changesHtml = `<div class="history-item__changes">${tags}${more}</div>`;
      } else if (isSave) {
        changesHtml = `<p class="history-item__no-change">Không có thay đổi so với lần lưu trước.</p>`;
      }

      return `
        <li class="${itemClass}" data-id="${entry.id}">
          <div class="history-item__dot ${dotClass}" aria-hidden="true">
            <i class="${icon}"></i>
          </div>
          <div class="history-item__card">
            <div class="history-item__top">
              <span class="history-item__action">${actionTxt}</span>
              <span class="history-item__badge ${badgeClass}">
                <i class="${icon}"></i> ${label}${isLatest ? ' · Gần nhất' : ''}
              </span>
            </div>
            <div class="history-item__time">
              <i class="fas fa-clock" style="margin-right:3px;"></i>
              ${formatHistoryTimeFull(entry.timestamp)}
            </div>
            ${changesHtml}
          </div>
        </li>`;
    }).join('');
  }

  function openProfileHistoryModal() {
    const modal = document.getElementById('profileHistoryModal');
    if (!modal) return;
    renderHistoryModal();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProfileHistoryModal() {
    const modal = document.getElementById('profileHistoryModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ── Module init ── */
  function init() {
    populateProfileForm();
    setProfileEditMode(false);
    initShareLink();
  }

  /* ===== EXPORT PDF ENGINE ===== */

  /**
   * Tạo nội dung HTML cho PDF từ dữ liệu hồ sơ hiện tại.
   * Sử dụng layout tĩnh, tự chứa (không phụ thuộc CSS bên ngoài).
   */
  function buildPDFContent(data, compact) {
    // ── Color palette — màu hệ thống ────────────────────────────────────
    const PRIMARY  = '#1a3a6b';   // --color-primary
    const PRI_L    = '#2a5298';   // --color-primary-light
    const ACCENT   = '#f37021';   // --color-accent
    const BG_PRI   = '#eef2f8';   // primary tint nhạt
    const BORDER   = '#d1d9e6';   // --color-border-strong
    const TEXT     = '#0f172a';   // --color-text-strong
    const MUTED    = '#6b7280';   // --color-text-muted
    const GREEN    = '#065f46';
    const GREEN_B  = '#d1fae5';

    const esc = (v) => String(v || '—')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const now = new Date();
    const nowStr  = now.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
    const nowTime = now.toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' });
    const initials = esc(data.fullname || 'HS').split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0,2);

    // Lấy thông tin từ DOM (lớp, mã số, trường từ page subtitle)
    const subtitleEl = document.querySelector('#screen-hoSoNL .page-subtitle');
    const subtitleText = subtitleEl ? subtitleEl.textContent : '';
    const classMatch = subtitleText.match(/Lớp:\s*([^\|]+)/);
    const codeMatch  = subtitleText.match(/Mã số:\s*([^\|]+)/);
    const className  = classMatch ? classMatch[1].trim() : '7A1';
    const studentCode = data.studentCode || (codeMatch ? codeMatch[1].trim() : '—');

    // ── Helpers ──────────────────────────────────────────────────────────
    let sectionIndex = 0;
    const section = (title, content, count) => {
      sectionIndex++;
      const num = String(sectionIndex).padStart(2, '0');
      const countBadge = count != null
        ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:${ACCENT};color:#fff;font-size:10px;font-weight:700;margin-left:8px;">${count}</span>`
        : '';
      return `
      <div style="margin-bottom:28px;page-break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <span style="font-size:18px;font-weight:800;color:${ACCENT};">${num}&nbsp;/</span>
          <span style="font-size:14px;font-weight:800;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.6px;">${title}</span>
          ${countBadge}
        </div>
        <div style="height:2px;background:${ACCENT};margin-bottom:14px;width:100%;"></div>
        ${content}
      </div>`;
    };

    const bulletLines = (text) => {
      if (!text || text === '—') return `<p style="color:${MUTED};font-style:italic;font-size:11px;">Chưa có thông tin.</p>`;
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        return `<div style="display:flex;gap:7px;margin-bottom:5px;font-size:12px;color:${TEXT};line-height:1.6;">
          <span style="color:${ACCENT};font-weight:700;flex-shrink:0;">·</span><span>${esc(clean)}</span>
        </div>`;
      }).join('');
    };

    const infoGrid = (items) => `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin-bottom:12px;">
        ${items.map(([label, val]) => `
          <div>
            <div style="font-size:9.5px;color:${MUTED};margin-bottom:1px;">${label}</div>
            <div style="font-size:12px;font-weight:600;color:${TEXT};line-height:1.4;">${esc(val)}</div>
          </div>`).join('')}
      </div>`;

    const achievementCard = (title, meta, desc) => `
      <div style="border-left:3px solid ${PRIMARY};padding:10px 14px;margin-bottom:12px;background:${BG_PRI};">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:13px;font-weight:700;color:${PRIMARY};">${esc(title)}</span>
          <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;background:${GREEN_B};color:${GREEN};">✓ ĐÃ XÁC NHẬN</span>
        </div>
        <div style="font-size:10.5px;color:${MUTED};margin-bottom:5px;">${meta}</div>
        <div style="font-size:11.5px;color:${TEXT};line-height:1.55;">${esc(desc)}</div>
      </div>`;

    const gradeTable = (rows) => `
      <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
        <thead>
          <tr style="background:${BG_PRI};">
            <th style="text-align:left;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">Môn học</th>
            <th style="text-align:center;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">HK1</th>
            <th style="text-align:center;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">HK2</th>
            <th style="text-align:center;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">Cả năm</th>
            <th style="text-align:left;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">Xếp loại</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr style="background:${i % 2 === 0 ? '#fff' : BG_PRI};">
              <td style="padding:6px 10px;color:${TEXT};">${esc(r[0])}</td>
              <td style="padding:6px 10px;text-align:center;color:${MUTED};">${esc(r[1])}</td>
              <td style="padding:6px 10px;text-align:center;color:${MUTED};">${esc(r[2])}</td>
              <td style="padding:6px 10px;text-align:center;font-weight:700;color:${PRIMARY};">${esc(r[3])}</td>
              <td style="padding:6px 10px;color:${TEXT};">${esc(r[4])}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    const timelineItem = (date, type, title, desc) => `
      <div style="display:flex;gap:14px;margin-bottom:16px;">
        <div style="text-align:right;min-width:44px;flex-shrink:0;">
          <div style="font-size:13px;font-weight:700;color:${TEXT};">${esc(date.split('/')[0]+'/'+date.split('/')[1])}</div>
          <div style="font-size:10px;color:${MUTED};">${esc(date.split('/')[2] || '')}</div>
        </div>
        <div style="position:relative;padding-left:18px;border-left:2px solid ${BORDER};">
          <div style="position:absolute;left:-6px;top:4px;width:10px;height:10px;border-radius:50%;background:${PRIMARY};border:2px solid #fff;"></div>
          <div style="font-size:9px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;">${esc(type)}</div>
          <div style="font-size:12px;font-weight:700;color:${TEXT};line-height:1.4;">${esc(title)}</div>
          ${desc ? `<div style="font-size:11px;color:${MUTED};margin-top:2px;">${esc(desc)}</div>` : ''}
        </div>
      </div>`;

    const hobbyTags = (text) => {
      if (!text || text === '—') return '';
      return text.split(/[,，、]/).map(t => t.trim()).filter(Boolean).map(t =>
        `<span style="display:inline-block;padding:3px 10px;border-radius:4px;background:${BG_PRI};color:${PRIMARY};font-size:11px;margin:2px 3px;">${esc(t)}</span>`
      ).join('');
    };

    // ── Parse bullet text into achievement cards ──────────────────────
    const parseAchievements = (text) => {
      if (!text) return '';
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        const parts = clean.split(/[.。]/);
        const title = parts[0].trim();
        const desc  = parts.slice(1).join('.').trim();
        return achievementCard(title, '· Hồ sơ năng lực', desc || title);
      }).join('');
    };

    const parseActivities = (text) => {
      if (!text) return '';
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        return `<div style="border-left:3px solid ${ACCENT};padding:8px 12px;margin-bottom:10px;background:${BG_PRI};">
          <div style="font-size:13px;font-weight:700;color:${PRIMARY};">${esc(clean)}</div>
          <div style="font-size:10.5px;color:${MUTED};margin-top:3px;">Club · Năm học 2025–2026</div>
        </div>`;
      }).join('');
    };

    const parseCertificates = (text) => {
      if (!text) return '';
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        return `<div style="border-left:3px solid ${MUTED};padding:8px 12px;margin-bottom:10px;background:#f9fafb;">
          <div style="font-size:13px;font-weight:700;color:${PRIMARY};">${esc(clean)}</div>
        </div>`;
      }).join('');
    };

    // ── Grade rows mock (sẽ thay bằng data thực khi có) ─────────────
    const gradeRows = [
      ['Toán học',           '—', '—', data.study ? data.study.match(/Toán\s*\(([^)]+)\)/)?.[1] || '—' : '—', '—'],
      ['Ngữ văn',            '—', '—', '—', '—'],
      ['Tiếng Anh',          '—', '—', data.study ? data.study.match(/Tiếng Anh\s*\(([^)]+)\)/)?.[1] || '—' : '—', '—'],
      ['Khoa học tự nhiên',  '—', '—', data.study ? data.study.match(/KHTN\s*\(([^)]+)\)/)?.[1] || '—' : '—', '—'],
    ];

    // ── Build timeline from roadmap text ──────────────────────────────
    const buildTimeline = (roadmap, achievement, goalShort) => {
      const items = [];
      if (roadmap) {
        roadmap.split('\n').forEach(line => {
          const clean = line.replace(/^[-•]\s*/, '').trim();
          if (!clean) return;
          const yearMatch = clean.match(/(\d{4})/);
          const year = yearMatch ? yearMatch[1] : '2026';
          items.push(timelineItem(`01/01/${year}`, 'Lộ trình · Cột mốc', clean, ''));
        });
      }
      if (goalShort) items.push(timelineItem(`01/01/2026`, 'Mục tiêu · Ngắn hạn', goalShort, ''));
      return items.join('');
    };

    // ── Count bullets ─────────────────────────────────────────────────
    const countLines = (text) => text ? text.split('\n').filter(l => l.trim()).length : 0;

    // ── Intro section content ─────────────────────────────────────────
    const introHTML = `
      <p style="font-size:12px;color:${TEXT};line-height:1.7;margin-bottom:10px;">${esc(data.studyMethod || '')}</p>
      <p style="font-size:11.5px;margin-bottom:3px;"><strong style="color:${PRIMARY};">Mục tiêu ngắn hạn:</strong> ${esc(data.goalShort)}</p>
      <p style="font-size:11.5px;margin-bottom:3px;"><strong style="color:${PRIMARY};">Mục tiêu trung hạn:</strong> ${esc(data.goalMedium)}</p>
      <p style="font-size:11.5px;margin-bottom:8px;"><strong style="color:${PRIMARY};">Mục tiêu dài hạn:</strong> ${esc(data.goalLong)}</p>
      <p style="font-size:11.5px;margin-bottom:4px;"><strong style="color:${PRIMARY};">Sở thích:</strong></p>
      <div>${hobbyTags(data.hobby)}</div>`;

    // ── Full layout ───────────────────────────────────────────────────
    sectionIndex = 0;
    const body = `
      ${section('GIỚI THIỆU', introHTML)}
      ${section('THÀNH TÍCH', parseAchievements(data.achievement), countLines(data.achievement))}
      ${section('HOẠT ĐỘNG', parseActivities(data.activity), countLines(data.activity))}
      ${section('CHỨNG CHỈ', parseCertificates(data.certificate), countLines(data.certificate))}
      ${section('KẾT QUẢ HỌC TẬP', gradeTable(gradeRows), gradeRows.length)}
      ${section('DÒNG THỜI GIAN', buildTimeline(data.roadmap, data.achievement, data.goalShort), countLines(data.roadmap))}
    `;

    return `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;background:#fff;color:${TEXT};">

        <!-- HEADER -->
        <div style="background:${PRIMARY};padding:28px 36px 22px;margin-bottom:0;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
            <div style="font-size:9px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:1.5px;">Hệ Thống Đào Tạo · Smart Portfolio</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.7);">Xuất ngày ${nowStr}</div>
          </div>
          <div style="font-size:32px;font-weight:800;color:#fff;line-height:1.15;margin:10px 0 6px;">${esc(data.fullname || 'Học sinh')}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.85);">
            Mã HS: ${esc(studentCode)} &nbsp;·&nbsp; Lớp: ${esc(className)} &nbsp;·&nbsp; Năm học: 2025–2026
          </div>
        </div>

        <!-- QUOTE -->
        <div style="padding:16px 36px;border-bottom:1px solid ${BORDER};">
          <p style="font-style:italic;color:${MUTED};font-size:12px;margin:0;">"${esc(data.hobby ? 'Mỗi ngày cố gắng hơn ngày hôm qua.' : 'Mỗi ngày cố gắng hơn ngày hôm qua.')}"</p>
        </div>

        <!-- BODY -->
        <div style="padding:24px 36px 32px;">
          ${body}
        </div>

        <!-- FOOTER -->
        <div style="border-top:1px solid ${BORDER};padding:8px 36px;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:9px;color:${MUTED};">Hệ Thống Đào Tạo — Smart Portfolio</div>
          <div style="font-size:9px;color:${MUTED};">Xuất ${nowStr} ${nowTime} (GMT+7)</div>
          <div style="font-size:9px;color:${MUTED};">Trang 1</div>
        </div>

      </div>`;
  }

  function setPDFLoading(visible, desc, pct) {
    const overlay = document.getElementById('pdfLoadingOverlay');
    const descEl  = document.getElementById('pdfLoadingDesc');
    const bar     = document.getElementById('pdfLoadingBar');
    if (!overlay) return;
    if (visible) {
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
    } else {
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
    }
    if (desc && descEl)  descEl.textContent = desc;
    if (bar != null && pct !== undefined) bar.style.width = pct + '%';
  }

  async function runExportPDF(compact) {
    const btn = document.getElementById('exportPdfBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xuất…'; }

    setPDFLoading(true, 'Chuẩn bị nội dung hồ sơ…', 10);

    try {
      const data     = loadProfileData();
      const content  = buildPDFContent(data, compact);
      const safeName = (data.fullname || 'HocSinh').replace(/\s+/g, '_');
      const suffix   = compact ? '_TomTat' : '_DayDu';
      const filename = `HoSoNangLuc_${safeName}${suffix}`;

      setPDFLoading(true, 'Đang mở cửa sổ xuất…', 50);

      // Wrap nội dung thành trang HTML hoàn chỉnh có @media print
      const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${filename}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, 'Segoe UI', sans-serif; background: #fff; }
    @media print {
      @page { size: A4 portrait; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>${content}</body>
</html>`;

      setPDFLoading(true, 'Đang tạo tệp…', 70);

      // Mở popup để print → Save as PDF
      const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
      if (!win) {
        // Popup bị chặn — fallback: tải về HTML
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = filename + '.html';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        window.SPMSToast?.show('info', 'Lưu ý', 'Popup bị chặn. Đã tải file HTML — mở bằng Chrome và dùng Ctrl+P để lưu PDF.', 5000);
        return;
      }

      win.document.open();
      win.document.write(fullHtml);
      win.document.close();

      // Chờ ảnh/font load xong rồi tự mở print dialog
      win.onload = () => {
        setTimeout(() => {
          win.focus();
          win.print();
        }, 400);
      };

      setPDFLoading(true, 'Hoàn tất!', 100);
      await new Promise(r => setTimeout(r, 800));
      window.SPMSToast?.show('success', 'Xuất hồ sơ', 'Cửa sổ in đã mở. Chọn "Save as PDF" để lưu.', 4000);

    } catch (err) {
      console.error('[PDF Export]', err);
      window.SPMSToast?.show('error', 'Lỗi xuất hồ sơ', 'Không thể tạo tệp. Vui lòng thử lại.', 3500);
    } finally {
      setPDFLoading(false);
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-pdf"></i> Xuất PDF'; }
    }
  }

  function exportProfilePDF()        { runExportPDF(false); }
  function exportProfilePDFCompact() { runExportPDF(true);  }

  /* ===== SHARE ENGINE ===== */

  const SHARE_BASE = window.location.origin + window.location.pathname;

  function buildShareURL() {
    const data      = loadProfileData();
    const isPublic  = document.getElementById('sharePublicToggle')?.checked ?? true;
    const hasExpiry = document.getElementById('shareExpiryToggle')?.checked ?? false;
    const params    = new URLSearchParams({
      view:    'hoSoNL',
      student: data.studentCode || 'HS101001',
      name:    data.fullname    || 'Nguyen Van Hoanh Anh',
      pub:     isPublic  ? '1' : '0',
    });
    if (hasExpiry) {
      const exp = new Date();
      exp.setDate(exp.getDate() + 7);
      params.set('exp', exp.toISOString().slice(0, 10));
    }
    return `${SHARE_BASE}?${params.toString()}`;
  }

  function initShareLink() {
    // Precompute QR khi module khởi động (tạo thêm tốc độ khi mở modal)
  }

  function refreshShareLink() {
    const url = buildShareURL();
    const el  = document.getElementById('shareLinkUrl');
    if (el) el.textContent = url;
    generateQRCode(url);
  }

  async function generateQRCode(url) {
    const canvas = document.getElementById('shareQrCanvas');
    if (!canvas) return;

    // Dùng QR bằng Google Charts API (không cần thư viện thêm)
    const size     = 140;
    const apiUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=FFFFFF&color=1a3a6b&margin=4`;
    const frame    = document.getElementById('shareQrFrame');
    if (!frame) return;

    // Thay canvas bằng img từ API (đơn giản và đáng tin cậy hơn)
    let img = frame.querySelector('img.qr-img');
    if (!img) {
      img = document.createElement('img');
      img.className   = 'qr-img';
      img.alt         = 'QR Code hồ sơ năng lực';
      img.style.cssText = 'width:140px;height:140px;border-radius:8px;display:block;';
      frame.innerHTML = '';
      frame.appendChild(img);
    }
    img.src = apiUrl;
  }

  function openShareModal() {
    const modal = document.getElementById('shareProfileModal');
    if (!modal) return;

    // Cập nhật tên học sinh trong modal
    const data = loadProfileData();
    const nameEl = document.getElementById('shareStudentName');
    if (nameEl) nameEl.textContent = data.fullname || 'Học Sinh';

    // Cập nhật link & QR
    const url = buildShareURL();
    const el  = document.getElementById('shareLinkUrl');
    if (el) el.textContent = url;
    generateQRCode(url);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeShareModal() {
    const modal = document.getElementById('shareProfileModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function copyShareLink() {
    const url = buildShareURL();
    const btn = document.getElementById('copyLinkBtn');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopyBtnSuccess(btn);
      }).catch(() => fallbackCopy(url, btn));
    } else {
      fallbackCopy(url, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); setCopyBtnSuccess(btn); } catch {}
    document.body.removeChild(ta);
  }

  function setCopyBtnSuccess(btn) {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Đã sao chép';
    btn.classList.add('share-link-copy-btn--success');
    window.SPMSToast?.show('success', 'Sao chép', 'Đã sao chép liên kết chia sẻ.', 2200);
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.classList.remove('share-link-copy-btn--success');
    }, 2200);
  }

  function shareViaEmail() {
    const data    = loadProfileData();
    const url     = buildShareURL();
    const subject = encodeURIComponent(`Hồ sơ năng lực: ${data.fullname || 'Học sinh'}`);
    const body    = encodeURIComponent(
      `Xin chào,\n\nTôi muốn chia sẻ hồ sơ năng lực cá nhân.\n\nXem hồ sơ tại: ${url}\n\nTrân trọng,\n${data.fullname || ''}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }

  function shareViaZalo() {
    const url = encodeURIComponent(buildShareURL());
    // Zalo Share API (open in new tab)
    window.open(`https://zalo.me/share/url?url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=500');
  }

  function shareViaFacebook() {
    const url = encodeURIComponent(buildShareURL());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer,width=600,height=500');
  }

  async function shareViaNative() {
    const data = loadProfileData();
    const url  = buildShareURL();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hồ Sơ Năng Lực — ${data.fullname || 'Học Sinh'}`,
          text:  `Xem hồ sơ năng lực của ${data.fullname || 'học sinh'} tại đây:`,
          url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          window.SPMSToast?.show('info', 'Chia sẻ', 'Không thể mở hộp thoại chia sẻ.', 2500);
        }
      }
    } else {
      copyShareLink();
    }
  }

  function downloadQRCode() {
    const frame = document.getElementById('shareQrFrame');
    if (!frame) return;
    const img = frame.querySelector('img.qr-img');
    if (!img || !img.src) return;

    // Tải ảnh QR qua fetch để không bị chặn bởi CORS
    fetch(img.src)
      .then(r => r.blob())
      .then(blob => {
        const a    = document.createElement('a');
        a.href     = URL.createObjectURL(blob);
        a.download = 'QR_HoSoNangLuc.png';
        a.click();
        URL.revokeObjectURL(a.href);
        window.SPMSToast?.show('success', 'Tải QR', 'Đã tải mã QR về thiết bị.', 2200);
      })
      .catch(() => {
        window.SPMSToast?.show('info', 'QR', 'Nhấn chuột phải vào ảnh QR và chọn "Lưu ảnh".', 3000);
      });
  }

  // Expose module API
  global.StudentHoSoNLModule = {
    init,
    openProfileHistoryModal,
    closeProfileHistoryModal,
  };

  // Expose globals for inline HTML onclick attributes
  global.toggleProfileEdit        = toggleProfileEdit;
  global.cancelProfileEdit        = cancelProfileEdit;
  global.saveProfile              = saveProfile;
  global.resetProfile             = resetProfile;
  global.openProfileHistoryModal  = openProfileHistoryModal;
  global.closeProfileHistoryModal = closeProfileHistoryModal;
  global.clearProfileHistory      = clearProfileHistory;
  global.showSystemInfo           = showSystemInfo;

  // PDF & Share
  global.exportProfilePDF         = exportProfilePDF;
  global.exportProfilePDFCompact  = exportProfilePDFCompact;
  global.openShareModal           = openShareModal;
  global.closeShareModal          = closeShareModal;
  global.copyShareLink            = copyShareLink;
  global.refreshShareLink         = refreshShareLink;
  global.shareViaEmail            = shareViaEmail;
  global.shareViaZalo             = shareViaZalo;
  global.shareViaFacebook         = shareViaFacebook;
  global.shareViaNative           = shareViaNative;
  global.downloadQRCode           = downloadQRCode;

})(window);
