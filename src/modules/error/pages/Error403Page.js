/**
 * 403 FORBIDDEN PAGE
 */
class Error403Page {
  render() {
    document.getElementById('app').innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 48px 24px;
        background: var(--color-bg);
      ">
        <i class="fas fa-shield-alt" style="font-size: 80px; color: var(--color-error); margin-bottom: 24px;" aria-hidden="true"></i>
        <h1 style="font-size: var(--font-size-2xl); color: var(--color-primary); margin-bottom: 12px;">
          Không có quyền truy cập
        </h1>
        <p style="color: var(--color-text-muted); margin-bottom: 32px; max-width: 400px;">
          Bạn không có quyền truy cập vào trang này.
          Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
          <button onclick="history.back()" class="btn btn-outline">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            Quay lại
          </button>
          <a href="#/dashboard" class="btn btn-primary">
            <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
            Dashboard
          </a>
        </div>
      </div>
    `;
  }
}

export default Error403Page;
