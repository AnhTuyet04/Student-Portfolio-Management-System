/**
 * TOAST NOTIFICATION COMPONENT
 * Sử dụng: Toast.success('Tiêu đề', 'Nội dung')
 *          Toast.error('Lỗi', 'Chi tiết lỗi')
 */
const ICONS = {
  success: 'fas fa-check-circle',
  error:   'fas fa-times-circle',
  warning: 'fas fa-exclamation-circle',
  info:    'fas fa-info-circle',
};

const DEFAULT_DURATION = 4000;

export const Toast = {
  _container: null,

  _getContainer() {
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.className = 'toast-container';
      this._container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this._container);
    }
    return this._container;
  },

  /**
   * Hiển thị toast
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {string} title
   * @param {string} [message]
   * @param {number} [duration]
   */
  show(type, title, message = '', duration = DEFAULT_DURATION) {
    const container = this._getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
      <i class="${ICONS[type]} toast__icon" aria-hidden="true"></i>
      <div class="toast__content">
        <div class="toast__title">${this._escape(title)}</div>
        ${message ? `<div class="toast__message">${this._escape(message)}</div>` : ''}
      </div>
      <button class="toast__close" aria-label="Đóng thông báo">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    `;

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => {
      this._dismiss(toast);
    });

    container.appendChild(toast);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this._dismiss(toast), duration);
    }

    return toast;
  },

  success(title, message, duration) {
    return this.show('success', title, message, duration);
  },

  error(title, message, duration) {
    return this.show('error', title, message, duration);
  },

  warning(title, message, duration) {
    return this.show('warning', title, message, duration);
  },

  info(title, message, duration) {
    return this.show('info', title, message, duration);
  },

  _dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    // Fallback
    setTimeout(() => toast.remove(), 400);
  },

  _escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};

export default Toast;
