/**
 * HASH-BASED SPA ROUTER
 * Routing với hash (#/path) — không cần server config
 */
import PermissionChecker from '../permissions/PermissionChecker.js';

class Router {
  constructor() {
    this._routes = [];
    this._notFoundHandler = null;
    this._beforeEach = null;
    this._currentPath = null;
  }

  /**
   * Đăng ký route
   * @param {string}   path
   * @param {Function} handler  - async function({ params, query })
   * @param {Object}   [options]
   * @param {boolean}  [options.auth]       - yêu cầu đăng nhập
   * @param {string[]} [options.permissions] - quyền cần có
   * @param {string[]} [options.roles]       - roles được phép
   */
  add(path, handler, options = {}) {
    this._routes.push({ path, handler, options });
    return this;
  }

  /**
   * Middleware chạy trước mỗi route
   * @param {Function} fn - async fn({ to, from }) → true|false|string(redirect)
   */
  beforeEach(fn) {
    this._beforeEach = fn;
    return this;
  }

  /**
   * Handler khi không tìm thấy route
   */
  notFound(handler) {
    this._notFoundHandler = handler;
    return this;
  }

  /**
   * Điều hướng tới path
   */
  push(path) {
    window.location.hash = `#${path}`;
  }

  /**
   * Replace history entry
   */
  replace(path) {
    const url = window.location.href.split('#')[0] + `#${path}`;
    window.history.replaceState(null, '', url);
    this._resolve();
  }

  /**
   * Khởi động router — lắng nghe hashchange
   */
  init() {
    window.addEventListener('hashchange', () => this._resolve());
    window.addEventListener('load',       () => this._resolve());
  }

  async _resolve() {
    const hash = window.location.hash || '#/';
    const rawPath = hash.replace('#', '').split('?')[0] || '/';
    const query = this._parseQuery(hash);
    const from = this._currentPath;

    // Tìm route match
    let matched = null;
    let params = {};

    for (const route of this._routes) {
      const result = this._matchPath(route.path, rawPath);
      if (result) {
        matched = route;
        params = result;
        break;
      }
    }

    if (!matched) {
      this._notFoundHandler?.();
      return;
    }

    // ── Guards ──

    // 1. Auth guard
    if (matched.options.auth && !PermissionChecker.isAuthenticated()) {
      this.replace('/login');
      return;
    }

    // 2. Redirect logged-in users away from auth pages
    if (matched.options.guestOnly && PermissionChecker.isAuthenticated()) {
      this.replace('/dashboard');
      return;
    }

    // 3. Permission guard
    if (matched.options.permissions?.length) {
      if (!PermissionChecker.canAny(matched.options.permissions)) {
        this.replace('/403');
        return;
      }
    }

    // 4. Role guard
    if (matched.options.roles?.length) {
      if (!PermissionChecker.hasAnyRole(matched.options.roles)) {
        this.replace('/403');
        return;
      }
    }

    // 5. Global beforeEach middleware
    if (this._beforeEach) {
      const result = await this._beforeEach({ to: rawPath, from, params, query });
      if (result === false) return;
      if (typeof result === 'string') {
        this.replace(result);
        return;
      }
    }

    this._currentPath = rawPath;
    await matched.handler({ params, query });
  }

  /**
   * Khớp path với params
   * '/students/:id' vs '/students/123' → { id: '123' }
   */
  _matchPath(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts    = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  _parseQuery(hash) {
    const queryStr = hash.split('?')[1];
    if (!queryStr) return {};
    return Object.fromEntries(new URLSearchParams(queryStr));
  }
}

// Singleton
const router = new Router();
export default router;
