/**
 * 403 FORBIDDEN PAGE
 */
class Error403Page {
  render() {
    document.getElementById('app').innerHTML = `
      <div class="state-page">
        <i class="fas fa-shield-alt state-page__icon" aria-hidden="true"></i>
        <h1 class="state-page__title">
          Không có quyền truy cập
        </h1>
        <p class="state-page__desc">
          Bạn không có quyền truy cập vào trang này.
          Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <div class="state-page__actions">
          <button onclick="history.back()" class="btn btn--with-icon btn-outline">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            Quay lại
          </button>
          <a href="#/dashboard" class="btn btn--with-icon btn-primary">
            <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
            Dashboard
          </a>
        </div>
      </div>
    `;
  }
}

export default Error403Page;
