/**
 * ERROR HANDLER
 * Xử lý lỗi HTTP tập trung
 */
import TokenManager from './tokenManager.js';
import store from '../store/AppStore.js';

export const handleResponseError = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  switch (status) {
    case 400:
      // Bad request — để module xử lý hiển thị lỗi form
      break;

    case 401:
      // Unauthorized — đăng xuất và redirect
      TokenManager.clearAll();
      store.reset();
      window.location.hash = '#/login';
      break;

    case 403:
      // Forbidden — không có quyền
      window.location.hash = '#/403';
      break;

    case 404:
      // Not found
      window.location.hash = '#/404';
      break;

    case 422:
      // Validation errors — để module xử lý
      break;

    case 429:
      // Too many requests
      showErrorToast('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
      break;

    case 500:
    case 502:
    case 503:
      showErrorToast(message || 'Lỗi hệ thống. Vui lòng thử lại sau.');
      break;

    default:
      if (!window.navigator.onLine) {
        showErrorToast('Mất kết nối mạng. Vui lòng kiểm tra lại.');
      }
      break;
  }
};

const showErrorToast = (message) => {
  // Import dynamic để tránh circular dependency
  import('../components/common/Toast.js').then(({ Toast }) => {
    Toast.error('Lỗi', message);
  });
};
