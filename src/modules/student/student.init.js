/**
 * student.init.js
 * Bootstrap module: auth guard, sidebar navigation, screen manager.
 * Coordinates all student screen modules.
 */

/* ===== AUTH GUARD ===== */
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

  bindGlobalKeyboard();

  // Default screen
  const defaultNav = document.getElementById('nav-tiendo');
  showScreen('tiendo', defaultNav);
});

// Expose globals used by inline HTML onclick attributes
window.showScreen       = showScreen;
window.toggleUserDropdown = toggleUserDropdown;
window.confirmLogout    = confirmLogout;

// Proxy for inline onclick="closeSubjectDetail()" in TKB panel HTML
window.closeSubjectDetail = function () {
  if (window.StudentTKBModule) window.StudentTKBModule.closeSubjectDetail();
};
