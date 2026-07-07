/**
 * AUTH SERVICE
 * Đăng nhập, đăng xuất, kiểm tra phiên
 */
import api from '../../../api/request.js';
import { normalizeSuccess, normalizeError } from '../../../api/response.js';
import TokenManager from '../../../api/tokenManager.js';
import store from '../../../store/AppStore.js';

const AuthService = {
  /**
   * Đăng nhập
   * @param {{ username, password }} credentials
   */
  async login({ username, password }) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const result = normalizeSuccess(response);

      const { token, refreshToken, user } = result.data;

      // Lưu vào localStorage
      TokenManager.setToken(token);
      TokenManager.setRefreshToken(refreshToken);
      TokenManager.setUser(user);

      // Cập nhật store
      store.batch({
        'auth.user':        user,
        'auth.token':       token,
        'auth.role':        user.role,
        'auth.permissions': user.permissions || [],
        'auth.isLoggedIn':  true,
      });

      return { success: true, data: result.data };
    } catch (error) {
      return normalizeError(error);
    }
  },

  /**
   * Đăng xuất
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout cục bộ dù API lỗi
    } finally {
      TokenManager.clearAll();
      store.reset();
      window.location.hash = '#/login';
    }
  },

  /**
   * Lấy thông tin user hiện tại từ API
   */
  async me() {
    try {
      const response = await api.get('/auth/me');
      const result = normalizeSuccess(response);
      const user = result.data;

      // Cập nhật store với thông tin mới nhất
      TokenManager.setUser(user);
      store.batch({
        'auth.user':        user,
        'auth.role':        user.role,
        'auth.permissions': user.permissions || [],
      });

      return user;
    } catch (error) {
      return null;
    }
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword({ oldPassword, newPassword }) {
    try {
      const response = await api.put('/auth/change-password', { oldPassword, newPassword });
      return normalizeSuccess(response);
    } catch (error) {
      return normalizeError(error);
    }
  },

  /**
   * Gửi email đặt lại mật khẩu
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return normalizeSuccess(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
};

export default AuthService;
