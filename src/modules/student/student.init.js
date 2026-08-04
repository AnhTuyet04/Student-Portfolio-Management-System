/**
 * student.init.js
 * Bootstrap module: auth guard, sidebar navigation, screen manager.
 * Coordinates all student screen modules.
 */

/* ===== AUTH GUARD ===== */

// STUDENT_PROFILE được khởi tạo lazy sau khi session có sẵn — không set tại load time
let _cachedProfile = null;

function getCurrentStudentProfile() {
  if (_cachedProfile) return _cachedProfile;

  let user = {};
  try { user = JSON.parse(sessionStorage.getItem('spms_user')) || {}; } catch { /* ignore */ }

  // Tra cứu theo userId → id → username, theo thứ tự ưu tiên
  const lookupKey = user.userId || user.id || user.username || '';
  const databaseProfile = lookupKey
    ? (window.SPMSSelectors?.studentProfile(lookupKey) || null)
    : null;

  _cachedProfile = {
    // Tên: ưu tiên database, fallback session — KHÔNG dùng default hardcode
    fullName:        databaseProfile?.fullName        || user.name        || '',
    studentCode:     databaseProfile?.studentCode     || '',
    studentId:       databaseProfile?.studentId       || '',
    className:       databaseProfile?.className       || '',
    classId:         databaseProfile?.classId         || '',
    birthday:        databaseProfile?.birthday        || '',
    gender:          databaseProfile?.gender          || '',
    ethnicity:       databaseProfile?.ethnicity       || '',
    origin:          databaseProfile?.origin          || '',
    party:           databaseProfile?.party           || '',
    policy:          databaseProfile?.policy          || '',
    address:         databaseProfile?.address         || '',
    schoolYear:      databaseProfile?.schoolYear      || '',
    educationSystem: databaseProfile?.educationSystem || 'Chính quy THCS',
    homeroomTeacher: databaseProfile?.homeroomTeacher || '',
    username:        databaseProfile?.username        || user.username || '',
    email:           databaseProfile?.email           || user.email    || '',
    role:            user.role || 'Học sinh',
    enrollmentDate:  databaseProfile?.enrollmentDate  || '',
  };

  // Expose toàn cục để các module khác dùng
  window.STUDENT_PROFILE = _cachedProfile;
  return _cachedProfile;
}

/**
 * loadStudentData()
 * ─────────────────────────────────────────────────────────────
 * Hàm trung tâm: đọc toàn bộ data của học sinh đang đăng nhập
 * từ spms_database (localStorage) rồi render lên UI.
 *
 * Luồng:
 *   spms_database → getCurrentStudentProfile()
 *                → renderProfile()       — tên, lớp, GVCN, sidebar cards
 *                → renderPersonalInfo()  — ngày sinh, địa chỉ, data-field
 *                → renderFamilyInfo()    — thông tin gia đình
 *                → renderAttendance()    — chuyên cần
 *                -> renderAchievements() — thành tích
 *                → renderGrades()        — kết quả học tập
 *                → renderTKB()          — thời khóa biểu
 *                → renderExams()        — lịch thi
 */
function loadStudentData() {
  const db  = window.SPMSDatabase;
  const sel = window.SPMSSelectors;
  if (!db || !sel) return;

  // Reset cache để lấy profile mới nhất từ database
  _cachedProfile = null;
  const profile = getCurrentStudentProfile();

  // ── Helper ghi vào [data-field] ──────────────────────────────
  const setField = (field, value, scope) => {
    if (value === null || value === undefined) return;
    const selector = scope
      ? `${scope} [data-field="${field}"]`
      : `[data-field="${field}"]`;
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = value;
    });
  };

  const setId = (id, value) => {
    if (!value && value !== 0) return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  // ── 1. PROFILE — tên, mã số, lớp, GVCN ──────────────────────
  renderProfileUI(profile, setField, setId);

  // Nếu không có student record thì dừng ở đây,
  // các section khác hiển thị empty state
  if (!profile.studentId) {
    renderEmptyStates();
    return;
  }

  // ── 2. THÔNG TIN CÁ NHÂN ─────────────────────────────────────
  renderPersonalInfo(profile, setField);

  // ── 3. THÔNG TIN GIA ĐÌNH ────────────────────────────────────
  renderFamilyInfo(profile, db, setField);

  // ── 4. CHUYÊN CẦN ────────────────────────────────────────────
  renderAttendance(profile, sel, setField, setId);

  // ── 5. THÀNH TÍCH ─────────────────────────────────────────────
  renderAchievements(profile, sel, setId);

  // ── 6. KẾT QUẢ HỌC TẬP ──────────────────────────────────────
  renderGrades(profile, db, sel, setId);

  // ── 7. TKB ───────────────────────────────────────────────────
  if (window.StudentTKBModule?.init) window.StudentTKBModule.init();

  // ── 8. LỊCH THI ──────────────────────────────────────────────
  if (window.StudentLichThiModule?.render) window.StudentLichThiModule.render();
}

/* ─────────────────────────────────────────────────────────────
   CÁC HÀM RENDER CON
   ───────────────────────────────────────────────────────────── */

function renderProfileUI(profile, setField, setId) {
  const name = profile.fullName || '';
  const code = profile.studentCode || '';
  const cls  = profile.className  || '';
  const ht   = profile.homeroomTeacher || '';
  const sy   = profile.schoolYear || '';

  // Student cards (tên + mã số — tất cả screens)
  document.querySelectorAll('.student-card__name').forEach(el => { el.textContent = name; });
  document.querySelectorAll('.student-card__id').forEach(el => {
    el.textContent = code ? `Mã số: ${code}` : 'Mã số: —';
  });

  // IDs riêng từng screen
  setId('tiendo-className',  cls);
  setId('tiendo-homeroom',   ht);
  setId('tkb-className',     cls);
  setId('coban-className',   cls);
  setId('coban-homeroom',    ht);
  setId('coban-enrollDate',  profile.enrollmentDate || '—');
  setId('ketqua-className',  cls);
  setId('tdg-schoolYear',    sy);
  setId('tdg-className',     cls);
  setId('saeStudentName',    name);
  setId('saeStudentCode',    code);
  setId('saeClassName',      cls);
  setId('saeSchoolYear',     sy);
  setId('saeHomeroom',       ht);
  setId('saeSenderName',     name);

  // Lịch thi
  const lichThiTitle = document.getElementById('lichThi-title');
  if (lichThiTitle) lichThiTitle.textContent = `Lịch Thi Học Kỳ I: ${name || '—'}`;
  const lichThiSub = document.getElementById('lichThi-subtitle');
  if (lichThiSub) lichThiSub.innerHTML = `Lớp: <strong>${cls || '—'}</strong> | Năm học: ${sy || '—'} | Phân hệ: Học Sinh THCS`;

  // Hồ sơ năng lực subtitle
  const nlSub = document.querySelector('#screen-hoSoNL .page-subtitle');
  if (nlSub) nlSub.innerHTML = `Lớp: <strong>${cls || '—'}</strong> | Mã số: <strong>${code || '—'}</strong> | Hệ đào tạo: ${profile.educationSystem || 'Chính quy THCS'}`;

  // Avatar initials
  const initials = name.trim().split(/\s+/).slice(-2).map(p => p[0]).join('').toUpperCase() || 'HS';
  setId('studentAccountAvatar', initials);
  setId('nlAvatarInitials',     initials);
  setId('shareStudentName', name);
  setId('saFullName',    name);
  setId('saStudentCode', code);
  setId('saGender',      profile.gender);
  setId('saBirthday',    profile.birthday);
  setId('saEmail',       profile.email);
  setId('saUsername',    profile.username);
  setId('saRole',        profile.role);
  setId('saClassName',   cls);
  setId('saSchoolYear',  sy);
  setId('saEducationSystem', profile.educationSystem);
  setId('saHomeroomTeacher', ht);
}

function renderPersonalInfo(profile, setField) {
  const fields = {
    'fullname':         profile.fullName,
    'birthday':         profile.birthday,
    'gender':           profile.gender,
    'ethnicity':        profile.ethnicity,
    'origin':           profile.origin,
    'party':            profile.party,
    'policy':           profile.policy,
    'studentCode':      profile.studentCode,
    'address':          profile.address,
    'coban1.birthday':  profile.birthday,
    'coban1.gender':    profile.gender,
    'coban1.ethnicity': profile.ethnicity,
    'coban1.origin':    profile.origin,
    'coban1.party':     profile.party,
    'coban1.policy':    profile.policy,
    'coban1.address':   profile.address,
  };
  Object.entries(fields).forEach(([f, v]) => setField(f, v));
}

function renderFamilyInfo(profile, db, setField) {
  const links = db.list('parentStudentLinks').filter(l => l.studentId === profile.studentId);
  if (!links.length) return;
  const allUsers = db.list('users');
  links.forEach(link => {
    const u = allUsers.find(x => x.id === link.parentUserId);
    if (!u) return;
    const rel = (link.relationship || '').toLowerCase();
    if (rel === 'cha' || rel === 'father') {
      setField('coban2.fatherName',  u.displayName || '');
      setField('coban2.fatherPhone', u.phone || '');
      setField('coban2.fatherJob',   u.job   || '');
    } else if (rel === 'mẹ' || rel === 'mother') {
      setField('coban2.motherName',  u.displayName || '');
      setField('coban2.motherPhone', u.phone || '');
      setField('coban2.motherJob',   u.job   || '');
    }
    if (link.isPrimaryGuardian) setField('coban2.emergency', u.phone || '');
  });
}

function renderAttendance(profile, sel, setField, setId) {
  const records   = sel.attendance(profile.studentId);
  const excused   = records.filter(r => r.type === 'excused_absence').length;
  const unexcused = records.filter(r => r.type === 'unexcused_absence').length;
  const late      = records.filter(r => r.type === 'late').length;

  setField('khen.excused',   String(excused).padStart(2, '0'));
  setField('khen.unexcused', String(unexcused).padStart(2, '0'));
  setField('khen.late',      String(late).padStart(2, '0'));

  const total   = 180;
  const rate    = (((total - excused - unexcused) / total) * 100).toFixed(1);
  setId('khen-attendanceRate', rate + '%');

  const tbody = document.getElementById('hs-attendance-tbody');
  if (!tbody) return;
  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:#9ca3af;font-size:13px;">Chưa có dữ liệu chuyên cần.</td></tr>`;
    return;
  }
  const typeLabel = { excused_absence:'Có phép', unexcused_absence:'Không phép', late:'Đi muộn' };
  const typeBadge = { excused_absence:'att-badge--excused', unexcused_absence:'att-badge--unexcused', late:'att-badge--late' };
  const sessLabel = { morning:'Sáng', afternoon:'Chiều', full_day:'Cả ngày' };
  tbody.innerHTML = records.map(r => `
    <tr>
      <td>${r.date ? r.date.split('-').reverse().join(' / ') : '—'}</td>
      <td>${sessLabel[r.session] || r.session || '—'}</td>
      <td><span class="att-badge ${typeBadge[r.type] || ''}">${typeLabel[r.type] || r.type}</span></td>
      <td>${r.reason || '—'}</td>
      <td><span class="att-badge att-badge--confirmed">GVCN xác nhận</span></td>
    </tr>`).join('');
}

function renderAchievements(profile, sel, setId) {
  const achList = sel.achievements(profile.studentId);
  const approved = achList.filter(a => a.status === 'approved').length;
  setId('khen-rewardCount', approved + ' Quyết định');
  // Bảng thành tích được render bởi restoreRewardData() trong inline script
  // (đã dùng _getCurrentStudentCode() — sẽ đúng sau khi profile sẵn sàng)
}

function renderGrades(profile, db, sel, setId) {
  const semResults = db.list('semesterResults').filter(r => r.studentId === profile.studentId);
  const yearResult = db.list('yearResults').find(r => r.studentId === profile.studentId);
  if (!yearResult) return;

  const fmt  = v => v != null ? Number(v).toFixed(2) : '—';
  const rank = v => {
    const n = parseFloat(v);
    if (n >= 8.0) return 'Giỏi';
    if (n >= 6.5) return 'Khá';
    return 'Trung bình';
  };

  const sem1 = semResults.find(r => r.semesterId === 'SEM_2026_1');
  const sem2 = semResults.find(r => r.semesterId === 'SEM_2026_2');

  const cardInfo = document.querySelector('#tab-ketqua .student-card__info');
  if (cardInfo) {
    cardInfo.innerHTML = `
      <div class="student-card__info-label">Lớp THCS hiện tại:</div>
      <div class="student-card__info-value">${profile.className || '—'}</div>
      ${sem1 ? `
        <div class="student-card__stat-label" style="margin-top:8px;">ĐTB Học kỳ I:</div>
        <div class="student-card__stat-value student-card__stat-value--blue">${fmt(sem1.average)} (${rank(sem1.average)})</div>
        <div class="student-card__stat-label">Hạnh kiểm HK I:</div>
        <div class="student-card__stat-value student-card__stat-value--green">${sem1.conductRank || '—'}</div>
        <div class="student-card__divider" style="margin:10px 0;"></div>` : ''}
      ${sem2 ? `
        <div class="student-card__stat-label">ĐTB Học kỳ II:</div>
        <div class="student-card__stat-value student-card__stat-value--blue">${fmt(sem2.average)} (${rank(sem2.average)})</div>
        <div class="student-card__stat-label">Hạnh kiểm HK II:</div>
        <div class="student-card__stat-value student-card__stat-value--green">${sem2.conductRank || '—'}</div>
        <div class="student-card__divider" style="margin:10px 0;"></div>` : ''}
      <div class="student-card__stat-label">ĐTB Cả Năm:</div>
      <div class="student-card__stat-value student-card__stat-value--orange" style="font-size:18px;">${fmt(yearResult.average)} (${rank(yearResult.average)})</div>
      <div class="student-card__stat-label">Xếp loại năm:</div>
      <div class="student-card__stat-value student-card__stat-value--green">Học sinh ${rank(yearResult.average)}</div>`;
  }

  // Render bảng điểm chi tiết theo từng học kỳ
  const gradeRecs = sel.grades(profile.studentId);
  const allSubs   = db.list('subjects');
  const thRow = `<thead><tr>
    <th class="grade-table__col-subject">MÔN HỌC</th>
    <th>ĐIỂM MIỆNG</th><th>GIỮA KỲ</th><th>CUỐI KỲ</th>
    <th class="grade-table__col-average">ĐTB MÔN</th>
  </tr></thead>`;

  const makeRows = semId => gradeRecs
    .filter(g => g.semesterId === semId)
    .map(g => `<tr>
      <td class="grade-table__subject">${g.subject?.name || '—'}</td>
      <td>${g.oral ?? '—'}</td>
      <td>${g.midterm ?? '—'}</td>
      <td>${g.final ?? '—'}</td>
      <td class="grade-table__dtb">${g.average ?? '—'}</td>
    </tr>`).join('');

  const content = document.getElementById('gradeYearContent');
  if (!content) return;

  const rows1 = makeRows('SEM_2026_1');
  const rows2 = makeRows('SEM_2026_2');

  if (!rows1 && !rows2) {
    content.innerHTML = `<div style="text-align:center;padding:48px 24px;color:#9ca3af;">
      <i class="fas fa-table" style="font-size:36px;margin-bottom:16px;display:block;opacity:.3;"></i>
      <p style="font-size:14px;font-weight:600;color:#6b7280;">Chưa có dữ liệu điểm số</p>
      <p style="font-size:13px;">Dữ liệu sẽ được cập nhật bởi giáo viên.</p>
    </div>`;
    return;
  }

  content.innerHTML = `
    ${rows1 ? `<div class="hs-tab-header" style="margin-bottom:var(--space-3);">
      <div class="progress-content__section-title progress-content__section-title--primary" style="margin:0;">
        <i class="fas fa-table" style="margin-right:7px;color:#1a3a6b;font-size:14px;"></i>
        Bảng Điểm Chi Tiết — Học Kỳ I
      </div></div>
      <table class="grade-table"><tbody>${rows1}</tbody>${thRow}</table>` : ''}
    ${rows2 ? `<div class="grade-semester-divider"></div>
      <div class="hs-tab-header" style="margin-bottom:var(--space-3);margin-top:var(--space-5);">
      <div class="progress-content__section-title progress-content__section-title--primary" style="margin:0;">
        <i class="fas fa-table" style="margin-right:7px;color:#1a3a6b;font-size:14px;"></i>
        Bảng Điểm Chi Tiết — Học Kỳ II
      </div></div>
      <table class="grade-table"><tbody>${rows2}</tbody>${thRow}</table>` : ''}`;
}

function renderEmptyStates() {
  // Chuyên cần
  const attTbody = document.getElementById('hs-attendance-tbody');
  if (attTbody) attTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:#9ca3af;font-size:13px;">Chưa có dữ liệu chuyên cần.</td></tr>`;
  ['khen.excused','khen.unexcused','khen.late'].forEach(f =>
    document.querySelectorAll(`[data-field="${f}"]`).forEach(el => { el.textContent = '—'; })
  );
  const rateEl = document.getElementById('khen-attendanceRate');
  if (rateEl) rateEl.textContent = '—';
  const countEl = document.getElementById('khen-rewardCount');
  if (countEl) countEl.textContent = '—';

  // Điểm số
  const content = document.getElementById('gradeYearContent');
  if (content) content.innerHTML = `<div style="text-align:center;padding:48px 24px;color:#9ca3af;">
    <i class="fas fa-table" style="font-size:36px;margin-bottom:16px;display:block;opacity:.3;"></i>
    <p style="font-size:14px;font-weight:600;color:#6b7280;">Chưa có dữ liệu điểm số</p>
    <p style="font-size:13px;">Dữ liệu sẽ được cập nhật bởi giáo viên.</p>
  </div>`;

  // Thành tích
  const rewardTbody = document.getElementById('hs-reward-tbody');
  if (rewardTbody) rewardTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:#9ca3af;font-size:13px;">
    <i class="fas fa-trophy" style="display:block;font-size:28px;opacity:.25;margin-bottom:10px;"></i>Chưa có dữ liệu thành tích.
  </td></tr>`;
}

function syncStudentIdentity() {
  let user = null;
  try { user = JSON.parse(sessionStorage.getItem('spms_user')); } catch { /* ignore */ }

  if (!user) {
    window.location.href = 'index.html';
    return false;
  }

  const roleKey = (user.roleKey || '').toLowerCase();
  const role    = (user.role || '').toLowerCase();
  const isStudent = roleKey === 'student' || role.includes('học sinh');

  if (!isStudent) {
    window.location.href = 'index.html';
    return false;
  }

  // Sync topbar & dropdown from session
  const userNameEl     = document.getElementById('userDisplayName');
  const dropdownNameEl = document.getElementById('dropdownName');
  const dropdownRoleEl = document.getElementById('dropdownRole');

  if (userNameEl)     userNameEl.textContent     = user.name || 'Học sinh';
  if (dropdownNameEl) dropdownNameEl.textContent = user.name || 'Học sinh';
  if (dropdownRoleEl) dropdownRoleEl.textContent = user.role || 'Học sinh';

  return true;
}

/* ===== SCREEN MANAGER ===== */
function showScreen(screenId, navEl) {
  if (screenId !== 'account' && window.location.hash === '#account') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.add('screen--hidden'));
  document.querySelectorAll('.sidebar__item').forEach(i => i.classList.remove('active'));

  const target = document.getElementById('screen-' + screenId);
  if (target) target.classList.remove('screen--hidden');
  if (navEl)  navEl.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger screen-specific init
  if (screenId === 'tiendo' && window.StudentTiendoModule) {
    window.StudentTiendoModule.animateProgressBars();
  }

  return false;
}

function getAccountFieldValue(field, fallback) {
  const node = document.querySelector(`#screen-hoSoNL [data-field="${field}"]`);
  return node?.textContent?.trim() || fallback || '—';
}

function renderStudentAccount() {
  const profile = getCurrentStudentProfile();
  const fullName = profile.fullName;
  const username = profile.username;
  const initials = fullName.trim().split(/\s+/).slice(-2).map(part => part.charAt(0)).join('').toUpperCase();
  const values = {
    studentAccountAvatar: initials || 'HS',
    saFullName: fullName,
    saStudentCode: profile.studentCode,
    saBirthday: profile.birthday,
    saGender: profile.gender,
    saEmail: profile.email,
    saUsername: username,
    saRole: profile.role,
  };

  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function routeStudentPage() {
  if (window.location.hash !== '#account') return false;
  renderStudentAccount();
  showScreen('account');
  return true;
}

/* ===== USER MENU ===== */
function toggleUserDropdown() {
  if (!window.SPMSUserMenu) return;
  window.SPMSUserMenu.toggle({
    wrapperId: 'navAuthArea',
    buttonId:  'userMenuBtn',
    menuId:    'userDropdown',
  });
}

/* ===== LOGOUT ===== */
async function confirmLogout(event) {
  if (event) event.preventDefault();

  if (window.SPMSUserMenu) {
    window.SPMSUserMenu.close({
      wrapperId: 'navAuthArea',
      buttonId:  'userMenuBtn',
      menuId:    'userDropdown',
    });
  }

  if (!window.SPMSLogoutConfirm) {
    sessionStorage.removeItem('spms_user');
    localStorage.removeItem('spms_user');
    localStorage.removeItem('spms_token');
    localStorage.removeItem('spms_refresh');
    window.location.href = 'index.html';
    return;
  }

  const confirmed = await window.SPMSLogoutConfirm.confirm({
    title:        'Xác nhận đăng xuất?',
    message:      'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
    subMessage:   'Mọi phiên làm việc chưa lưu sẽ bị đóng.',
    cancelLabel:  'Hủy bỏ',
    confirmLabel: 'Đăng xuất',
  });

  if (confirmed) {
    sessionStorage.removeItem('spms_user');
    localStorage.removeItem('spms_user');
    localStorage.removeItem('spms_token');
    localStorage.removeItem('spms_refresh');
    window.location.href = 'index.html';
  }
}

/* ===== GLOBAL KEYBOARD HANDLER ===== */
function bindGlobalKeyboard() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    // Close TKB detail panel
    if (window.StudentTKBModule) {
      const tkbPanel = document.getElementById('tkbDetailPanel');
      if (tkbPanel && tkbPanel.classList.contains('open')) {
        window.StudentTKBModule.closeSubjectDetail();
        return;
      }
    }

    // Close profile history modal
    if (window.StudentHoSoNLModule) {
      const historyModal = document.getElementById('profileHistoryModal');
      if (historyModal && historyModal.classList.contains('is-open')) {
        window.StudentHoSoNLModule.closeProfileHistoryModal();
        return;
      }
    }

    // Close proof file viewer modal
    if (window.closeProofModal) {
      const proofOverlay = document.getElementById('proofModalOverlay');
      if (proofOverlay && proofOverlay.classList.contains('open')) {
        window.closeProofModal();
        return;
      }
    }
  });
}

/* ===== BOOTSTRAP ===== */
document.addEventListener('DOMContentLoaded', () => {
  const ok = syncStudentIdentity();
  if (!ok) return;

  // Bind shared helpers
  if (window.SPMSUserMenu) {
    window.SPMSUserMenu.bind({
      wrapperId: 'navAuthArea',
      buttonId:  'userMenuBtn',
      menuId:    'userDropdown',
    });
  }

  // Init each screen module
  if (window.StudentTKBModule)    window.StudentTKBModule.init();
  if (window.StudentHoSoHSModule) window.StudentHoSoHSModule.init();
  if (window.StudentHoSoNLModule) window.StudentHoSoNLModule.init();

  // Fetch toàn bộ data từ spms_database và render lên UI
  loadStudentData();
  // Thông báo cho các inline script biết profile đã sẵn sàng
  window.dispatchEvent(new CustomEvent('student-profile-ready', { detail: { profile: getCurrentStudentProfile() } }));

  bindGlobalKeyboard();

  // Mở trang tài khoản từ menu; nếu không có hash thì vào màn hình mặc định.
  if (!routeStudentPage()) {
    const defaultNav = document.getElementById('nav-tiendo');
    showScreen('tiendo', defaultNav);
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#account') routeStudentPage();
    else {
      const defaultNav = document.getElementById('nav-tiendo');
      showScreen('tiendo', defaultNav);
    }
  });
});

// Expose globals used by inline HTML onclick attributes
window.showScreen       = showScreen;
window.toggleUserDropdown = toggleUserDropdown;
window.confirmLogout    = confirmLogout;

// Proxy for inline onclick="closeSubjectDetail()" in TKB panel HTML
window.closeSubjectDetail = function () {
  if (window.StudentTKBModule) window.StudentTKBModule.closeSubjectDetail();
};
