/**
 * LOGIN PAGE
 * AuthLayout: form đăng nhập với RBAC
 */
import AuthService from '../services/authService.js';
import store from '../../../store/AppStore.js';
import router from '../../../router/Router.js';
import Toast from '../../../components/common/Toast.js';

class LoginPage {
  render() {
    document.getElementById('app').innerHTML = `
      <div class="auth-layout">

        <!-- Left: Branding -->
        <div class="auth-layout__brand" aria-hidden="true">
          <div style="
            width:80px; height:80px; border-radius:20px;
            background:rgba(255,255,255,0.15);
            display:flex; align-items:center; justify-content:center;
            font-size:36px; color:white; font-weight:800;
            margin-bottom:24px;
          ">SP</div>
          <h1 class="auth-layout__brand-title">
            Hệ Thống Quản Lý<br>Hồ Sơ Năng Lực<br>Học Sinh
          </h1>
          <p class="auth-layout__brand-desc">
            Nền tảng quản lý hồ sơ học sinh toàn diện,
            minh bạch và hiệu quả cho môi trường giáo dục hiện đại.
          </p>
        </div>

        <!-- Right: Login Form -->
        <div class="auth-layout__form">
          <div class="auth-card">
            <h2 class="auth-card__title">Đăng nhập</h2>
            <p class="auth-card__subtitle">Nhập thông tin tài khoản của bạn để tiếp tục</p>

            <form id="loginForm" novalidate aria-label="Form đăng nhập">

              <!-- Username -->
              <div class="form-group">
                <label class="form-label" for="username">
                  Tên đăng nhập <span class="required" aria-label="bắt buộc">*</span>
                </label>
                <div class="input-group">
                  <i class="fas fa-user input-group__icon" aria-hidden="true"></i>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    class="form-control"
                    placeholder="Nhập tên đăng nhập"
                    autocomplete="username"
                    required
                    autofocus
                  />
                </div>
                <span class="form-error" id="usernameError" role="alert" aria-live="polite"></span>
              </div>

              <!-- Password -->
              <div class="form-group">
                <label class="form-label" for="password">
                  Mật khẩu <span class="required" aria-label="bắt buộc">*</span>
                </label>
                <div class="input-group">
                  <i class="fas fa-lock input-group__icon" aria-hidden="true"></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    class="form-control with-right-icon"
                    placeholder="Nhập mật khẩu"
                    autocomplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    class="input-group__icon input-group__icon--right"
                    id="togglePassword"
                    aria-label="Hiện/ẩn mật khẩu"
                  >
                    <i class="fas fa-eye" id="eyeIcon" aria-hidden="true"></i>
                  </button>
                </div>
                <span class="form-error" id="passwordError" role="alert" aria-live="polite"></span>
              </div>

              <!-- Remember + Forgot -->
              <div class="flex items-center justify-between mb-6">
                <label class="form-check">
                  <input type="checkbox" id="rememberMe" class="form-check-input" />
                  <span class="form-check-label">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#/forgot-password" style="
                  font-size: var(--font-size-sm);
                  color: var(--color-primary);
                  font-weight: var(--font-weight-medium);
                  transition: color var(--transition-fast);
                ">Quên mật khẩu?</a>
              </div>

              <!-- Submit -->
              <button type="submit" id="loginBtn" class="btn btn-primary btn-lg btn-block">
                <span id="loginBtnText">Đăng nhập</span>
                <span id="loginBtnSpinner" class="spinner spinner--sm spinner--white hidden" aria-hidden="true"></span>
              </button>

              <!-- General error -->
              <div id="loginError" class="form-error justify-center mt-4 hidden" role="alert" aria-live="assertive">
                <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                <span id="loginErrorText"></span>
              </div>

            </form>

            <!-- Back to home -->
            <p style="text-align:center; margin-top:24px; font-size:var(--font-size-sm); color:var(--color-text-muted);">
              <a href="#/" style="color:var(--color-primary); font-weight:500;">
                <i class="fas fa-arrow-left" aria-hidden="true"></i>
                Về trang chủ
              </a>
            </p>
          </div>
        </div>

      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const form          = document.getElementById('loginForm');
    const togglePassBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon       = document.getElementById('eyeIcon');

    // Toggle password visibility
    togglePassBtn?.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.className  = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
      togglePassBtn.setAttribute('aria-label', isPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    });

    // Clear errors on input
    ['username', 'password'].forEach(name => {
      document.getElementById(name)?.addEventListener('input', () => {
        this._clearError(name);
      });
    });

    // Form submit
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleLogin();
    });
  }

  async _handleLogin() {
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    // Validate
    let valid = true;
    if (!username) {
      this._showError('username', 'Vui lòng nhập tên đăng nhập');
      valid = false;
    }
    if (!password) {
      this._showError('password', 'Vui lòng nhập mật khẩu');
      valid = false;
    }
    if (!valid) return;

    // Loading state
    this._setLoading(true);
    this._hideGeneralError();

    try {
      const result = await AuthService.login({ username, password });

      if (result.success) {
        Toast.success('Đăng nhập thành công', `Xin chào, ${result.data.user.fullName}!`);
        // Router sẽ tự redirect về dashboard
        setTimeout(() => router.replace('/dashboard'), 300);
      } else {
        this._showGeneralError(result.message);
      }
    } catch (error) {
      this._showGeneralError(error.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      this._setLoading(false);
    }
  }

  _setLoading(loading) {
    const btn     = document.getElementById('loginBtn');
    const text    = document.getElementById('loginBtnText');
    const spinner = document.getElementById('loginBtnSpinner');

    if (btn)     btn.disabled = loading;
    if (text)    text.textContent = loading ? 'Đang đăng nhập...' : 'Đăng nhập';
    if (spinner) spinner.classList.toggle('hidden', !loading);
  }

  _showError(field, message) {
    const input = document.getElementById(field);
    const error = document.getElementById(`${field}Error`);
    input?.classList.add('form-control--error');
    if (error) {
      error.innerHTML = `<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${message}`;
    }
  }

  _clearError(field) {
    const input = document.getElementById(field);
    const error = document.getElementById(`${field}Error`);
    input?.classList.remove('form-control--error');
    if (error) error.textContent = '';
  }

  _showGeneralError(message) {
    const container = document.getElementById('loginError');
    const text      = document.getElementById('loginErrorText');
    if (container) container.classList.remove('hidden');
    if (text)      text.textContent = message;
  }

  _hideGeneralError() {
    document.getElementById('loginError')?.classList.add('hidden');
  }
}

export default LoginPage;
