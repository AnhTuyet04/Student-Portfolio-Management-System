/**
 * AXIOS REQUEST INSTANCE
 * Cấu hình trung tâm cho tất cả HTTP requests
 */
import AppConfig from '../config/app.config.js';
import TokenManager from './tokenManager.js';
import { handleResponseError } from './errorHandler.js';
import { tryRefreshToken } from './refreshToken.js';

// Tạo Axios instance
const api = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  timeout: AppConfig.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-App-Version': AppConfig.version,
  },
});

// ── Request Interceptor: Đính kèm JWT token ──
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Xử lý lỗi tập trung ──
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 — Token hết hạn → thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await tryRefreshToken();
        TokenManager.setToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleResponseError({ response: { status: 401 } });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý các lỗi khác
    handleResponseError(error);
    return Promise.reject(error);
  }
);

export default api;
