/**
 * PUBLIC LAYOUT
 * Dùng cho: Trang chủ, Giới thiệu, Tin tức, Liên hệ
 * Thành phần: Navbar + Content + Footer
 */
import router from '../../router/Router.js';

class PublicLayout {
  constructor() {
    this._app = document.getElementById('app');
  }

  /**
   * Render layout với content bên trong
   * @param {string} contentHTML
   * @param {string} [activeNav] - 'home'|'about'|'news'|'contact'
   */
  render(contentHTML, activeNav = 'home') {
    this._app.innerHTML = `
      <div class="public-layout">
        ${this._renderNavbar(activeNav)}
        <main class="public-layout__main" id="main-content">
          ${contentHTML}
        </main>
        ${this._renderFooter()}
      </div>
    `;

    this._bindEvents();
  }

  _renderNavbar(activeNav) {
    const links = [
      { id: 'home',    label: 'Trang Chủ', path: '/' },
      { id: 'about',   label: 'Giới Thiệu', path: '/about' },
      { id: 'news',    label: 'Tin tức',    path: '/news' },
      { id: 'contact', label: 'Liên hệ',    path: '/contact' },
    ];

    const navLinks = links.map(link => `
      <a href="#${link.path}"
         class="public-navbar__nav-link ${activeNav === link.id ? 'active' : ''}"
         aria-current="${activeNav === link.id ? 'page' : 'false'}">
        ${link.label}
      </a>
    `).join('');

    return `
      <header class="public-navbar" role="banner">
        <div class="public-navbar__inner">

          <!-- Logo -->
          <a href="#/" class="public-navbar__logo" aria-label="Trang chủ SPMS">
            <div class="public-navbar__logo-badge">SP</div>
            <div class="public-navbar__logo-text hide-mobile">
              Hệ Thống<br>Quản Lý HSNL
            </div>
          </a>

          <!-- Desktop Nav -->
          <nav class="public-navbar__nav" role="navigation" aria-label="Menu chính">
            ${navLinks}
          </nav>

          <!-- Actions -->
          <div class="public-navbar__actions">
            <a href="#/login" class="btn btn-primary btn-sm">
              <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
              Đăng nhập
            </a>
          </div>

          <!-- Hamburger (mobile) -->
          <button class="public-navbar__hamburger" id="navHamburger"
                  aria-label="Mở menu" aria-expanded="false"
                  aria-controls="mobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <!-- Mobile Menu -->
        <nav class="public-navbar__mobile-menu" id="mobileMenu"
             role="navigation" aria-label="Menu di động">
          ${links.map(l => `
            <a href="#${l.path}"
               class="public-navbar__nav-link ${activeNav === l.id ? 'active' : ''}">
              ${l.label}
            </a>
          `).join('')}
          <a href="#/login" class="btn btn-primary btn-block mt-4">
            <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
            Đăng nhập
          </a>
        </nav>
      </header>
    `;
  }

  _renderFooter() {
    return `
      <footer class="public-footer" role="contentinfo">
        <p>© 2026 Hệ Thống Quản Lý Giáo Dục. Tất cả các quyền được bảo lưu.</p>
      </footer>
    `;
  }

  _bindEvents() {
    // Mobile hamburger toggle
    const btn   = document.getElementById('navHamburger');
    const menu  = document.getElementById('mobileMenu');

    btn?.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    menu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        btn?.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

export default PublicLayout;
