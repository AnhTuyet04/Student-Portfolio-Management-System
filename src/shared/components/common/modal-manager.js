/** Chuẩn hóa hành vi và khả năng truy cập cho modal toàn hệ thống. */
(function () {
  'use strict';

  const ROOT_SELECTOR = [
    '.modal-overlay', '.overlay[id$="Modal"]', '.overlay[id$="Overlay"]', '.fp-overlay',
    '.tdg-history-overlay', '.ar-overlay', '.history-modal',
    '.share-modal', '.proof-modal-overlay', '.cp-overlay',
  ].join(',');
  const DIALOG_SELECTOR = [
    ':scope > .modal', ':scope > .modal-box', ':scope > .login-modal',
    ':scope > .fp-dialog', ':scope > .tdg-history-modal', ':scope > .ar-modal',
    ':scope > .history-modal__dialog', ':scope > .share-modal__dialog',
    ':scope > .proof-modal', ':scope > .cp-dialog', ':scope > section', ':scope > div',
  ].join(',');
  const CLOSE_SELECTOR = [
    '.modal-close', '.close-btn', '.close', '.history-modal__close',
    '.share-modal__close', '.proof-modal__close', '.tdg-history-modal__close',
    '.ar-modal__close', '.cp-close', '[data-modal-close]', '[aria-label="Đóng"]',
    '[onclick*="closeModal"]', '[onclick*="closeConfirm"]',
    '[onclick*="closeProofModal"]', '[onclick*="closeShareModal"]',
    '[onclick*="closeProfileHistoryModal"]',
  ].join(',');
  const TITLE_SELECTOR = [
    '.modal-title', '.login-modal__title', '.fp-title', '.tdg-history-modal__title',
    '.ar-modal__title', '.history-modal__title', '.share-modal__title',
    '.proof-modal__title', 'h1', 'h2', 'h3',
  ].join(',');
  const FOCUSABLE_SELECTOR = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const state = new WeakMap();
  let generatedTitleId = 0;

  const EDIT_MODAL_IDS = new Set([
    'editAchievementModal',
    'rejectAchievementModal', 'createUserModal', 'editUserModal',
    'addRewardOverlay', 'tcRejectModal', 'cpModal', 'fpOverlay',
  ]);
  const DANGER_MODAL_IDS = new Set([
    'deleteModal', 'stopSubjectModal', 'reactivateSubjectModal',
    'toggleLockModal', 'confirmOverlay',
  ]);
  const AUTH_MODAL_IDS = new Set(['loginOverlay']);

  const ACCESSIBILITY_CSS = `
    .spms-modal-root { isolation: isolate; }
    .spms-modal-dialog:focus { outline: none; }
    .spms-modal-dialog :focus-visible {
      outline: 3px solid rgba(30, 58, 138, .28);
      outline-offset: 2px;
    }
    .spms-modal-dialog--view {
      background-color: #fff;
    }
    .spms-modal-dialog--edit {
      background-color: #f3f4f6 !important;
      border-color: #d1d5db !important;
      box-shadow: inset 0 4px 0 #64748b, 0 20px 60px rgba(15, 23, 42, .18) !important;
    }
    .spms-modal-dialog--edit input:not([type="checkbox"]):not([type="radio"]),
    .spms-modal-dialog--edit select,
    .spms-modal-dialog--edit textarea {
      background-color: #fff;
    }
    .spms-modal-dialog--edit > header,
    .spms-modal-dialog--edit > main,
    .spms-modal-dialog--edit > footer,
    .spms-modal-dialog--edit .modal-header,
    .spms-modal-dialog--edit .modal-body,
    .spms-modal-dialog--edit .modal-actions,
    .spms-modal-dialog--edit .modal-hd,
    .spms-modal-dialog--edit .modal-bd,
    .spms-modal-dialog--edit .modal-ft,
    .spms-modal-dialog--edit .ar-modal__header,
    .spms-modal-dialog--edit .ar-modal__body,
    .spms-modal-dialog--edit .cp-header,
    .spms-modal-dialog--edit .cp-body,
    .spms-modal-dialog--edit .cp-footer {
      background-color: #f3f4f6 !important;
    }
    .spms-modal-dialog--danger {
      box-shadow: inset 0 4px 0 #ef4444, 0 20px 60px rgba(127, 29, 29, .18) !important;
    }
  `;

  function isVisible(root) {
    if (!root) return false;
    const style = window.getComputedStyle(root);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function getDialog(root) {
    return root.querySelector(DIALOG_SELECTOR) || root.firstElementChild || root;
  }

  function getFocusable(dialog) {
    return Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(element => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  function applyVisualMode(root, dialog) {
    dialog.classList.remove(
      'spms-modal-dialog--view',
      'spms-modal-dialog--edit',
      'spms-modal-dialog--danger'
    );

    const explicitMode = root.dataset.modalMode;
    if (explicitMode === 'edit' || EDIT_MODAL_IDS.has(root.id)) {
      dialog.classList.add('spms-modal-dialog--edit');
      root.dataset.modalMode = 'edit';
      return;
    }
    if (explicitMode === 'danger' || DANGER_MODAL_IDS.has(root.id)) {
      dialog.classList.add('spms-modal-dialog--danger');
      root.dataset.modalMode = 'danger';
      return;
    }
    if (!AUTH_MODAL_IDS.has(root.id) && dialog.querySelector('form')) {
      dialog.classList.add('spms-modal-dialog--edit');
      root.dataset.modalMode = 'edit';
      return;
    }
    dialog.classList.add('spms-modal-dialog--view');
    root.dataset.modalMode = 'view';
  }

  function normalize(root) {
    if (!root || root.dataset.spmsModalReady === 'true') return;
    const dialog = getDialog(root);
    root.dataset.spmsModalReady = 'true';
    root.classList.add('spms-modal-root');
    dialog.classList.add('spms-modal-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
    applyVisualMode(root, dialog);

    const label = root.getAttribute('aria-labelledby');
    const description = root.getAttribute('aria-describedby');
    if (label && !dialog.hasAttribute('aria-labelledby')) dialog.setAttribute('aria-labelledby', label);
    if (description && !dialog.hasAttribute('aria-describedby')) dialog.setAttribute('aria-describedby', description);
    if (root !== dialog && root.getAttribute('role') === 'dialog') {
      root.removeAttribute('role');
      root.removeAttribute('aria-modal');
      root.removeAttribute('aria-labelledby');
      root.removeAttribute('aria-describedby');
    }

    if (!dialog.hasAttribute('aria-label') && !dialog.hasAttribute('aria-labelledby')) {
      const title = dialog.querySelector(TITLE_SELECTOR);
      if (title) {
        if (!title.id) title.id = `spmsModalTitle${++generatedTitleId}`;
        dialog.setAttribute('aria-labelledby', title.id);
      } else {
        dialog.setAttribute('aria-label', 'Hộp thoại');
      }
    }

    const closeButton = dialog.querySelector(CLOSE_SELECTOR);
    if (closeButton && !closeButton.hasAttribute('aria-label')) {
      closeButton.setAttribute('aria-label', 'Đóng hộp thoại');
    }

    const open = isVisible(root);
    root.setAttribute('aria-hidden', open ? 'false' : 'true');
    state.set(root, { open, returnFocus: null });
    root.addEventListener('click', event => {
      if (event.target === root) requestClose(root);
    });
  }

  function requestClose(root) {
    const closeButton = getDialog(root).querySelector(CLOSE_SELECTOR);
    if (closeButton) {
      closeButton.click();
      return;
    }
    root.classList.remove('open', 'is-open');
    root.style.display = 'none';
    root.setAttribute('aria-hidden', 'true');
    sync(root);
  }

  function sync(root) {
    normalize(root);
    applyVisualMode(root, getDialog(root));
    const modalState = state.get(root);
    const open = isVisible(root);
    root.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open && !modalState.open) {
      modalState.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const dialog = getDialog(root);
      const focusable = getFocusable(dialog);
      window.requestAnimationFrame(() => (focusable[0] || dialog).focus());
    } else if (!open && modalState.open) {
      const returnFocus = modalState.returnFocus;
      if (returnFocus && returnFocus.isConnected) window.requestAnimationFrame(() => returnFocus.focus());
      modalState.returnFocus = null;
    }
    modalState.open = open;
  }

  function topModal() {
    const roots = Array.from(document.querySelectorAll(ROOT_SELECTOR)).filter(isVisible);
    return roots[roots.length - 1] || null;
  }

  function handleKeyboard(event) {
    const root = topModal();
    if (!root) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      requestClose(root);
      return;
    }
    if (event.key !== 'Tab') return;
    const dialog = getDialog(root);
    const focusable = getFocusable(dialog);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function scan() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(root => {
      normalize(root);
      sync(root);
    });
  }

  function init() {
    if (!document.getElementById('spms-modal-manager-css')) {
      const style = document.createElement('style');
      style.id = 'spms-modal-manager-css';
      style.textContent = ACCESSIBILITY_CSS;
      document.head.appendChild(style);
    }
    scan();
    document.addEventListener('keydown', handleKeyboard);
    const observer = new MutationObserver(mutations => {
      let needsScan = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') needsScan = true;
        if (mutation.type === 'attributes' && mutation.target.matches?.(ROOT_SELECTOR)) sync(mutation.target);
      });
      if (needsScan) scan();
    });
    observer.observe(document.body, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style'],
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
