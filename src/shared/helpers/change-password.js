/**
 * CHANGE PASSWORD HELPER
 * Modal đổi mật khẩu dùng chung cho mọi trang.
 * Expose: window.SPMSChangePassword.open()
 *
 * Demo mode: so sánh với mật khẩu lưu trong sessionStorage (spms_user.password)
 * hoặc danh sách DEMO_USERS nếu chưa có API thật.
 */
(function attachChangePassword(global) {
  'use strict';

  let _root    = null;  // wrapper DOM
  let _form    = null;
  let _resolve = null;  // Promise resolver

  /* ── Lấy password hiện tại của user đang đăng nhập ── */
  function _getCurrentPassword() {
    try {
      const u = JSON.parse(sessionStorage.getItem('spms_user'));
      const username = (u?.username || '').toLowerCase();
      if (window.SPMSDatabase) {
        const account = window.SPMSDatabase.find('users', item => String(item.username).toLowerCase() === username);
        const credential = account && window.SPMSDatabase.find('authCredentials', item => item.userId === account.id);
        if (credential?.password) return credential.password;
      }
      // Ưu tiên lấy từ SPMS_DEMO_USERS (đã bao gồm override)
      if (window.SPMS_DEMO_USERS?.[username]) {
        return window.SPMS_DEMO_USERS[username].password;
      }
      // Fallback: lấy từ localStorage overrides
      const overrides = JSON.parse(localStorage.getItem('spms_pw_overrides') || '{}');
      if (overrides[username]) return overrides[username];
      // Fallback cuối: default hardcode
      const defaults = { hs101001: '123456', gv001: '123456', admin: 'admin123', ph001: '123456', teacher: '123456', student: '123456' };
      return defaults[username] || '123456';
    } catch { return '123456'; }
  }

  /* ── Lưu mật khẩu mới (persist + runtime) ── */
  function _saveNewPassword(newPw) {
    try {
      const u = JSON.parse(sessionStorage.getItem('spms_user'));
      const username = (u?.username || '').toLowerCase();
      if (!username) return;

      // Database dùng chung là nguồn chuẩn cho tất cả cổng.
      if (window.SPMSDatabase) {
        const account = window.SPMSDatabase.find('users', item => String(item.username).toLowerCase() === username);
        if (account) {
          const credential = window.SPMSDatabase.find('authCredentials', item => item.userId === account.id);
          if (credential) window.SPMSDatabase.update('authCredentials', credential.id || credential.userId, { password: newPw });
          else window.SPMSDatabase.insert('authCredentials', { id: `CRED_${account.id}`, userId: account.id, password: newPw });
        }
      }

      // 1. Cập nhật runtime store (dùng ngay trong tab này)
      if (window.SPMS_DEMO_USERS?.[username]) {
        window.SPMS_DEMO_USERS[username].password = newPw;
      }

      // 2. Persist vào localStorage (dùng khi reload trang / tab mới)
      const overrides = JSON.parse(localStorage.getItem('spms_pw_overrides') || '{}');
      overrides[username] = newPw;
      localStorage.setItem('spms_pw_overrides', JSON.stringify(overrides));

      // 3. Cập nhật session hiện tại
      u.password = newPw;
      sessionStorage.setItem('spms_user', JSON.stringify(u));
    } catch {}
  }

  /* ── Validate độ mạnh mật khẩu ── */
  function _validateStrength(pw) {
    return pw.length >= 8
        && /[A-Z]/.test(pw)
        && /[a-z]/.test(pw)
        && /[0-9]/.test(pw);
  }

  /* ── Tạo modal DOM (một lần) ── */
  function _ensureModal() {
    if (_root) return;

    _root = document.createElement('div');
    _root.id        = 'cpModal';
    _root.className = 'cp-overlay';
    _root.setAttribute('role', 'dialog');
    _root.setAttribute('aria-modal', 'true');
    _root.setAttribute('aria-labelledby', 'cpTitle');

    _root.innerHTML = `
      <div class="cp-dialog" id="cpDialog">

        <!-- Header -->
        <div class="cp-header">
          <div class="cp-header__left">
            <div class="cp-header__icon" aria-hidden="true">
              <i class="fas fa-lock"></i>
            </div>
            <div>
              <h2 class="cp-title" id="cpTitle">Đổi mật khẩu</h2>
              <p class="cp-subtitle">Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.</p>
            </div>
          </div>
          <button class="cp-close" type="button" aria-label="Đóng" data-cp-close>
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <form class="cp-body" id="cpForm" novalidate autocomplete="off">

          <!-- Mật khẩu hiện tại -->
          <div class="cp-field">
            <label class="cp-label" for="cpCurrent">
              Mật khẩu hiện tại <span class="cp-req">*</span>
            </label>
            <div class="cp-input-wrap">
              <input type="password" id="cpCurrent" class="cp-input"
                     placeholder="Nhập mật khẩu hiện tại..."
                     autocomplete="current-password" required />
              <button type="button" class="cp-eye" data-eye="cpCurrent" aria-label="Hiện mật khẩu">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <span class="cp-error" id="cpCurrentError" role="alert"></span>
          </div>

          <!-- Mật khẩu mới -->
          <div class="cp-field">
            <label class="cp-label" for="cpNew">
              Mật khẩu mới <span class="cp-req">*</span>
            </label>
            <div class="cp-input-wrap">
              <input type="password" id="cpNew" class="cp-input"
                     placeholder="Nhập mật khẩu mới..."
                     autocomplete="new-password" required />
              <button type="button" class="cp-eye" data-eye="cpNew" aria-label="Hiện mật khẩu">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <!-- Strength bar -->
            <div class="cp-strength" id="cpStrengthBar" aria-hidden="true">
              <div class="cp-strength__track">
                <div class="cp-strength__fill" id="cpStrengthFill"></div>
              </div>
              <span class="cp-strength__label" id="cpStrengthLabel"></span>
            </div>
            <span class="cp-error" id="cpNewError" role="alert"></span>
          </div>

          <!-- Xác nhận mật khẩu mới -->
          <div class="cp-field">
            <label class="cp-label" for="cpConfirm">
              Xác nhận mật khẩu mới <span class="cp-req">*</span>
            </label>
            <div class="cp-input-wrap">
              <input type="password" id="cpConfirm" class="cp-input"
                     placeholder="Nhập lại mật khẩu mới..."
                     autocomplete="new-password" required />
            </div>
            <span class="cp-error" id="cpConfirmError" role="alert"></span>
            <p class="cp-hint">
              • Mật khẩu phải có tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số.
            </p>
          </div>

          <!-- Actions -->
          <div class="cp-actions">
            <button type="button" class="cp-btn cp-btn--cancel" data-cp-close>Hủy bỏ</button>
            <button type="submit" class="cp-btn cp-btn--submit" id="cpSubmitBtn">
              <span class="cp-spinner" id="cpSpinner" aria-hidden="true"></span>
              <span id="cpSubmitText">Đổi mật khẩu</span>
            </button>
          </div>

        </form>
      </div>
    `;

    document.body.appendChild(_root);
    _form = _root.querySelector('#cpForm');

    /* Bind events */
    // Close buttons
    _root.querySelectorAll('[data-cp-close]').forEach(btn =>
      btn.addEventListener('click', _close)
    );

    // Click backdrop
    _root.addEventListener('click', e => {
      if (e.target === _root) _close();
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && _root.classList.contains('open')) _close();
    });

    // Eye toggles
    _root.querySelectorAll('[data-eye]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.eye);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.querySelector('i').className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
        btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      });
    });

    // Clear errors on input
    ['cpCurrent', 'cpNew', 'cpConfirm'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => _clearError(id));
    });

    // Strength meter
    document.getElementById('cpNew')?.addEventListener('input', function () {
      _updateStrength(this.value);
    });

    // Submit
    _form.addEventListener('submit', _handleSubmit);
  }

  /* ── Strength meter ── */
  function _updateStrength(pw) {
    const fill  = document.getElementById('cpStrengthFill');
    const label = document.getElementById('cpStrengthLabel');
    if (!fill || !label) return;

    let score = 0;
    if (pw.length >= 8)       score++;
    if (pw.length >= 12)      score++;
    if (/[A-Z]/.test(pw))     score++;
    if (/[a-z]/.test(pw))     score++;
    if (/[0-9]/.test(pw))     score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { pct: 0,   cls: '',          text: '' },
      { pct: 20,  cls: 'weak',      text: 'Rất yếu' },
      { pct: 40,  cls: 'weak',      text: 'Yếu' },
      { pct: 60,  cls: 'fair',      text: 'Trung bình' },
      { pct: 80,  cls: 'good',      text: 'Khá mạnh' },
      { pct: 90,  cls: 'strong',    text: 'Mạnh' },
      { pct: 100, cls: 'strong',    text: 'Rất mạnh' },
    ];
    const level = levels[Math.min(score, levels.length - 1)];

    fill.style.width = (pw.length ? level.pct : 0) + '%';
    fill.className   = 'cp-strength__fill' + (level.cls ? ' cp-strength__fill--' + level.cls : '');
    label.textContent = pw.length ? level.text : '';
  }

  /* ── Error helpers ── */
  function _showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    input?.classList.add('cp-input--error');
    if (error) error.textContent = msg;
  }

  function _clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    input?.classList.remove('cp-input--error');
    if (error) error.textContent = '';
  }

  /* ── Loading state ── */
  function _setLoading(on) {
    const btn     = document.getElementById('cpSubmitBtn');
    const spinner = document.getElementById('cpSpinner');
    const text    = document.getElementById('cpSubmitText');
    if (btn)     btn.disabled = on;
    if (spinner) spinner.classList.toggle('spinning', on);
    if (text)    text.textContent = on ? 'Đang xử lý...' : 'Đổi mật khẩu';
  }

  /* ── Reset form ── */
  function _reset() {
    _form?.reset();
    ['cpCurrent', 'cpNew', 'cpConfirm'].forEach(id => _clearError(id));
    _updateStrength('');
    // Reset eye icons
    _root.querySelectorAll('[data-eye]').forEach(btn => {
      const input = document.getElementById(btn.dataset.eye);
      if (input) input.type = 'password';
      btn.querySelector('i').className = 'fas fa-eye';
    });
    _setLoading(false);
  }

  /* ── Open ── */
  function _open() {
    _ensureModal();
    _reset();
    _root.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Đóng user dropdown nếu đang mở
    const dd  = document.getElementById('shUserDropdown');
    const btn = document.getElementById('shUserBtn');
    if (dd)  dd.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => document.getElementById('cpCurrent')?.focus(), 80);
  }

  /* ── Close ── */
  function _close() {
    if (!_root) return;
    _root.classList.remove('open');
    document.body.style.overflow = '';
    if (_resolve) { _resolve(false); _resolve = null; }
  }

  /* ── Submit handler ── */
  async function _handleSubmit(e) {
    e.preventDefault();

    const current = document.getElementById('cpCurrent')?.value || '';
    const newPw   = document.getElementById('cpNew')?.value     || '';
    const confirm = document.getElementById('cpConfirm')?.value || '';

    let valid = true;

    // Validate current
    if (!current) {
      _showError('cpCurrent', 'Vui lòng nhập mật khẩu hiện tại');
      valid = false;
    }

    // Validate new
    if (!newPw) {
      _showError('cpNew', 'Vui lòng nhập mật khẩu mới');
      valid = false;
    } else if (!_validateStrength(newPw)) {
      _showError('cpNew', 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
      valid = false;
    } else if (newPw === current) {
      _showError('cpNew', 'Mật khẩu mới không được trùng mật khẩu hiện tại');
      valid = false;
    }

    // Validate confirm
    if (!confirm) {
      _showError('cpConfirm', 'Vui lòng xác nhận mật khẩu mới');
      valid = false;
    } else if (newPw && confirm !== newPw) {
      _showError('cpConfirm', 'Mật khẩu xác nhận không khớp');
      valid = false;
    }

    if (!valid) return;

    _setLoading(true);

    /* Giả lập gọi API (thay bằng fetch thật sau) */
    await new Promise(r => setTimeout(r, 900));

    const demo = _getCurrentPassword();
    if (current !== demo) {
      _setLoading(false);
      _showError('cpCurrent', 'Mật khẩu hiện tại không đúng');
      document.getElementById('cpCurrent')?.focus();

      window.SPMSToast?.show(
        'error',
        'Mật khẩu không đúng',
        'Mật khẩu hiện tại bạn nhập không khớp với tài khoản. Vui lòng kiểm tra lại.',
        4000
      );
      return;
    }

    /* Thành công — đổi mật khẩu thật sự */
    try {
      _saveNewPassword(newPw);
    } catch (err) {
      _setLoading(false);
      window.SPMSToast?.show(
        'error',
        'Lỗi hệ thống',
        'Không thể cập nhật mật khẩu lúc này. Vui lòng thử lại sau.',
        4000
      );
      return;
    }

    _setLoading(false);
    _close();

    // Delay nhỏ để animation đóng modal hoàn tất trước khi hiện toast
    setTimeout(() => {
      window.SPMSToast?.show(
        'success',
        'Đổi mật khẩu thành công',
        'Mật khẩu của bạn đã được cập nhật. Hãy dùng mật khẩu mới cho lần đăng nhập tiếp theo.',
        4500
      );
    }, 280);

    if (_resolve) { _resolve(true); _resolve = null; }
  }

  /* ── Public API ── */
  global.SPMSChangePassword = {
    /** Mở modal, trả về Promise<boolean> (true = đổi thành công) */
    open() {
      return new Promise(resolve => {
        _resolve = resolve;
        _open();
      });
    },
  };

})(window);
