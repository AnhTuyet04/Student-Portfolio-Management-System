/**
 * LOGOUT CONFIRM HELPER
 * Tao modal xac nhan dang xuat dung chung va tra ve Promise<boolean>.
 */
(function attachLogoutConfirm(global) {
  let modalRoot = null;
  let confirmBtn = null;
  let cancelBtn = null;
  let closeBtn = null;
  let backdrop = null;
  let resolver = null;

  function ensureModal() {
    if (modalRoot) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'logoutConfirmModal';
    wrapper.className = 'logout-confirm';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.innerHTML = `
      <div class="logout-confirm__backdrop" data-logout-close="backdrop"></div>
      <div class="logout-confirm__dialog" role="dialog" aria-modal="true" aria-labelledby="logoutConfirmTitle" aria-describedby="logoutConfirmMessage">
        <div class="logout-confirm__header">
          <div class="logout-confirm__intro">
            <div class="logout-confirm__icon-wrap" aria-hidden="true">
              <i class="fas fa-arrow-right-from-bracket"></i>
            </div>
            <div>
              <div class="logout-confirm__title" id="logoutConfirmTitle">Xác nhận đăng xuất?</div>
              <div class="logout-confirm__message" id="logoutConfirmMessage">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</div>
              <div class="logout-confirm__sub" id="logoutConfirmSub">Mọi phiên làm việc chưa lưu sẽ bị đóng.</div>
            </div>
          </div>
          <button class="logout-confirm__close" type="button" aria-label="Đóng" data-logout-close="icon">
            <i class="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div class="logout-confirm__divider"></div>
        <div class="logout-confirm__actions">
          <button class="logout-confirm__btn logout-confirm__btn--cancel" type="button" data-logout-action="cancel">Hủy bỏ</button>
          <button class="logout-confirm__btn logout-confirm__btn--danger" type="button" data-logout-action="confirm">Đăng xuất</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);

    modalRoot = wrapper;
    confirmBtn = wrapper.querySelector('[data-logout-action="confirm"]');
    cancelBtn = wrapper.querySelector('[data-logout-action="cancel"]');
    closeBtn = wrapper.querySelector('[data-logout-close="icon"]');
    backdrop = wrapper.querySelector('[data-logout-close="backdrop"]');

    confirmBtn.addEventListener('click', () => close(true));
    cancelBtn.addEventListener('click', () => close(false));
    closeBtn.addEventListener('click', () => close(false));
    backdrop.addEventListener('click', () => close(false));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalRoot.classList.contains('open')) {
        close(false);
      }
    });
  }

  function close(confirmed) {
    if (!modalRoot) return;
    modalRoot.classList.remove('open');
    modalRoot.setAttribute('aria-hidden', 'true');

    if (resolver) {
      const fn = resolver;
      resolver = null;
      fn(!!confirmed);
    }
  }

  function confirm(options) {
    ensureModal();

    const opts = options || {};
    const title = opts.title || 'Xác nhận đăng xuất?';
    const message = opts.message || 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?';
    const sub = opts.subMessage || 'Mọi phiên làm việc chưa lưu sẽ bị đóng.';
    const cancelLabel = opts.cancelLabel || 'Hủy bỏ';
    const confirmLabel = opts.confirmLabel || 'Đăng xuất';

    const titleNode = document.getElementById('logoutConfirmTitle');
    const messageNode = document.getElementById('logoutConfirmMessage');
    const subNode = document.getElementById('logoutConfirmSub');
    if (titleNode) titleNode.textContent = title;
    if (messageNode) messageNode.textContent = message;
    if (subNode) subNode.textContent = sub;
    if (cancelBtn) cancelBtn.textContent = cancelLabel;
    if (confirmBtn) confirmBtn.textContent = confirmLabel;

    modalRoot.classList.add('open');
    modalRoot.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      if (confirmBtn) confirmBtn.focus();
    }, 0);

    return new Promise((resolve) => {
      resolver = resolve;
    });
  }

  global.SPMSLogoutConfirm = {
    confirm,
  };
})(window);
