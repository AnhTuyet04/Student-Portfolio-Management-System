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
      activity:      '- Trưởng ban Nội dung Câu lạc bộ STEM trường St. Nicholas.\n- Tình nguyện viên chương trình "Áo ấm cho em 2025".',
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
    const sectionStyle  = 'margin-bottom:22px;page-break-inside:avoid;';
    const headingStyle  = 'font-size:11px;font-weight:800;color:#1a3a6b;text-transform:uppercase;letter-spacing:0.6px;border-left:3px solid #1a3a6b;padding-left:10px;margin-bottom:10px;';
    const labelStyle    = 'font-size:10px;color:#6B7280;margin-bottom:2px;';
    const valueStyle    = 'font-size:12px;color:#111827;font-weight:600;';
    const gridStyle     = 'display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;margin-bottom:12px;';
    const multiStyle    = 'font-size:11.5px;color:#374151;line-height:1.6;white-space:pre-line;background:#F9FAFB;padding:10px 12px;border-radius:6px;border:1px solid #E5E7EB;';
    const dividerStyle  = 'height:1px;background:#E5E7EB;margin:16px 0;';

    const row = (label, value) => `
      <div>
        <div style="${labelStyle}">${label}</div>
        <div style="${valueStyle}">${value || '—'}</div>
      </div>`;

    const section = (title, content) => `
      <div style="${sectionStyle}">
        <div style="${headingStyle}">${title}</div>
        ${content}
      </div>`;

    const multiField = (label, value) => `
      <div style="margin-bottom:12px;">
        <div style="${labelStyle}">${label}</div>
        <div style="${multiStyle}">${(value || '—').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
      </div>`;

    const now = new Date().toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });

    let sectionsHTML;
    if (compact) {
      // Tóm tắt 1 trang
      sectionsHTML = `
        ${section('Thông Tin Cá Nhân', `
          <div style="${gridStyle}">
            ${row('Họ và tên', data.fullname)}
            ${row('Ngày sinh', data.birthday)}
            ${row('Giới tính', data.gender)}
            ${row('Mã học sinh', data.studentCode)}
            ${row('Dân tộc / Tôn giáo', data.ethnicity)}
            ${row('Đoàn viên TNCS', data.party)}
          </div>
          ${row('Địa chỉ', data.address)}
        `)}
        <div style="${dividerStyle}"></div>
        ${section('Thành Tích & Chứng Chỉ Nổi Bật', `
          ${multiField('Thành tích', data.achievement)}
          ${multiField('Chứng chỉ', data.certificate)}
        `)}
        <div style="${dividerStyle}"></div>
        ${section('Kỹ Năng & Học Tập', `
          ${multiField('Kỹ năng & Năng lực mềm', data.skill)}
          ${multiField('Kết quả học tập', data.study)}
        `)}
        <div style="${dividerStyle}"></div>
        ${section('Mục Tiêu Phát Triển', `
          ${multiField('Ngắn hạn', data.goalShort)}
          ${multiField('Dài hạn', data.goalLong)}
        `)}`;
    } else {
      // Đầy đủ
      sectionsHTML = `
        ${section('I. Thông Tin Cá Nhân & Lý Lịch', `
          <div style="${gridStyle}">
            ${row('Họ và tên', data.fullname)}
            ${row('Ngày sinh', data.birthday)}
            ${row('Giới tính', data.gender)}
            ${row('Dân tộc / Tôn giáo', data.ethnicity)}
            ${row('Nơi sinh / Nguyên quán', data.origin)}
            ${row('Đoàn viên TNCS', data.party)}
            ${row('Diện chính sách', data.policy)}
            ${row('Mã học sinh', data.studentCode)}
          </div>
          <div style="margin-top:8px;">
            <div style="${labelStyle}">Địa chỉ thường trú</div>
            <div style="${valueStyle}">${data.address || '—'}</div>
          </div>
        `)}
        <div style="${dividerStyle}"></div>
        ${section('II. Thành Tích & Giải Thưởng', multiField('Nội dung thành tích', data.achievement))}
        <div style="${dividerStyle}"></div>
        ${section('III. Hoạt Động Ngoại Khóa & Sự Kiện', multiField('Hoạt động đã tham gia', data.activity))}
        <div style="${dividerStyle}"></div>
        ${section('IV. Chứng Chỉ Học Thuật & Kỹ Năng', multiField('Chứng chỉ', data.certificate))}
        <div style="${dividerStyle}"></div>
        ${section('V. Kỹ Năng & Năng Lực Mềm', multiField('Điểm mạnh & sở trường', data.skill))}
        <div style="${dividerStyle}"></div>
        ${section('VI. Học Tập & Kết Quả Năm Học', multiField('Kết quả học tập', data.study))}
        <div style="${dividerStyle}"></div>
        ${section('VII. Sản Phẩm Học Tập & Dự Án Sáng Tạo', multiField('Sản phẩm & dự án', data.product))}
        <div style="${dividerStyle}"></div>
        ${section('VIII. Lộ Trình Phát Triển Cá Nhân', multiField('Các cột mốc quan trọng', data.roadmap))}
        <div style="${dividerStyle}"></div>
        ${section('IX. Mục Tiêu Phát Triển', `
          ${multiField('Mục tiêu ngắn hạn (Học kỳ này)', data.goalShort)}
          ${multiField('Mục tiêu trung hạn (Năm học này)', data.goalMedium)}
          ${multiField('Mục tiêu dài hạn (3 – 5 năm)', data.goalLong)}
        `)}
        <div style="${dividerStyle}"></div>
        ${section('X. Cá Tính & Phương Pháp Học', `
          ${multiField('Sở thích & hoạt động yêu thích', data.hobby)}
          ${multiField('Môn học yêu thích nhất', data.favoriteSubject)}
          ${multiField('Phương pháp học hiệu quả nhất', data.studyMethod)}
        `)}`;
    }

    return `
      <div style="font-family:'Be Vietnam Pro',Arial,sans-serif;max-width:720px;margin:0 auto;padding:32px 40px;background:#fff;color:#111827;">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div>
            <div style="font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">
              HỒ SƠ NĂNG LỰC CÁ NHÂN${compact ? ' — TÓM TẮT' : ''}
            </div>
            <div style="font-size:22px;font-weight:800;color:#0F172A;line-height:1.2;">${data.fullname || 'Học Sinh'}</div>
            <div style="font-size:12px;color:#6B7280;margin-top:4px;">Mã học sinh: ${data.studentCode || '—'} &nbsp;|&nbsp; Lớp: 7A1 &nbsp;|&nbsp; Năm học: 2026 – 2027</div>
          </div>
          <div style="width:72px;height:72px;border-radius:16px;background:#EFF6FF;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#1a3a6b;flex-shrink:0;">
            ${(data.fullname || 'HS').split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0,2)}
          </div>
        </div>

        <!-- Accent bar -->
        <div style="height:3px;background:linear-gradient(90deg,#1a3a6b,#3B82F6,#60A5FA);border-radius:2px;margin-bottom:28px;"></div>

        <!-- Sections -->
        ${sectionsHTML}

        <!-- Footer -->
        <div style="margin-top:32px;padding-top:16px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:10px;color:#9CA3AF;">Hệ Thống Đào Tạo — Xuất ngày ${now}</div>
          <div style="font-size:10px;color:#9CA3AF;">Tài liệu nội bộ, không phổ biến</div>
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
      const data   = loadProfileData();
      const html   = buildPDFContent(data, compact);
      const el     = document.createElement('div');
      el.innerHTML = html;
      document.body.appendChild(el);

      setPDFLoading(true, 'Đang tạo tệp PDF…', 40);
      await new Promise(r => setTimeout(r, 120));

      const safeName = (data.fullname || 'HocSinh').replace(/\s+/g, '_');
      const suffix   = compact ? '_TomTat' : '_DayDu';
      const filename = `HoSoNangLuc_${safeName}${suffix}.pdf`;

      const opt = {
        margin:       [14, 14, 14, 14],
        filename,
        image:        { type: 'jpeg', quality: 0.97 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: compact ? 'a4' : 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css'] },
      };

      setPDFLoading(true, 'Đang kết xuất trang…', 70);
      await html2pdf().set(opt).from(el).save();
      setPDFLoading(true, 'Hoàn tất!', 100);

      document.body.removeChild(el);
      await new Promise(r => setTimeout(r, 600));

      window.SPMSToast?.show('success', 'Xuất PDF', `Đã tải xuống: ${filename}`, 3000);
    } catch (err) {
      console.error('[PDF Export]', err);
      window.SPMSToast?.show('error', 'Lỗi xuất PDF', 'Không thể tạo PDF. Vui lòng thử lại.', 3500);
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
