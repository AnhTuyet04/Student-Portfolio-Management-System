(function hierarchyBackComponent(global) {
  'use strict';

  const BUTTON_CLASS = 'spms-hierarchy-back';

  function addStyles() {
    if (document.getElementById('spmsHierarchyBackStyles')) return;
    const style = document.createElement('style');
    style.id = 'spmsHierarchyBackStyles';
    style.textContent = `
      .${BUTTON_CLASS}{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 18px;border:1.5px solid #dbe3ee;border-radius:9px;background:#fff;color:#64748b;font:700 13px inherit;cursor:pointer;white-space:nowrap;transition:border-color .15s,background .15s,color .15s}
      .${BUTTON_CLASS}:hover{background:#f8fafc;border-color:#94a3b8;color:#1e3a6b}
      .${BUTTON_CLASS}:focus-visible{outline:3px solid rgba(59,130,246,.2);outline-offset:2px}
      .${BUTTON_CLASS} i{font-size:12px}
      @media(max-width:640px){.${BUTTON_CLASS}{min-height:36px;padding:0 13px;font-size:12px}}
    `;
    document.head.appendChild(style);
  }

  function isHierarchical(breadcrumb) {
    return breadcrumb.querySelectorAll('.sep').length >= 2 || breadcrumb.querySelectorAll('a').length >= 2;
  }

  function findHeader(breadcrumb) {
    const scope = breadcrumb.closest('.screen') || breadcrumb.parentElement;
    if (!scope) return null;
    return scope.querySelector('.title-row, .page-header-row, .page-heading-row, .account-page__header');
  }

  function hasBackButton(header) {
    if (header.querySelector(`.${BUTTON_CLASS}`)) return true;
    return Array.from(header.querySelectorAll('button,a')).some(element => /quay\s*lại/i.test(element.textContent || ''));
  }

  function getParentCrumb(breadcrumb) {
    const links = Array.from(breadcrumb.querySelectorAll('a'));
    return links[links.length - 1] || null;
  }

  function enhanceBreadcrumb(breadcrumb) {
    if (!isHierarchical(breadcrumb)) return;
    const header = findHeader(breadcrumb);
    const parentCrumb = getParentCrumb(breadcrumb);
    if (!header || !parentCrumb || hasBackButton(header)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = BUTTON_CLASS;
    button.innerHTML = '<i class="fas fa-arrow-left" aria-hidden="true"></i><span>Quay lại</span>';
    button.setAttribute('aria-label', `Quay lại ${parentCrumb.textContent.trim()}`);
    button.addEventListener('click', () => parentCrumb.click());
    header.appendChild(button);
  }

  function refresh() {
    document.querySelectorAll('.breadcrumb').forEach(enhanceBreadcrumb);
  }

  function init() {
    addStyles();
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { subtree: true, childList: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  global.SPMSHierarchyBack = { refresh };
})(window);
