/**
 * APP BOOTSTRAP
 * Entry point: khởi động router, store, restore session
 */
import router from './router/Router.js';
import store from './core/store/AppStore.js';
import TokenManager from './core/api/tokenManager.js';
import { registerPublicRoutes } from './router/routes/publicRoutes.js';
import { registerAuthRoutes } from './router/routes/authRoutes.js';
import { registerProtectedRoutes } from './router/routes/protectedRoutes.js';

class App {
  async init() {
    // 1. Restore session từ localStorage
    this._restoreSession();

    // 2. Đăng ký routes
    this._registerRoutes();

    // 3. Not found handler
    router.notFound(() => {
      import('./modules/error/pages/Error404Page.js').then(({ default: Page }) => {
        new Page().render();
      });
    });

    // 4. Khởi động router
    router.init();

    console.log('[SPMS] App initialized');
  }

  _restoreSession() {
    const token = TokenManager.getToken();
    const user  = TokenManager.getUser();

    if (token && user && !TokenManager.isTokenExpired(token)) {
      store.batch({
        'auth.user':        user,
        'auth.token':       token,
        'auth.role':        user.role,
        'auth.permissions': user.permissions || [],
        'auth.isLoggedIn':  true,
      });
    } else if (token) {
      // Token hết hạn → xóa
      TokenManager.clearAll();
    }

    // Restore theme
    const savedTheme = localStorage.getItem('spms_theme') || 'light';
    store.set('theme.mode', savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  _registerRoutes() {
    registerPublicRoutes();
    registerAuthRoutes();
    registerProtectedRoutes();
  }
}

// Bootstrap khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  new App().init();
});
