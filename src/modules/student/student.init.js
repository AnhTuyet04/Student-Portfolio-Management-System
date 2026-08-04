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

  // ── Bước 1: Ưu tiên tìm theo profileId/studentCode trong spms_students_ext ──
  // Đây là nguồn dữ liệu chính cho học sinh được tạo từ Admin (có đầy đủ thông tin)
  const profileKey = user.profileId || user.studentCode || user.studentId || '';
  let databaseProfile = null;

  console.log('[getCurrentStudentProfile] user.profileId=', user.profileId,
    'user.studentCode=', user.studentCode, 'user.userId=', user.userId,
    'profileKey=', profileKey);

  // Load spms_students_ext (danh sách học sinh do Admin tạo/quản lý)
  let extStudents = [];
  try {
    extStudents = JSON.parse(localStorage.getItem('spms_students_ext') || '[]');
  } catch {}

  console.log('[getCurrentStudentProfile] extStudents ids:', extStudents.map(s => s.id));

  // Tìm theo mã học sinh (profileId) — đây là liên kết chính xác nhất
  const extMatch = profileKey
    ? extStudents.find(s => String(s.id).toLowerCase() === String(profileKey).toLowerCase())
    : null;

  // Nếu không match bằng mã, thử match bằng tên (cho tài khoản cũ chưa có profileId)
  const extMatchByName = !extMatch && user.name
    ? extStudents.find(s =>
        s.fullName && s.fullName.trim().toLowerCase() === user.name.trim().toLowerCase()
      )
    : null;

  const extResult = extMatch || extMatchByName;

  console.log('[getCurrentStudentProfile] extMatch:', extMatch ? extMatch.id + ':' + extMatch.fullName : 'null');
  console.log('[getCurrentStudentProfile] extMatchByName:', extMatchByName ? extMatchByName.id + ':' + extMatchByName.fullName : 'null');

  if (extResult) {
    // Resolve tên lớp: classId trong extStudents có thể là code lớp hoặc id DB
    let className = extResult.classId || '';
    let homeroomTeacher = '';
    if (window.SPMSDatabase) {
      const cls = window.SPMSDatabase.find('classes', c =>
        c.id === extResult.classId || c.code === extResult.classId
      );
      if (cls) {
        className = cls.code || extResult.classId;
        if (cls.homeroomTeacherId) {
          const tea = window.SPMSDatabase.find('teachers', t => t.id === cls.homeroomTeacherId);
          homeroomTeacher = tea?.fullName || '';
        }
      }
    }
    // Chuẩn hoá giới tính
    const genderRaw = (extResult.gender || '').toLowerCase();
    const gender = genderRaw === 'male' || genderRaw === 'nam' ? 'Nam'
                 : genderRaw === 'female' || genderRaw === 'nữ' ? 'Nữ'
                 : extResult.gender || '';

    databaseProfile = {
      fullName:        extResult.fullName || user.name || '',
      studentCode:     extResult.id || '',
      studentId:       extResult.id || '',
      dbId:            extResult.dbId || '',
      className,
      classId:         extResult.classId || '',
      birthday:        extResult.dateOfBirth
                         ? extResult.dateOfBirth.split('-').reverse().join('/')
                         : '',
      gender,
      ethnicity:       extResult.ethnicity || '',
      address:         extResult.address || '',
      fatherName:      extResult.fatherName || '',
      fatherPhone:     extResult.fatherPhone || '',
      motherName:      extResult.motherName || '',
      motherPhone:     extResult.motherPhone || '',
      emergencyPhone:  extResult.emergencyPhone || '',
      policy:          extResult.priority || '',
      educationSystem: 'Chính quy THCS',
      homeroomTeacher,
    };
  }

  // ── Bước 2: Nếu chưa tìm được từ ext, thử SPMSDatabase theo userId ──
  if (!databaseProfile && window.SPMSDatabase) {
    const userId = user.userId || user.id || '';

    // 2a. Tìm bằng profileKey trong DB (code hoặc id của student record)
    if (profileKey) {
      const stuByCode = window.SPMSDatabase.find('students', s =>
        String(s.code).toLowerCase() === String(profileKey).toLowerCase() ||
        String(s.id).toLowerCase() === String(profileKey).toLowerCase()
      );
      if (stuByCode) databaseProfile = window.SPMSSelectors?.studentProfile(stuByCode.userId || stuByCode.id) || null;
    }

    // 2b. Tìm bằng userId
    if (!databaseProfile && userId) {
      const stuByUser = window.SPMSDatabase.find('students', s => s.userId === userId);
      if (stuByUser) {
        databaseProfile = window.SPMSSelectors?.studentProfile(userId) || null;
        // Build thủ công nếu SPMSSelectors không trả về
        if (!databaseProfile) {
          const cls = stuByUser.classId
            ? window.SPMSDatabase.find('classes', c => c.id === stuByUser.classId)
            : null;
          let homeroomTeacher = '';
          if (cls?.homeroomTeacherId) {
            const tea = window.SPMSDatabase.find('teachers', t => t.id === cls.homeroomTeacherId);
            homeroomTeacher = tea?.fullName || '';
          }
          const genderRaw = (stuByUser.gender || '').toLowerCase();
          databaseProfile = {
            fullName:        stuByUser.fullName || user.name || '',
            studentCode:     stuByUser.code || '',
            studentId:       stuByUser.id || '',
            className:       cls?.code || stuByUser.classId || '',
            classId:         stuByUser.classId || '',
            birthday:        stuByUser.dateOfBirth ? stuByUser.dateOfBirth.split('-').reverse().join('/') : '',
            gender:          genderRaw === 'male' ? 'Nam' : genderRaw === 'female' ? 'Nữ' : (stuByUser.gender || ''),
            ethnicity:       stuByUser.ethnicity || '',
            address:         stuByUser.address || '',
            policy:          stuByUser.policy || '',
            educationSystem: 'Chính quy THCS',
            homeroomTeacher,
          };
        }
      }
    }
  }

  // ── Bước 3: Fallback SPMSSelectors theo lookupKey ──
  if (!databaseProfile) {
    const lookupKey = user.userId || user.id || user.username || '';
    if (lookupKey) databaseProfile = window.SPMSSelectors?.studentProfile(lookupKey) || null;
  }

  // ── Bước 4: Fallback cuối — hiển thị tối thiểu từ session ──
  if (!databaseProfile) {
    databaseProfile = {
      fullName:        user.name || '',
      studentCode:     profileKey || user.username || '',
      studentId:       profileKey || '',
      className:       '',
      classId:         '',
      birthday:        '',
      gender:          '',
      ethnicity:       '',
      address:         '',
      educationSystem: 'Chính quy THCS',
      homeroomTeacher: '',
    };
  }

  _cachedProfile = {
    fullName:        databaseProfile?.fullName        || user.name        || '',
    studentCode:     databaseProfile?.studentCode     || user.studentCode || user.profileId || '',
    studentId:       databaseProfile?.studentId       || user.profileId  || '',
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
    // Thông tin gia đình từ spms_students_ext (Admin-created profiles)
    fatherName:      databaseProfile?.fatherName      || '',
    fatherPhone:     databaseProfile?.fatherPhone     || '',
    motherName:      databaseProfile?.motherName      || '',
    motherPhone:     databaseProfile?.motherPhone     || '',
    emergencyPhone:  databaseProfile?.emergencyPhone  || '',
  };

  // Expose toàn cục để các module khác dùng
  window.STUDENT_PROFILE = _cachedProfile;
  return _cachedProfile;
}

/**
 * loadStudentData()
 * Hàm trung tâm: đọc toàn bộ data của học sinh đang đăng nhập
 * từ SPMSDatabase rồi đổ vào đúng vị trí trên UI.
 * Gọi 1 lần sau khi DOMContentLoaded, sau khi profile đã sẵn sàng.
 */
function loadStudentData() {
  let profile = getCurrentStudentProfile();
  const db  = window.SPMSDatabase;
  const sel = window.SPMSSelectors;
  if (!db || !sel) return;

  // Nếu không tìm thấy student record, tự tạo stub để UI hoạt động
  if (!profile.studentId) {
    let user = {};
    try { user = JSON.parse(sessionStorage.getItem('spms_user')) || {}; } catch {}
    const userId = user.userId || user.id || '';
    if (userId) {
      const currentYear = db.find('schoolYears', sy => sy.isCurrent);
      const defaultClass = currentYear
        ? db.list('classes').find(c => c.schoolYearId === currentYear.id)
        : null;
      const autoCode = 'HS' + Date.now().toString().slice(-6);
      db.insert('students', {
        userId,
        code:        autoCode,
        fullName:    user.name || '',
        classId:     defaultClass?.id || null,
        status:      'studying',
        dateOfBirth: null, gender: null, ethnicity: null,
        religion: null, hometown: null, address: null,
        policy: null, youthUnionJoinedAt: null,
      });
      // Làm mới cache profile
      _cachedProfile = null;
    }
    // Gọi lại sau khi tạo stub
    profile = getCurrentStudentProfile();
    if (!profile.studentId) return; // vẫn không tìm được, bỏ qua
  }

  // Dùng profile mới nhất (có thể vừa refresh sau khi tạo stub)
  const activeProfile = profile;

  // ── 1. HỒ SƠ CÁ NHÂN (data-field trong hoSoHS & hoSoNL) ──────────────
  const fieldMap = {
    'fullname':         activeProfile.fullName,
    'birthday':         activeProfile.birthday,
    'gender':           activeProfile.gender,
    'ethnicity':        activeProfile.ethnicity,
    'origin':           activeProfile.origin,
    'party':            activeProfile.party,
    'policy':           activeProfile.policy,
    'studentCode':      activeProfile.studentCode,
    'address':          activeProfile.address,
    'coban1.birthday':  activeProfile.birthday,
    'coban1.gender':    activeProfile.gender,
    'coban1.ethnicity': activeProfile.ethnicity,
    'coban1.origin':    activeProfile.origin,
    'coban1.party':     activeProfile.party,
    'coban1.policy':    activeProfile.policy,
    'coban1.address':   activeProfile.address,
  };
  Object.entries(fieldMap).forEach(([field, value]) => {
    if (!value || value === '—') return;
    document.querySelectorAll(`[data-field="${field}"]`).forEach(el => {
      el.textContent = value;
    });
  });

  // ── 2. THÔNG TIN GIA ĐÌNH (từ parentStudentLinks hoặc ext profile) ─────────────────────
  const links = db.list('parentStudentLinks').filter(l => l.studentId === activeProfile.studentId);
  const allUsers = db.list('users');
  let familyFilledFromDB = false;
  links.forEach(link => {
    const parentUser = allUsers.find(u => u.id === link.parentUserId);
    if (!parentUser) return;
    const rel = (link.relationship || '').toLowerCase();
    if (rel === 'cha' || rel === 'father') {
      _setField('coban2.fatherName',  parentUser.displayName || '');
      _setField('coban2.fatherPhone', parentUser.phone || '');
      _setField('coban2.fatherJob',   parentUser.job   || '');
      familyFilledFromDB = true;
    } else if (rel === 'mẹ' || rel === 'mother') {
      _setField('coban2.motherName',  parentUser.displayName || '');
      _setField('coban2.motherPhone', parentUser.phone || '');
      _setField('coban2.motherJob',   parentUser.job   || '');
      familyFilledFromDB = true;
    }
    if (link.isPrimaryGuardian) {
      _setField('coban2.emergency', parentUser.phone || '');
    }
  });

  // Fallback: lấy thông tin gia đình trực tiếp từ profile (Admin-created student)
  if (!familyFilledFromDB) {
    if (activeProfile.fatherName)   _setField('coban2.fatherName',  activeProfile.fatherName);
    if (activeProfile.fatherPhone)  _setField('coban2.fatherPhone', activeProfile.fatherPhone);
    if (activeProfile.motherName)   _setField('coban2.motherName',  activeProfile.motherName);
    if (activeProfile.motherPhone)  _setField('coban2.motherPhone', activeProfile.motherPhone);
    if (activeProfile.emergencyPhone) _setField('coban2.emergency', activeProfile.emergencyPhone);
  }

  // ── 3. CHUYÊN CẦN ─────────────────────────────────────────────────────
  const attRecords = sel.attendance(activeProfile.studentId);
  const excused   = attRecords.filter(r => r.type === 'excused_absence').length;
  const unexcused = attRecords.filter(r => r.type === 'unexcused_absence').length;
  const late      = attRecords.filter(r => r.type === 'late').length;

  _setField('khen.excused',   String(excused).padStart(2, '0'));
  _setField('khen.unexcused', String(unexcused).padStart(2, '0'));
  _setField('khen.late',      String(late).padStart(2, '0'));

  // Tỉ lệ chuyên cần trên sidebar card
  const TOTAL_SESSIONS = 180;
  const attendRate = (((TOTAL_SESSIONS - excused - unexcused) / TOTAL_SESSIONS) * 100).toFixed(1);
  const rateEl = document.getElementById('khen-attendanceRate');
  if (rateEl) rateEl.textContent = attendRate + '%';

  // Bảng chi tiết ngày nghỉ
  const attTbody = document.getElementById('hs-attendance-tbody');
  if (attTbody && attRecords.length > 0) {
    const typeLabel  = { excused_absence:'Có phép', unexcused_absence:'Không phép', late:'Đi muộn' };
    const typeBadge  = { excused_absence:'att-badge--excused', unexcused_absence:'att-badge--unexcused', late:'att-badge--late' };
    const sessLabel  = { morning:'Sáng', afternoon:'Chiều', full_day:'Cả ngày' };
    attTbody.innerHTML = attRecords.map(r => `
      <tr>
        <td>${r.date ? r.date.split('-').reverse().join(' / ') : '—'}</td>
        <td>${sessLabel[r.session] || r.session || '—'}</td>
        <td><span class="att-badge ${typeBadge[r.type] || ''}">${typeLabel[r.type] || r.type}</span></td>
        <td>${r.reason || '—'}</td>
        <td><span class="att-badge att-badge--confirmed">GVCN xác nhận</span></td>
      </tr>`).join('');
  }

  // ── 4. THÀNH TÍCH ─────────────────────────────────────────────────────
  const achList = sel.achievements(activeProfile.studentId);
  const rewardCountEl = document.getElementById('khen-rewardCount');
  if (rewardCountEl) {
    const approved = achList.filter(a => a.status === 'approved').length;
    rewardCountEl.textContent = approved + ' Quyết định';
  }

  const rewardTbody = document.getElementById('hs-reward-tbody');
  if (rewardTbody && achList.length > 0) {
    const statusMarkup = status => {
      const map = {
        approved:     '<span class="reward-status reward-status--approved">Đã phê duyệt</span>',
        pending:      '<span class="reward-status reward-status--pending"><span class="reward-status__dot"></span> Chờ phê duyệt</span>',
        request_more: '<span class="reward-status reward-status--supplement"><span class="reward-status__dot"></span> Yêu cầu bổ sung</span>',
        rejected:     '<span class="reward-status reward-status--rejected">Đã từ chối</span>',
      };
      return map[status] || map.pending;
    };
    const editBtns = s => (s === 'pending' || s === 'request_more')
      ? `<button class="reward-action-btn reward-action-btn--edit" type="button" title="Cập nhật" onclick="openEditRewardModal(this)"><i class="fas fa-pen"></i></button>
         <button class="reward-action-btn reward-action-btn--delete" type="button" title="Xóa" onclick="removeRewardRow(this)"><i class="fas fa-trash-alt"></i></button>`
      : '';
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
        <td>${statusMarkup(a.status)}</td>
        <td class="reward-table__action">
          <button class="reward-action-btn reward-action-btn--view" type="button" title="Xem chi tiết"
                  onclick="openStudentAchievementDetail(this)"><i class="fas fa-eye"></i></button>
          ${editBtns(a.status)}
        </td>
      </tr>`).join('');
  }

  // ── 5. KẾT QUẢ HỌC TẬP (bảng điểm) ──────────────────────────────────
  const gradeRecs  = sel.grades(activeProfile.studentId);
  const allSubs    = db.list('subjects');
  const semResults = db.list('semesterResults').filter(r => r.studentId === activeProfile.studentId);
  const yearResult = db.list('yearResults').find(r => r.studentId === activeProfile.studentId);

  // Cập nhật sidebar card tab-ketqua
  const ketquaCard = document.querySelector('#tab-ketqua .student-card__info');
  if (ketquaCard && yearResult) {
    const sem1 = semResults.find(r => r.semesterId === 'SEM_2026_1');
    const sem2 = semResults.find(r => r.semesterId === 'SEM_2026_2');
    const fmt  = v => v != null ? Number(v).toFixed(2) : '—';
    const rank = v => parseFloat(v) >= 8.0 ? 'Giỏi' : parseFloat(v) >= 6.5 ? 'Khá' : 'Trung bình';
    ketquaCard.innerHTML = `
      <div class="student-card__info-label">Lớp THCS hiện tại:</div>
      <div class="student-card__info-value">${activeProfile.className}</div>
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

  // ── 6. TIẾN ĐỘ HỌC TẬP ───────────────────────────────────────────────
  if (yearResult) {
    const avg  = parseFloat(yearResult.average) || 0;
    const pct  = Math.min(100, Math.round((avg / 10) * 100));
    const targetEl = document.querySelector('#screen-tiendo .progress-item__pct');
    if (targetEl) targetEl.textContent = pct + '%';
    const barEl = document.querySelector('#screen-tiendo .progress-bar-fill--green');
    if (barEl) barEl.style.width = pct + '%';
    const noteEl = document.querySelector('#screen-tiendo .progress-item__note strong');
    if (noteEl) noteEl.textContent = `${Number(yearResult.average).toFixed(2)} học lực ${pct >= 80 ? 'Giỏi' : pct >= 65 ? 'Khá' : 'Trung bình'}`;
  }

  // ── 7. TKB — reload sau khi profile sẵn sàng ──────────────────────────
  if (window.StudentTKBModule?.init) {
    window.StudentTKBModule.init();
  }

  // ── 8. LỊCH THI ──────────────────────────────────────────────────────
  if (window.StudentLichThiModule?.render) {
    window.StudentLichThiModule.render();
  }
}

/** Ghi giá trị vào tất cả [data-field] khớp */
function _setField(field, value) {
  if (!value) return;
  document.querySelectorAll(`[data-field="${field}"]`).forEach(el => {
    el.textContent = value;
  });
}

function syncStudentProfileAcrossScreens() {
  const profile = getCurrentStudentProfile();
  const initials = profile.fullName.trim().split(/\s+/).slice(-2).map(part => part.charAt(0)).join('').toUpperCase();

  document.querySelectorAll('.student-card__name').forEach(el => { el.textContent = profile.fullName; });
  document.querySelectorAll('.student-card__id').forEach(el => { el.textContent = `Mã số: ${profile.studentCode}`; });

  const identityFields = {
    fullname: profile.fullName,
    birthday: profile.birthday,
    gender: profile.gender,
    ethnicity: profile.ethnicity,
    origin: profile.origin,
    party: profile.party,
    policy: profile.policy,
    studentCode: profile.studentCode,
    address: profile.address,
    'coban1.birthday': profile.birthday,
    'coban1.gender': profile.gender,
    'coban1.ethnicity': profile.ethnicity,
    'coban1.origin': profile.origin,
    'coban1.address': profile.address,
    'coban1.party': profile.party,
    'coban1.policy': profile.policy,
  };
  Object.entries(identityFields).forEach(([field, value]) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach(el => { el.textContent = value; });
  });

  const setText = (id, value) => { const el = document.getElementById(id); if (el && value) el.textContent = value; };

  // Tiến Độ screen
  setText('tiendo-className',  profile.className);
  setText('tiendo-homeroom',   profile.homeroomTeacher);

  // TKB header
  setText('tkb-className',     profile.className);

  // Lịch Thi
  const lichThiTitle = document.getElementById('lichThi-title');
  if (lichThiTitle) lichThiTitle.textContent = `Lịch Thi Học Kỳ I: ${profile.fullName}`;
  const lichThiSubtitle = document.getElementById('lichThi-subtitle');
  if (lichThiSubtitle) lichThiSubtitle.innerHTML = `Lớp: <strong>${profile.className}</strong> | Năm học: ${profile.schoolYear} | Phân hệ: Học Sinh THCS`;

  // Hồ Sơ Học Sinh — sidebar card tab-coban
  setText('coban-className',   profile.className);
  setText('coban-homeroom',    profile.homeroomTeacher);
  setText('coban-enrollDate',  profile.enrollmentDate || '—');

  // Hồ Sơ Học Sinh — tab-ketqua card
  setText('ketqua-className',  profile.className);

  // Hồ Sơ Học Sinh — tab-tudanhgia card
  setText('tdg-schoolYear',    profile.schoolYear);
  setText('tdg-className',     profile.className);

  // Modal sửa thành tích — section I
  setText('saeStudentName',    profile.fullName);
  setText('saeStudentCode',    profile.studentCode);
  setText('saeClassName',      profile.className);
  setText('saeSchoolYear',     profile.schoolYear);
  setText('saeHomeroom',       profile.homeroomTeacher);
  setText('saeSenderName',     profile.fullName);

  // Hồ Sơ Năng Lực
  setText('shareStudentName', profile.fullName);
  setText('studentAccountAvatar', initials || 'HS');
  setText('saFullName', profile.fullName);
  setText('saStudentCode', profile.studentCode);
  setText('saBirthday', profile.birthday);
  setText('saGender', profile.gender);
  setText('saEmail', profile.email);
  setText('saUsername', profile.username);
  setText('saRole', profile.role);
  setText('saClassName', profile.className);
  setText('saSchoolYear', profile.schoolYear);
  setText('saEducationSystem', profile.educationSystem);
  setText('saHomeroomTeacher', profile.homeroomTeacher);

  const portfolioSubtitle = document.querySelector('#screen-hoSoNL .page-subtitle');
  if (portfolioSubtitle) portfolioSubtitle.innerHTML = `Lớp: <strong>${profile.className}</strong> | Mã số: <strong>${profile.studentCode}</strong> | Hệ đào tạo: ${profile.educationSystem}`;
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

  // ── Debug: log session để kiểm tra ──
  try {
    const sess = JSON.parse(sessionStorage.getItem('spms_user') || '{}');
    console.log('[student.init] session:', JSON.stringify({
      name: sess.name, username: sess.username,
      profileId: sess.profileId, studentCode: sess.studentCode,
      userId: sess.userId, roleKey: sess.roleKey
    }));
    const extStudentsDebug = JSON.parse(localStorage.getItem('spms_students_ext') || '[]');
    console.log('[student.init] spms_students_ext count:', extStudentsDebug.length,
      extStudentsDebug.map(s => s.id + ':' + s.fullName));
    const createdDebug = JSON.parse(localStorage.getItem('spms_created_users') || '{}');
    const ukey = sess.username?.toLowerCase();
    console.log('[student.init] spms_created_users entry for', ukey, ':', JSON.stringify(createdDebug[ukey] || null));
  } catch(e) { console.warn('[student.init] debug error:', e); }

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

  syncStudentProfileAcrossScreens();
  loadStudentData();   // Đổ toàn bộ data từ SPMSDatabase vào UI

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
