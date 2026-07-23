/**
 * shared-header.js
 * Inject toàn bộ header (nav + auth + dropdown) vào mọi trang.
 * Sử dụng: <script src="src/shared/components/layout/shared-header.js"></script>
 * Đặt <header id="sharedHeaderMount"></header> hoặc để trống —
 * script sẽ tự inject vào đầu <body>.
 *
 * Cấu hình active link: thêm data-page="about|news|contact|home" vào <html>
 * hoặc để script tự detect từ pathname.
 */
(function () {
  'use strict';

  /* ── CSS ── */
  const CSS = `
<style id="shared-header-css">
  .sh-topbar {
    position: sticky; top: 0; z-index: 300;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    height: 52px;
    display: flex; align-items: center;
    padding: 0 28px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    flex-shrink: 0;
  }
  .sh-topbar__nav { display: flex; align-items: center; gap: 2px; margin-left: auto; }
  .sh-nav-link {
    font-size: 13.5px; font-weight: 500; color: #374151;
    padding: 6px 14px; border-radius: 7px;
    transition: color .15s, background .15s;
    text-decoration: none; white-space: nowrap;
    display: flex; align-items: center; gap: 5px;
  }
  .sh-nav-link:hover { color: #1e3a8a; background: #f3f6fb; }
  .sh-nav-link.active { color: #1e3a8a; font-weight: 700; background: #eff4fc; }
  .sh-nav-link--btn {
    background: none; border: none; cursor: pointer; font: inherit;
    font-size: 13.5px; font-weight: 500; color: #374151;
    padding: 6px 14px; border-radius: 7px;
    transition: color .15s, background .15s;
    display: flex; align-items: center; gap: 5px;
  }
  .sh-nav-link--btn:hover { color: #1e3a8a; background: #f3f6fb; }
  .sh-nav-item.open .sh-nav-link--btn { color: #1e3a8a; background: #eff4fc; }
  .sh-nav-chevron { font-size: 9px; color: #9ca3af; transition: transform .2s; }
  .sh-nav-item.open .sh-nav-chevron { transform: rotate(180deg); }
  .sh-nav-item { position: relative; display: flex; }
  .sh-nav-dropdown {
    position: absolute; top: calc(100% + 10px); left: 0;
    min-width: 210px; background: #fff;
    border: 1px solid #e2e8f0; border-radius: 10px;
    box-shadow: 0 10px 28px rgba(0,0,0,0.11);
    padding: 6px 0; display: none; z-index: 400;
    animation: shDropIn .18s ease;
  }
  .sh-nav-dropdown--right { left: auto; right: 0; }
  .sh-nav-item.open .sh-nav-dropdown { display: block; }
  @keyframes shDropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sh-nav-dd-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 16px; font-size: 13px; color: #374151;
    text-decoration: none; cursor: pointer;
    transition: background .14s, color .14s; white-space: nowrap;
  }
  .sh-nav-dd-item:hover { background: #f5f7fb; color: #1a3a6b; }
  .sh-nav-dd-item--head {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .06em; color: #9ca3af;
    padding: 10px 16px 5px; pointer-events: none; cursor: default;
  }
  .sh-nav-dd-item--head:hover { background: none; }
  .sh-nav-dd-sep { height: 1px; background: #f0f0f0; margin: 4px 8px; }
  .sh-divider { width: 1px; height: 22px; background: #e5e7eb; margin: 0 16px; flex-shrink: 0; }
  .sh-btn-login {
    background: #1a3a6b; color: #fff;
    padding: 7px 18px; border-radius: 8px;
    font-size: 13.5px; font-weight: 600;
    transition: background .2s, transform .15s;
    white-space: nowrap; flex-shrink: 0;
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .sh-btn-login:hover { background: #122a52; transform: translateY(-1px); }
  .sh-user-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 12px; border-radius: 7px;
    cursor: pointer; background: none; border: none;
    transition: background .15s; flex-shrink: 0; font: inherit;
  }
  .sh-user-btn:hover { background: #f3f6fb; }
  .sh-user-name { font-size: 13.5px; font-weight: 600; color: #1e3a8a; white-space: nowrap; }
  .sh-user-chevron { font-size: 10px; color: #6b7280; margin-left: 2px; }
  .sh-user-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    width: 230px; background: #fff;
    border-radius: 10px; border: 1px solid #e2e8f0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    padding: 0; display: none; z-index: 400;
    animation: shDropIn .18s ease; overflow: hidden;
  }
  .sh-user-dropdown.open { display: block; }
  .sh-user-dropdown__header { padding: 12px 16px 10px; border-bottom: 1px solid #f3f4f6; }
  .sh-user-dropdown__name { font-size: 13px; font-weight: 700; color: #111827; }
  .sh-user-dropdown__role { font-size: 11.5px; color: #6b7280; margin-top: 2px; }
  .sh-user-dropdown__sep { height: 1px; background: #f3f4f6; margin: 4px 0; }
  .sh-user-dropdown__item {
    display: block; padding: 9px 16px;
    font-size: 13px; color: #374151;
    text-decoration: none; cursor: pointer; transition: background .15s;
  }
  .sh-user-dropdown__item:hover { background: #f9fafb; color: #1a3a6b; }
  .sh-user-dropdown__item--danger {
    display: block; padding: 9px 16px;
    font-size: 13px; font-weight: 700; color: #ef4444;
    text-decoration: none; cursor: pointer;
    background: #fff5f5; transition: background .15s;
  }
  .sh-user-dropdown__item--danger:hover { background: #fee2e2; }
  .sh-hamburger {
    display: none; flex-direction: column;
    gap: 5px; padding: 6px; cursor: pointer;
    border-radius: 6px; margin-left: 8px; flex-shrink: 0;
    background: none; border: none;
  }
  .sh-hamburger span {
    display: block; width: 22px; height: 2px;
    background: #374151; border-radius: 2px; transition: all .25s;
  }
  .sh-mobile-menu {
    display: none; position: fixed;
    top: 52px; left: 0; right: 0;
    background: #fff; border-bottom: 1px solid #e8edf3;
    flex-direction: column;
    padding: 10px 20px 16px;
    z-index: 299;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    max-height: calc(100vh - 52px); overflow-y: auto;
  }
  .sh-mobile-menu.open { display: flex; gap: 1px; }
  .sh-mobile-menu .sh-nav-link { display: block; padding: 10px 12px; }
  .sh-mobile-menu .sh-nav-link--sub { padding-left: 24px; font-size: 13px; color: #6b7280; font-weight: 400; }
  .sh-mobile-group-title {
    font-size: 10.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .07em; color: #9ca3af; padding: 10px 12px 4px;
  }
  .sh-mobile-sep { height: 1px; background: #e8edf3; margin: 6px 0; }
  @media (max-width: 768px) {
    .sh-topbar__nav { display: none; }
    .sh-btn-login-wrap { display: none !important; }
    .sh-hamburger { display: flex; }
  }
</style>`;

  /* ── HTML ── */
  const HTML = `
<header class="sh-topbar" role="banner" id="sharedHeader">
  <nav class="sh-topbar__nav" role="navigation" aria-label="Menu chính">
    <a href="index.html" class="sh-nav-link" data-page="home">Trang Chủ</a>
    <div class="sh-nav-item" id="shNavAbout">
      <button class="sh-nav-link--btn" aria-haspopup="true" aria-expanded="false"
              data-page="about"
              onclick="SHNav.toggleDrop('shNavAbout')">
        Giới Thiệu <i class="fas fa-chevron-down sh-nav-chevron"></i>
      </button>
      <div class="sh-nav-dropdown" role="menu">
        <a href="about.html"         class="sh-nav-dd-item" role="menuitem">Về Nhà Trường</a>
        <a href="about.html#mission" class="sh-nav-dd-item" role="menuitem">Sứ Mệnh &amp; Tầm Nhìn</a>
        <a href="about.html#team"    class="sh-nav-dd-item" role="menuitem">Ban Giám Hiệu</a>
        <a href="about.html#history" class="sh-nav-dd-item" role="menuitem">Lịch Sử Hình Thành</a>
      </div>
    </div>
    <div class="sh-nav-item" id="shNavPortal">
      <button class="sh-nav-link--btn" aria-haspopup="true" aria-expanded="false"
              onclick="SHNav.toggleDrop('shNavPortal')">
        Cổng Thông Tin <i class="fas fa-chevron-down sh-nav-chevron"></i>
      </button>
      <div class="sh-nav-dropdown" role="menu">
        <span class="sh-nav-dd-item sh-nav-dd-item--head">Học Sinh &amp; Phụ Huynh</span>
        <a href="student.html" class="sh-nav-dd-item" role="menuitem"
           onclick="SHNav.roleLink(event,'student')">Cổng Học Sinh</a>
        <a href="parents.html" class="sh-nav-dd-item" role="menuitem"
           onclick="SHNav.roleLink(event,'parent')">Cổng Phụ Huynh</a>
        <div class="sh-nav-dd-sep"></div>
        <span class="sh-nav-dd-item sh-nav-dd-item--head">Quản Lý</span>
        <a href="#" class="sh-nav-dd-item" role="menuitem"
           onclick="SHNav.roleLink(event,'training')">Phòng Đào Tạo</a>
      </div>
    </div>
    <div class="sh-nav-item" id="shNavNews">
      <button class="sh-nav-link--btn" aria-haspopup="true" aria-expanded="false"
              data-page="news"
              onclick="SHNav.toggleDrop('shNavNews')">
        Tin Tức <i class="fas fa-chevron-down sh-nav-chevron"></i>
      </button>
      <div class="sh-nav-dropdown sh-nav-dropdown--right" role="menu">
        <a href="news.html"              class="sh-nav-dd-item" role="menuitem">Tất Cả Tin Tức</a>
        <a href="news.html?cat=event"    class="sh-nav-dd-item" role="menuitem">Sự Kiện &amp; Hoạt Động</a>
        <a href="news.html?cat=academic" class="sh-nav-dd-item" role="menuitem">Học Thuật &amp; Thi Cử</a>
        <a href="news.html?cat=notice"   class="sh-nav-dd-item" role="menuitem">Thông Báo Nhà Trường</a>
      </div>
    </div>
    <a href="contact.html" class="sh-nav-link" data-page="contact">Liên Hệ</a>
  </nav>
  <div class="sh-divider" aria-hidden="true"></div>
  <div class="sh-btn-login-wrap" id="shAuthArea"
       style="position:relative;flex-shrink:0;display:flex;align-items:center;gap:10px;">
    <a href="#" class="sh-btn-login" id="shLoginBtn"
       style="display:inline-flex;align-items:center;gap:6px;"
       onclick="SHNav.openLogin(event)">
      Đăng nhập
    </a>
    <button class="sh-user-btn" id="shUserBtn" style="display:none;"
            onclick="SHNav.toggleUserDrop()"
            aria-haspopup="true" aria-expanded="false">
      <span id="shUserName">Người dùng</span>
      <i class="fas fa-chevron-down sh-user-chevron"></i>
    </button>
    <div class="sh-user-dropdown" id="shUserDropdown" role="menu">
      <div class="sh-user-dropdown__header">
        <div class="sh-user-dropdown__name" id="shDropName">Người dùng</div>
        <div class="sh-user-dropdown__role" id="shDropRole">Vai trò</div>
      </div>
      <div class="sh-user-dropdown__sep"></div>
      <a href="student.html" class="sh-user-dropdown__item" id="shDropProfile">Hồ sơ cá nhân</a>
      <a href="#"            class="sh-user-dropdown__item">Đổi mật khẩu</a>
      <a href="#"            class="sh-user-dropdown__item">Cài đặt tài khoản</a>
      <div class="sh-user-dropdown__sep"></div>
      <a href="#" class="sh-user-dropdown__item--danger"
         onclick="SHNav.logout(event)">Đăng xuất</a>
    </div>
  </div>
  <button class="sh-hamburger" id="shHamburger"
          aria-label="Mở menu" aria-expanded="false" aria-controls="shMobileMenu">
    <span></span><span></span><span></span>
  </button>
</header>
<nav class="sh-mobile-menu" id="shMobileMenu" role="navigation" aria-label="Menu di động">
  <a href="index.html"  class="sh-nav-link" data-page="home">Trang Chủ</a>
  <div class="sh-mobile-group-title">Giới Thiệu</div>
  <a href="about.html"         class="sh-nav-link sh-nav-link--sub">Về Nhà Trường</a>
  <a href="about.html#mission" class="sh-nav-link sh-nav-link--sub">Sứ Mệnh &amp; Tầm Nhìn</a>
  <a href="about.html#team"    class="sh-nav-link sh-nav-link--sub">Ban Giám Hiệu</a>
  <div class="sh-mobile-group-title">Cổng Thông Tin</div>
  <a href="student.html" class="sh-nav-link sh-nav-link--sub"
     onclick="SHNav.roleLink(event,'student')">Cổng Học Sinh</a>
  <a href="parents.html" class="sh-nav-link sh-nav-link--sub"
     onclick="SHNav.roleLink(event,'parent')">Cổng Phụ Huynh</a>
  <a href="#"            class="sh-nav-link sh-nav-link--sub"
     onclick="SHNav.roleLink(event,'training')">Phòng Đào Tạo</a>
  <div class="sh-mobile-group-title">Tin Tức</div>
  <a href="news.html"              class="sh-nav-link sh-nav-link--sub">Tất Cả Tin Tức</a>
  <a href="news.html?cat=event"    class="sh-nav-link sh-nav-link--sub">Sự Kiện &amp; Hoạt Động</a>
  <a href="news.html?cat=notice"   class="sh-nav-link sh-nav-link--sub">Thông Báo Nhà Trường</a>
  <a href="contact.html" class="sh-nav-link" data-page="contact">Liên Hệ</a>
  <div class="sh-mobile-sep"></div>
  <a href="#" class="sh-btn-login" style="text-align:center;display:block;"
     onclick="SHNav.openLogin(event)">Đăng nhập</a>
</nav>`;

  /* ── Mount: inject CSS + HTML vào đầu body ── */
  function mount() {
    // CSS
    if (!document.getElementById('shared-header-css')) {
      document.head.insertAdjacentHTML('beforeend', CSS);
    }
    // Header HTML — thay thế mount point nếu có, không thì prepend body
    const mount = document.getElementById('sharedHeaderMount');
    if (mount) {
      mount.outerHTML = HTML;
    } else {
      document.body.insertAdjacentHTML('afterbegin', HTML);
    }
    init();
  }

  /* ── Active link theo pathname ── */
  function setActiveLink() {
    const file = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const pageMap = { index: 'home', home: 'home', about: 'about', news: 'news', contact: 'contact' };
    // Cũng đọc ?page= param (dùng bởi coming-soon)
    const param = new URLSearchParams(window.location.search).get('page') || file;
    const active = pageMap[param] || pageMap[file];
    if (!active) return;
    document.querySelectorAll('#sharedHeader [data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === active);
    });
    document.querySelectorAll('#shMobileMenu [data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === active);
    });
  }

  /* ── Session helpers ── */
  function getSession() {
    try { return JSON.parse(sessionStorage.getItem('spms_user')); } catch { return null; }
  }

  /* ── Update auth area ── */
  function updateAuth() {
    const user = getSession();
    const loginBtn  = document.getElementById('shLoginBtn');
    const userBtn   = document.getElementById('shUserBtn');
    const userName  = document.getElementById('shUserName');
    const dropName  = document.getElementById('shDropName');
    const dropRole  = document.getElementById('shDropRole');
    const dropProf  = document.getElementById('shDropProfile');
    if (!loginBtn) return;
    if (user) {
      loginBtn.style.display = 'none';
      userBtn.style.display  = 'inline-flex';
      if (userName) userName.textContent = user.name || 'Người dùng';
      if (dropName) dropName.textContent = user.name || 'Người dùng';
      if (dropRole) dropRole.textContent = user.role || '';
      // Điều hướng profile theo roleKey
      if (dropProf) {
        const rk = (user.roleKey || '').toLowerCase();
        dropProf.href = rk === 'parent' ? 'parents.html' : 'student.html';
      }
    } else {
      loginBtn.style.display = 'inline-flex';
      userBtn.style.display  = 'none';
    }
  }

  /* ── Nav dropdown logic ── */
  window.SHNav = {
    toggleDrop(id) {
      const item = document.getElementById(id);
      const btn  = item && item.querySelector('.sh-nav-link--btn');
      const isOpen = item && item.classList.contains('open');
      // Đóng tất cả
      document.querySelectorAll('.sh-nav-item.open').forEach(el => {
        el.classList.remove('open');
        const b = el.querySelector('.sh-nav-link--btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen && item) {
        item.classList.add('open');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    },

    toggleUserDrop() {
      const dd  = document.getElementById('shUserDropdown');
      const btn = document.getElementById('shUserBtn');
      const isOpen = dd && dd.classList.toggle('open');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    },

    openLogin(e) {
      if (e) e.preventDefault();
      // Nếu đang ở index.html — dùng openLoginModal của trang đó
      if (typeof openLoginModal === 'function') {
        openLoginModal(e);
        return;
      }
      // Từ các trang khác — redirect về index.html?login=1
      window.location.href = 'index.html?login=1';
    },

    logout(e) {
      if (e) e.preventDefault();
      if (typeof window.confirmLogout === 'function') {
        window.confirmLogout(e);
        return;
      }
      sessionStorage.removeItem('spms_user');
      updateAuth();
      const dd = document.getElementById('shUserDropdown');
      if (dd) dd.classList.remove('open');
      window.location.href = 'index.html';
    },

    roleLink(e, role) {
      if (e) e.preventDefault();
      const user = getSession();
      const dest = role === 'student' ? 'student.html'
                 : role === 'parent'  ? 'parents.html'
                 : 'index.html';
      if (!user) { SHNav.openLogin(e); return; }
      window.location.href = dest;
    },
  };

  /* ── Mobile hamburger ── */
  function bindHamburger() {
    const btn  = document.getElementById('shHamburger');
    const menu = document.getElementById('shMobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  /* ── Close dropdowns on outside click & Escape ── */
  function bindGlobal() {
    document.addEventListener('click', e => {
      if (!e.target.closest('.sh-nav-item')) {
        document.querySelectorAll('.sh-nav-item.open').forEach(el => {
          el.classList.remove('open');
          const b = el.querySelector('.sh-nav-link--btn');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
      if (!e.target.closest('#shAuthArea')) {
        const dd = document.getElementById('shUserDropdown');
        if (dd) dd.classList.remove('open');
        const btn = document.getElementById('shUserBtn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
      const menu = document.getElementById('shMobileMenu');
      const ham  = document.getElementById('shHamburger');
      if (menu && ham && !menu.contains(e.target) && !ham.contains(e.target)) {
        menu.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.sh-nav-item.open').forEach(el => {
        el.classList.remove('open');
        const b = el.querySelector('.sh-nav-link--btn');
        if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
      });
    });
  }

  /* ── Init ── */
  function init() {
    setActiveLink();
    updateAuth();
    bindHamburger();
    bindGlobal();
  }

  /* ── Auto-mount khi DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
