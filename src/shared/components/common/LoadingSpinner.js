/**
 * LOADING SPINNER COMPONENT
 * Sử dụng: LoadingSpinner.show() / LoadingSpinner.hide()
 */
import store from '../../../core/store/AppStore.js';

export const LoadingSpinner = {
  _overlay: null,

  _getOverlay() {
    if (!this._overlay) {
      this._overlay = document.createElement('div');
      this._overlay.className = 'loading-overlay hidden';
      this._overlay.setAttribute('role', 'status');
      this._overlay.setAttribute('aria-label', 'Đang tải...');
      this._overlay.innerHTML = `
        <div class="flex flex-col items-center gap-4">
          <div class="spinner spinner--lg"></div>
          <span class="text-sm text-muted" aria-live="polite">Đang tải...</span>
        </div>
      `;
      document.body.appendChild(this._overlay);
    }
    return this._overlay;
  },

  show(message = 'Đang tải...') {
    const overlay = this._getOverlay();
    const label = overlay.querySelector('[aria-live]');
    if (label) label.textContent = message;
    overlay.classList.remove('hidden');
    store.set('loading.global', true);
  },

  hide() {
    this._getOverlay().classList.add('hidden');
    store.set('loading.global', false);
  },
};

export default LoadingSpinner;
