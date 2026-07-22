/**
 * APP STORE — Centralized State Management
 * Pattern: Observable / Pub-Sub (không dùng Redux/Vuex)
 */
class AppStore {
  constructor() {
    this._state = {
      auth: {
        user:        null,
        token:       null,
        refreshToken:null,
        role:        null,
        permissions: [],
        isLoggedIn:  false,
      },
      menu: {
        items:       [],
        activeId:    null,
        collapsed:   false,
      },
      notifications: {
        list:        [],
        unreadCount: 0,
      },
      theme: {
        mode: 'light',
      },
      loading: {
        global: false,
        page:   false,
      },
    };

    this._listeners = {}; // { 'auth': [fn1, fn2], 'theme': [fn3] }
  }

  /**
   * Get current state (deep clone to prevent mutation)
   * @param {string} [key] - Dot-notation key, e.g. 'auth.user'
   */
  get(key) {
    if (!key) return this._deepClone(this._state);
    return key.split('.').reduce((obj, k) => obj?.[k], this._state);
  }

  /**
   * Update state and notify listeners
   * @param {string} key  - e.g. 'auth.isLoggedIn'
   * @param {*}      value
   */
  set(key, value) {
    const keys = key.split('.');
    let target = this._state;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in target)) target[keys[i]] = {};
      target = target[keys[i]];
    }

    target[keys[keys.length - 1]] = value;
    this._notify(keys[0]);
  }

  /**
   * Subscribe to state changes
   * @param {string}   key - Top-level key: 'auth', 'menu', 'theme'...
   * @param {Function} fn
   * @returns {Function} unsubscribe function
   */
  subscribe(key, fn) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(fn);

    // Return unsubscribe
    return () => {
      this._listeners[key] = this._listeners[key].filter(l => l !== fn);
    };
  }

  /**
   * Batch update multiple keys at once
   * @param {Object} updates - { 'auth.user': user, 'auth.token': token }
   */
  batch(updates) {
    const topKeys = new Set();
    for (const [key, value] of Object.entries(updates)) {
      const keys = key.split('.');
      let target = this._state;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in target)) target[keys[i]] = {};
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      topKeys.add(keys[0]);
    }
    topKeys.forEach(k => this._notify(k));
  }

  _notify(key) {
    const listeners = this._listeners[key] || [];
    const state = this.get(key);
    listeners.forEach(fn => fn(state));

    // Also notify wildcard listeners
    const wildcardListeners = this._listeners['*'] || [];
    wildcardListeners.forEach(fn => fn({ key, value: state }));
  }

  _deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Reset entire store (e.g. on logout)
   */
  reset() {
    this._state.auth = {
      user: null, token: null, refreshToken: null,
      role: null, permissions: [], isLoggedIn: false,
    };
    this._state.menu = { items: [], activeId: null, collapsed: false };
    this._state.notifications = { list: [], unreadCount: 0 };
    this._notify('auth');
    this._notify('menu');
    this._notify('notifications');
  }
}

// Singleton
const store = new AppStore();
export default store;
