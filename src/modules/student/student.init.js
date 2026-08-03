/**
 * student.init.js
 * Bootstrap module: auth guard, sidebar navigation, screen manager.
 * Coordinates all student screen modules.
 */

/* ===== AUTH GUARD ===== */
const STUDENT_PROFILE = Object.freeze({
  fullName: 'Nguyễn Văn Hoàng Anh',
  studentCode: 'HS101001',
  className: '7A1',
  birthday: '14 / 05 / 2010',
  gender: 'Nam',
  ethnicity: 'Kinh / Không',
  origin: 'Đà Nẵng, Việt Nam',
  party: 'Đã kết nạp (26/03/2026)',
  policy: 'Con thương binh (Ưu đãi A)',
  address: '123 Lê Lợi, Phường Hải Châu I, Quận Hải Châu, Thành phố Đà Nẵng',
  schoolYear: '2026 – 2027',
  educationSystem: 'Chính quy THCS',
  homeroomTeacher: 'Cô Nguyễn Thị Xuân Hiền',
  username: 'hs101001',
  email: 'hs101001@spms.edu.vn',
});
window.STUDENT_PROFILE = STUDENT_PROFILE;

function getCurrentStudentProfile() {
  let user = {};
  try { user = JSON.parse(sessionStorage.getItem('spms_user')) || {}; } catch { /* ignore */ }
  return {
    ...STUDENT_PROFILE,
    fullName: user.name || STUDENT_PROFILE.fullName,
    username: user.username || STUDENT_PROFILE.username,
    email: user.email || STUDENT_PROFILE.email,
    role: user.role || 'Học sinh',
  };
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
  };
  Object.entries(identityFields).forEach(([field, value]) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach(el => { el.textContent = value; });
  });

  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
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

  const examTitle = document.querySelector('#screen-lichThi .page-title');
  if (examTitle) examTitle.textContent = `Lịch Thi Học Kỳ I: ${profile.fullName}`;
  const examSubtitle = document.querySelector('#screen-lichThi .page-subtitle');
  if (examSubtitle) examSubtitle.innerHTML = `Lớp: <strong>${profile.className}</strong> | Năm học: ${profile.schoolYear} | Phân hệ: Học Sinh THCS`;
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
