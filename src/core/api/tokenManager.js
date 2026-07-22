/**
 * TOKEN MANAGER
 * Quản lý JWT token trong localStorage
 */
import AppConfig from '../config/app.config.js';

const TokenManager = {
  /**
   * Lưu access token
   */
  setToken(token) {
    localStorage.setItem(AppConfig.tokenKey, token);
  },

  /**
   * Lấy access token
   */
  getToken() {
    return localStorage.getItem(AppConfig.tokenKey);
  },

  /**
   * Lưu refresh token
   */
  setRefreshToken(token) {
    localStorage.setItem(AppConfig.refreshKey, token);
  },

  /**
   * Lấy refresh token
   */
  getRefreshToken() {
    return localStorage.getItem(AppConfig.refreshKey);
  },

  /**
   * Kiểm tra token có tồn tại
   */
  hasToken() {
    return !!this.getToken();
  },

  /**
   * Kiểm tra token có hết hạn chưa
   */
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  /**
   * Decode JWT payload (không verify)
   */
  decodeToken(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },

  /**
   * Xóa tất cả tokens (logout)
   */
  clearAll() {
    localStorage.removeItem(AppConfig.tokenKey);
    localStorage.removeItem(AppConfig.refreshKey);
    localStorage.removeItem(AppConfig.userKey);
  },

  /**
   * Lưu user info
   */
  setUser(user) {
    localStorage.setItem(AppConfig.userKey, JSON.stringify(user));
  },

  /**
   * Lấy user info
   */
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(AppConfig.userKey));
    } catch {
      return null;
    }
  },
};

export default TokenManager;
