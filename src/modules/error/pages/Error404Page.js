/**
 * 404 NOT FOUND PAGE
 */
class Error404Page {
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
        <div style="font-size: 120px; line-height:1; margin-bottom: 24px;" aria-hidden="true">404</div>
        <h1 style="font-size: var(--font-size-2xl); color: var(--color-primary); margin-bottom: 12px;">
          Trang không tồn tại
        </h1>
        <p style="color: var(--color-text-muted); margin-bottom: 32px; max-width: 400px;">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
          <button onclick="history.back()" class="btn btn-outline">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            Quay lại
          </button>
          <a href="#/" class="btn btn-primary">
            <i class="fas fa-home" aria-hidden="true"></i>
            Trang chủ
          </a>
        </div>
      </div>
    `;
  }
}

export default Error404Page;
