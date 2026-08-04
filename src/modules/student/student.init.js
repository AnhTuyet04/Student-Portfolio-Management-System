/**
 * student.init.js
 * Bootstrap module: auth guard, sidebar navigation, screen manager.
 * Coordinates all student screen modules.
 */

/* ===== PROFILE LOOKUP ===== */
let _cachedProfile = null;

function getCurrentStudentProfile() {
  if (_cachedProfile) return _cachedProfile;

  let user = {};
  try { user = JSON.parse(sessionStorage.getItem('spms_user')) || {}; } catch {}

  const profileKey = user.profileId || user.studentCode || user.studentId || '';
  let databaseProfile = null;

  // ── Bước 1: tìm trong spms_students_ext theo mã học sinh ──
  let extStudents = [];
  try { extStudents = JSON.parse(localStorage.getItem('spms_students_ext') || '[]'); } catch {}

  const extMatch = profileKey
    ? extStudents.find(s => String(s.id).toLowerCase() === String(profileKey).toLowerCase())
    : null;
  const extMatchByName = !extMatch && user.name
    ? extStudents.find(s => s.fullName && s.fullName.trim().toLowerCase() === user.name.trim().toLowerCase())
    : null;
  const extResult = extMatch || extMatchByName;

  if (extResult) {
    let className = extResult.classId || '';
    let homeroomTeacher = '';
    if (window.SPMSDatabase) {
      const cls = window.SPMSDatabase.find('classes', c => c.id === extResult.classId || c.code === extResult.classId);
      if (cls) {
        className = cls.code || extResult.classId;
        if (cls.homeroomTeacherId) {
          const tea = window.SPMSDatabase.find('teachers', t => t.id === cls.homeroomTeacherId);
          homeroomTeacher = tea?.fullName || '';
        }
      }
    }
    const g = (extResult.gender || '').toLowerCase();
    databaseProfile = {
      fullName: extResult.fullName || user.name || '',
      studentCode: extResult.id || '',
      studentId: extResult.id || '',
      className, classId: extResult.classId || '',
      birthday: extResult.dateOfBirth ? extResult.dateOfBirth.split('-').reverse().join('/') : '',
      gender: g === 'male' || g === 'nam' ? 'Nam' : g === 'female' || g === 'nữ' ? 'Nữ' : (extResult.gender || ''),
      ethnicity: extResult.ethnicity || '', address: extResult.address || '',
      fatherName: extResult.fatherName || '', fatherPhone: extResult.fatherPhone || '',
      motherName: extResult.motherName || '', motherPhone: extResult.motherPhone || '',
      emergencyPhone: extResult.emergencyPhone || '',
      policy: extResult.priority || '', educationSystem: 'Chính quy THCS', homeroomTeacher,
    };
  }

  // ── Bước 2: SPMSDatabase theo userId ──
  if (!databaseProfile && window.SPMSDatabase) {
    const userId = user.userId || user.id || '';
    let stuByUser = null;
    if (profileKey) {
      stuByUser = window.SPMSDatabase.find('students', s =>
        String(s.code).toLowerCase() === String(profileKey).toLowerCase() ||
        String(s.id).toLowerCase() === String(profileKey).toLowerCase()
      );
    }
    if (!stuByUser && userId) stuByUser = window.SPMSDatabase.find('students', s => s.userId === userId);
    if (stuByUser) {
      const cls = stuByUser.classId ? window.SPMSDatabase.find('classes', c => c.id === stuByUser.classId) : null;
      let homeroomTeacher = '';
      if (cls?.homeroomTeacherId) {
        const tea = window.SPMSDatabase.find('teachers', t => t.id === cls.homeroomTeacherId);
        homeroomTeacher = tea?.fullName || '';
      }
      const g = (stuByUser.gender || '').toLowerCase();
      databaseProfile = {
        fullName: stuByUser.fullName || user.name || '',
        studentCode: stuByUser.code || '', studentId: stuByUser.id || '',
        className: cls?.code || stuByUser.classId || '', classId: stuByUser.classId || '',
        birthday: stuByUser.dateOfBirth ? stuByUser.dateOfBirth.split('-').reverse().join('/') : '',
        gender: g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : (stuByUser.gender || ''),
        ethnicity: stuByUser.ethnicity || '', address: stuByUser.address || '',
        policy: stuByUser.policy || '', educationSystem: 'Chính quy THCS', homeroomTeacher,
      };
    }
  }

  // ── Bước 3: fallback session ──
  if (!databaseProfile) {
    databaseProfile = {
      fullName: user.name || '', studentCode: profileKey || user.username || '',
      studentId: profileKey || '', className: '', classId: '', birthday: '', gender: '',
      ethnicity: '', address: '', educationSystem: 'Chính quy THCS', homeroomTeacher: '',
    };
  }

  _cachedProfile = {
    fullName:        databaseProfile.fullName        || user.name || '',
    studentCode:     databaseProfile.studentCode     || user.studentCode || user.profileId || '',
    studentId:       databaseProfile.studentId       || user.profileId || '',
    className:       databaseProfile.className       || '',
    classId:         databaseProfile.classId         || '',
    birthday:        databaseProfile.birthday        || '',
    gender:          databaseProfile.gender          || '',
    ethnicity:       databaseProfile.ethnicity       || '',
    origin:          databaseProfile.origin          || '',
    party:           databaseProfile.party           || '',
    policy:          databaseProfile.policy          || '',
    address:         databaseProfile.address         || '',
    schoolYear:      databaseProfile.schoolYear      || '',
    educationSystem: databaseProfile.educationSystem || 'Chính quy THCS',
    homeroomTeacher: databaseProfile.homeroomTeacher || '',
    username:        databaseProfile.username        || user.username || '',
    email:           databaseProfile.email           || user.email || '',
    role:            user.role || 'Học sinh',
    enrollmentDate:  databaseProfile.enrollmentDate  || '',
    fatherName:      databaseProfile.fatherName      || '',
    fatherPhone:     databaseProfile.fatherPhone     || '',
    motherName:      databaseProfile.motherName      || '',
    motherPhone:     databaseProfile.motherPhone     || '',
    emergencyPhone:  databaseProfile.emergencyPhone  || '',
  };
  window.STUDENT_PROFILE = _cachedProfile;
  return _cachedProfile;
}

/* ===== LOAD & RENDER DATA ===== */
function loadStudentData() {
  _cachedProfile = null;
  const profile = getCurrentStudentProfile();
  const db  = window.SPMSDatabase;
  const sel = window.SPMSSelectors;
  if (!db || !sel) return;

  const setField = (field, value) => {
    if (value === null || value === undefined || value === '') return;
    document.querySelectorAll(`[data-field="${field}"]`).forEach(el => { el.textContent = value; });
  };
  const setId = (id, value) => {
    if (!value && value !== 0) return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  // ── 1. Profile UI ──
  const name = profile.fullName || '';
  const code = profile.studentCode || '';
  const cls  = profile.className || '';
  document.querySelectorAll('.student-card__name').forEach(el => { el.textContent = name; });
  document.querySelectorAll('.student-card__id').forEach(el => { el.textContent = code ? `Mã số: ${code}` : 'Mã số: —'; });
  setId('tiendo-className', cls); setId('tiendo-homeroom', profile.homeroomTeacher);
  setId('tkb-className', cls);
  setId('coban-className', cls); setId('coban-homeroom', profile.homeroomTeacher);
  setId('ketqua-className', cls);
  setId('tdg-schoolYear', profile.schoolYear); setId('tdg-className', cls);
  setId('saeStudentName', name); setId('saeStudentCode', code);
  setId('saeClassName', cls); setId('saeSenderName', name);
  const initials = name.trim().split(/\s+/).slice(-2).map(p => p[0]).join('').toUpperCase() || 'HS';
  setId('studentAccountAvatar', initials);
  setId('shareStudentName', name);
  setId('saFullName', name); setId('saStudentCode', code);
  setId('saBirthday', profile.birthday); setId('saGender', profile.gender);
  setId('saEmail', profile.email); setId('saUsername', profile.username);
  setId('saRole', profile.role); setId('saClassName', cls);
  setId('saEducationSystem', profile.educationSystem); setId('saHomeroomTeacher', profile.homeroomTeacher);
  const lichThiTitle = document.getElementById('lichThi-title');
  if (lichThiTitle) lichThiTitle.textContent = `Lịch Thi Học Kỳ I: ${name || '—'}`;
  const nlSub = document.querySelector('#screen-hoSoNL .page-subtitle');
  if (nlSub) nlSub.innerHTML = `Lớp: <strong>${cls || '—'}</strong> | Mã số: <strong>${code || '—'}</strong> | Hệ đào tạo: ${profile.educationSystem}`;

  // ── 2. Thông tin cá nhân ──
  const personalFields = {
    'fullname': name, 'birthday': profile.birthday, 'gender': profile.gender,
    'ethnicity': profile.ethnicity, 'origin': profile.origin, 'party': profile.party,
    'policy': profile.policy, 'studentCode': code, 'address': profile.address,
    'coban1.birthday': profile.birthday, 'coban1.gender': profile.gender,
    'coban1.ethnicity': profile.ethnicity, 'coban1.origin': profile.origin,
    'coban1.party': profile.party, 'coban1.policy': profile.policy, 'coban1.address': profile.address,
  };
  Object.entries(personalFields).forEach(([f, v]) => setField(f, v));

  // ── 3. Gia đình ──
  const links = db.list('parentStudentLinks').filter(l => l.studentId === profile.studentId);
  const allUsers = db.list('users');
  let familyFromDB = false;
  links.forEach(link => {
    const u = allUsers.find(x => x.id === link.parentUserId);
    if (!u) return;
    const rel = (link.relationship || '').toLowerCase();
    if (rel === 'cha' || rel === 'father') {
      setField('coban2.fatherName', u.displayName || ''); setField('coban2.fatherPhone', u.phone || '');
      familyFromDB = true;
    } else if (rel === 'mẹ' || rel === 'mother') {
      setField('coban2.motherName', u.displayName || ''); setField('coban2.motherPhone', u.phone || '');
      familyFromDB = true;
    }
    if (link.isPrimaryGuardian) setField('coban2.emergency', u.phone || '');
  });
  if (!familyFromDB) {
    setField('coban2.fatherName', profile.fatherName); setField('coban2.fatherPhone', profile.fatherPhone);
    setField('coban2.motherName', profile.motherName); setField('coban2.motherPhone', profile.motherPhone);
    setField('coban2.emergency', profile.emergencyPhone);
  }

  if (!profile.studentId) return;

  // ── 4. Chuyên cần ──
  const attRecords = sel.attendance(profile.studentId);
  const excused   = attRecords.filter(r => r.type === 'excused_absence').length;
  const unexcused = attRecords.filter(r => r.type === 'unexcused_absence').length;
  const late      = attRecords.filter(r => r.type === 'late').length;
  setField('khen.excused', String(excused).padStart(2, '0'));
  setField('khen.unexcused', String(unexcused).padStart(2, '0'));
  setField('khen.late', String(late).padStart(2, '0'));
  const rate = (((180 - excused - unexcused) / 180) * 100).toFixed(1);
  setId('khen-attendanceRate', rate + '%');
  const attTbody = document.getElementById('hs-attendance-tbody');
  if (attTbody) {
    if (!attRecords.length) {
      attTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:#9ca3af;">Chưa có dữ liệu chuyên cần.</td></tr>`;
    } else {
      const tL = { excused_absence:'Có phép', unexcused_absence:'Không phép', late:'Đi muộn' };
      const tB = { excused_absence:'att-badge--excused', unexcused_absence:'att-badge--unexcused', late:'att-badge--late' };
      const sL = { morning:'Sáng', afternoon:'Chiều', full_day:'Cả ngày' };
      attTbody.innerHTML = attRecords.map(r => `<tr>
        <td>${r.date ? r.date.split('-').reverse().join(' / ') : '—'}</td>
        <td>${sL[r.session] || r.session || '—'}</td>
        <td><span class="att-badge ${tB[r.type] || ''}">${tL[r.type] || r.type}</span></td>
        <td>${r.reason || '—'}</td>
        <td><span class="att-badge att-badge--confirmed">GVCN xác nhận</span></td>
      </tr>`).join('');
    }
  }

  // ── 5. Thành tích ──
  const achList = sel.achievements(profile.studentId);
  const approved = achList.filter(a => a.status === 'approved').length;
  setId('khen-rewardCount', approved + ' Quyết định');
  const rewardTbody = document.getElementById('hs-reward-tbody');
  if (rewardTbody && achList.length > 0) {
    const sMap = {
      approved: '<span class="reward-status reward-status--approved">Đã phê duyệt</span>',
      pending:  '<span class="reward-status reward-status--pending"><span class="reward-status__dot"></span> Chờ phê duyệt</span>',
      request_more: '<span class="reward-status reward-status--supplement"><span class="reward-status__dot"></span> Yêu cầu bổ sung</span>',
      rejected: '<span class="reward-status reward-status--rejected">Đã từ chối</span>',
    };
    const editBtns = s => (s === 'pending' || s === 'request_more')
      ? `<button class="reward-action-btn reward-action-btn--edit" type="button" onclick="openEditRewardModal(this)"><i class="fas fa-pen"></i></button>
         <button class="reward-action-btn reward-action-btn--delete" type="button" onclick="removeRewardRow(this)"><i class="fas fa-trash-alt"></i></button>` : '';
    rewardTbody.innerHTML = achList.map((a, i) => `
      <tr data-reward-id="${a.id}" data-reward-code="${a.code || ''}"
          data-organizer="${(a.organizer || '').replace(/"/g,'&quot;')}"
          data-level="${a.levelLabel || ''}"
          data-description="${(a.description || '').replace(/"/g,'&quot;')}"
          data-evidence-name="${(a.evidence?.[0]?.name || '').replace(/"/g,'&quot;')}">
        <td><strong>${a.code || `TT${String(i+1).padStart(3,'0')}`}</strong></td>
        <td class="reward-table__type">${a.categoryLabel || a.category || '—'}</td>
        <td class="reward-table__title--highlight">${a.title}</td>
        <td><div class="reward-table__period">${a.issuedDate ? a.issuedDate.split('-').reverse().join(' / ') : '—'}</div></td>
        <td>${sMap[a.status] || sMap.pending}</td>
        <td class="reward-table__action">
          <button class="reward-action-btn reward-action-btn--view" type="button" onclick="openStudentAchievementDetail(this)"><i class="fas fa-eye"></i></button>
          ${editBtns(a.status)}
        </td>
      </tr>`).join('');
  }

  // ── 6. Kết quả học tập ──
  const semResults = db.list('semesterResults').filter(r => r.studentId === profile.studentId);
  const yearResult = db.list('yearResults').find(r => r.studentId === profile.studentId);
  const fmt  = v => v != null ? Number(v).toFixed(2) : '—';
  const rank = v => parseFloat(v) >= 8.0 ? 'Giỏi' : parseFloat(v) >= 6.5 ? 'Khá' : 'Trung bình';
  if (yearResult) {
    const sem1 = semResults.find(r => r.semesterId === 'SEM_2026_1');
    const sem2 = semResults.find(r => r.semesterId === 'SEM_2026_2');
    const card = document.querySelector('#tab-ketqua .student-card__info');
    if (card) card.innerHTML = `
      <div class="student-card__info-label">Lớp THCS hiện tại:</div>
      <div class="student-card__info-value">${cls || '—'}</div>
      ${sem1 ? `<div class="student-card__stat-label" style="margin-top:8px;">ĐTB Học kỳ I:</div>
        <div class="student-card__stat-value student-card__stat-value--blue">${fmt(sem1.average)} (${rank(sem1.average)})</div>
        <div class="student-card__stat-label">Hạnh kiểm HK I:</div>
        <div class="student-card__stat-value student-card__stat-value--green">${sem1.conductRank || '—'}</div>
        <div class="student-card__divider" style="margin:10px 0;"></div>` : ''}
      ${sem2 ? `<div class="student-card__stat-label">ĐTB Học kỳ II:</div>
        <div class="student-card__stat-value student-card__stat-value--blue">${fmt(sem2.average)} (${rank(sem2.average)})</div>
        <div class="student-card__stat-label">Hạnh kiểm HK II:</div>
        <div class="student-card__stat-value student-card__stat-value--green">${sem2.conductRank || '—'}</div>
        <div class="student-card__divider" style="margin:10px 0;"></div>` : ''}
      <div class="student-card__stat-label">ĐTB Cả Năm:</div>
      <div class="student-card__stat-value student-card__stat-value--orange" style="font-size:18px;">${fmt(yearResult.average)} (${rank(yearResult.average)})</div>
      <div class="student-card__stat-label">Xếp loại năm:</div>
      <div class="student-card__stat-value student-card__stat-value--green">Học sinh ${rank(yearResult.average)}</div>`;
    const avg = parseFloat(yearResult.average) || 0;
    const pct = Math.min(100, Math.round((avg / 10) * 100));
    const pctEl = document.querySelector('#screen-tiendo .progress-item__pct');
    if (pctEl) pctEl.textContent = pct + '%';
    const barEl = document.querySelector('#screen-tiendo .progress-bar-fill--green');
    if (barEl) barEl.style.width = pct + '%';
    const noteEl = document.querySelector('#screen-tiendo .progress-item__note strong');
    if (noteEl) noteEl.textContent = `${fmt(yearResult.average)} học lực ${pct >= 80 ? 'Giỏi' : pct >= 65 ? 'Khá' : 'Trung bình'}`;
  }

  // ── 7. TKB & Lịch thi ──
  if (window.StudentTKBModule?.init) window.StudentTKBModule.init();
  if (window.StudentLichThiModule?.render) window.StudentLichThiModule.render();
}

/* ===== HELPER ===== */
function _setField(field, value) {
  if (!value) return;
  document.querySelectorAll(`[data-field="${field}"]`).forEach(el => { el.textContent = value; });
}

function syncStudentProfileAcrossScreens() {
  const profile = getCurrentStudentProfile();
  loadStudentData();
}

/* ===== AUTH GUARD ===== */
function syncStudentIdentity() {
  let user = null;
  try { user = JSON.parse(sessionStorage.getItem('spms_user')); } catch {}
  if (!user) { window.location.href = 'index.html'; return false; }
  const roleKey = (user.roleKey || '').toLowerCase();
  const role    = (user.role || '').toLowerCase();
  if (roleKey !== 'student' && !role.includes('học sinh')) { window.location.href = 'index.html'; return false; }
  const nameEl = document.getElementById('userDisplayName');
  const dropName = document.getElementById('dropdownName');
  const dropRole = document.getElementById('dropdownRole');
  if (nameEl) nameEl.textContent = user.name || 'Học sinh';
  if (dropName) dropName.textContent = user.name || 'Học sinh';
  if (dropRole) dropRole.textContent = user.role || 'Học sinh';
  return true;
}

/* ===== SCREEN MANAGER ===== */
function showScreen(screenId, navEl) {
  if (screenId !== 'account' && window.location.hash === '#account')
    history.replaceState(null, '', window.location.pathname + window.location.search);
  document.querySelectorAll('.screen').forEach(s => s.classList.add('screen--hidden'));
  document.querySelectorAll('.sidebar__item').forEach(i => i.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) target.classList.remove('screen--hidden');
  if (navEl)  navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (screenId === 'tiendo' && window.StudentTiendoModule) window.StudentTiendoModule.animateProgressBars();
  return false;
}

function renderStudentAccount() {
  const profile = getCurrentStudentProfile();
  const initials = (profile.fullName || '').trim().split(/\s+/).slice(-2).map(p => p[0]).join('').toUpperCase() || 'HS';
  const vals = { studentAccountAvatar: initials, saFullName: profile.fullName,
    saStudentCode: profile.studentCode, saBirthday: profile.birthday,
    saGender: profile.gender, saEmail: profile.email, saUsername: profile.username, saRole: profile.role };
  Object.entries(vals).forEach(([id, v]) => { const el = document.getElementById(id); if (el) el.textContent = v; });
}

function routeStudentPage() {
  if (window.location.hash !== '#account') return false;
  renderStudentAccount(); showScreen('account'); return true;
}

function toggleUserDropdown() {
  if (!window.SPMSUserMenu) return;
  window.SPMSUserMenu.toggle({ wrapperId: 'navAuthArea', buttonId: 'userMenuBtn', menuId: 'userDropdown' });
}

async function confirmLogout(event) {
  if (event) event.preventDefault();
  if (window.SPMSUserMenu) window.SPMSUserMenu.close({ wrapperId: 'navAuthArea', buttonId: 'userMenuBtn', menuId: 'userDropdown' });
  const doLogout = () => {
    sessionStorage.removeItem('spms_user');
    localStorage.removeItem('spms_user');
    localStorage.removeItem('spms_token');
    localStorage.removeItem('spms_refresh');
    window.location.href = 'index.html';
  };
  if (!window.SPMSLogoutConfirm) { doLogout(); return; }
  const confirmed = await window.SPMSLogoutConfirm.confirm({
    title: 'Xác nhận đăng xuất?', message: 'Bạn có chắc chắn muốn đăng xuất?',
    subMessage: 'Mọi phiên làm việc chưa lưu sẽ bị đóng.',
    cancelLabel: 'Hủy bỏ', confirmLabel: 'Đăng xuất',
  });
  if (confirmed) doLogout();
}

function bindGlobalKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (window.StudentTKBModule) {
      const p = document.getElementById('tkbDetailPanel');
      if (p && p.classList.contains('open')) { window.StudentTKBModule.closeSubjectDetail(); return; }
    }
    if (window.StudentHoSoNLModule) {
      const m = document.getElementById('profileHistoryModal');
      if (m && m.classList.contains('is-open')) { window.StudentHoSoNLModule.closeProfileHistoryModal(); return; }
    }
    if (window.closeProofModal) {
      const o = document.getElementById('proofModalOverlay');
      if (o && o.classList.contains('open')) { window.closeProofModal(); return; }
    }
  });
}

/* ===== BOOTSTRAP ===== */
document.addEventListener('DOMContentLoaded', () => {
  const ok = syncStudentIdentity();
  if (!ok) return;

  // ── Tự động import dữ liệu học sinh từ spms_students_ext vào SPMSDatabase ──
  // Đảm bảo SPMSSelectors có thể tìm thấy student record chính xác
  (function ensureStudentInDB() {
    try {
      const sess = JSON.parse(sessionStorage.getItem('spms_user') || '{}');
      const profileId = sess.profileId || sess.studentCode || '';
      if (!profileId || !window.SPMSDatabase) return;

      // Kiểm tra đã có trong DB chưa
      const existing = window.SPMSDatabase.find('students', s =>
        s.code === profileId || s.id === profileId
      );
      if (existing) {
        // Đảm bảo userId đúng
        if (sess.userId && existing.userId !== sess.userId) {
          window.SPMSDatabase.update('students', existing.id, { userId: sess.userId });
        }
        return;
      }

      // Chưa có → import từ spms_students_ext
      const ext = JSON.parse(localStorage.getItem('spms_students_ext') || '[]');
      const extRec = ext.find(s => String(s.id).toLowerCase() === String(profileId).toLowerCase());
      if (!extRec) return;

      const cls = window.SPMSDatabase.find('classes', c => c.code === extRec.classId || c.id === extRec.classId);
      window.SPMSDatabase.insert('students', {
        userId:      sess.userId || null,
        code:        extRec.id,
        fullName:    extRec.fullName || sess.name || '',
        classId:     cls?.id || null,
        status:      'studying',
        dateOfBirth: extRec.dateOfBirth || null,
        gender:      extRec.gender || null,
        ethnicity:   extRec.ethnicity || null,
        religion:    null, hometown: null,
        address:     extRec.address || null,
        policy:      extRec.priority || null,
        youthUnionJoinedAt: null,
      });
    } catch(e) { console.warn('[student.init] ensureStudentInDB:', e); }
  })();

  if (window.SPMSUserMenu) {
    window.SPMSUserMenu.bind({ wrapperId: 'navAuthArea', buttonId: 'userMenuBtn', menuId: 'userDropdown' });
  }

  if (window.StudentTKBModule)    window.StudentTKBModule.init();
  if (window.StudentHoSoHSModule) window.StudentHoSoHSModule.init();
  if (window.StudentHoSoNLModule) window.StudentHoSoNLModule.init();

  loadStudentData();
  window.dispatchEvent(new CustomEvent('student-profile-ready', { detail: { profile: getCurrentStudentProfile() } }));
  bindGlobalKeyboard();

  if (!routeStudentPage()) {
    showScreen('tiendo', document.getElementById('nav-tiendo'));
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#account') routeStudentPage();
    else showScreen('tiendo', document.getElementById('nav-tiendo'));
  });
});

/* ===== GLOBAL EXPORTS ===== */
window.showScreen           = showScreen;
window.toggleUserDropdown   = toggleUserDropdown;
window.confirmLogout        = confirmLogout;
window.closeSubjectDetail   = () => { if (window.StudentTKBModule) window.StudentTKBModule.closeSubjectDetail(); };
window.getCurrentStudentProfile = getCurrentStudentProfile;
