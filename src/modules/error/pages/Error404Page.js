/**
 * 404 NOT FOUND PAGE
 */
class Error404Page {
  render() {
    document.getElementById('app').innerHTML = `
      <div class="state-page">
        <div class="state-page__code" aria-hidden="true">404</div>
        <h1 class="state-page__title">
          Trang không tồn tại
        </h1>
        <p class="state-page__desc">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div class="state-page__actions">
          <button onclick="history.back()" class="btn btn--with-icon btn-outline">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            Quay lại
          </button>
          <a href="#/" class="btn btn--with-icon btn-primary">
            <i class="fas fa-home" aria-hidden="true"></i>
            Trang chủ
          </a>
        </div>
      </div>
    `;
  }
}

export default Error404Page;
