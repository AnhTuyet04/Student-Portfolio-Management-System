/**
 * Footer dùng chung cho toàn bộ các trang SPMS.
 * Đặt <div id="sharedFooterMount"></div> tại vị trí cần hiển thị footer.
 */
(function () {
  'use strict';

  const CSS = `
<style id="shared-footer-css">
  .spms-footer {
    flex-shrink: 0;
    margin-top: auto;
    padding: 18px 28px;
    background: #0f2857;
    color: rgba(255, 255, 255, .62);
    text-align: center;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 12.5px;
    line-height: 1.6;
  }
  .spms-footer__link {
    color: rgba(255, 255, 255, .85);
    font-weight: 600;
    text-decoration: none;
    transition: color .15s;
  }
  .spms-footer__link:hover { color: #fff; }
  @media (max-width: 640px) {
    .spms-footer { padding: 16px 20px; font-size: 12px; }
    .spms-footer__separator { display: block; height: 2px; overflow: hidden; }
  }
</style>`;

  const HTML = `
<footer class="spms-footer" role="contentinfo">
  <span>© <span id="spmsFooterYear"></span> Trường THCS Nguyễn Văn Cừ.</span>
  <span class="spms-footer__separator" aria-hidden="true"> </span>
  <span>Tất cả các quyền được bảo lưu. <a class="spms-footer__link" href="contact.html">Liên hệ</a></span>
</footer>`;

  function mount() {
    if (!document.getElementById('shared-footer-css')) {
      document.head.insertAdjacentHTML('beforeend', CSS);
    }

    const mountPoint = document.getElementById('sharedFooterMount');
    if (!mountPoint) return;
    mountPoint.outerHTML = HTML;

    const year = document.getElementById('spmsFooterYear');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
