(function attachUserMenu(global) {
  const boundMenus = new Set();

  function getElements(config) {
    const wrapperId = config.wrapperId || 'navAuthArea';
    const buttonId = config.buttonId || 'userMenuBtn';
    const menuId = config.menuId || 'userDropdown';

    return {
      wrapper: document.getElementById(wrapperId),
      button: document.getElementById(buttonId),
      menu: document.getElementById(menuId),
      key: wrapperId + ':' + buttonId + ':' + menuId,
    };
  }

  function close(config) {
    const { button, menu } = getElements(config || {});
    if (!button || !menu) return;
    menu.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  }

  function toggle(config) {
    const { button, menu } = getElements(config || {});
    if (!button || !menu) return;
    const isOpen = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function bind(config) {
    const cfg = config || {};
    const { wrapper, key } = getElements(cfg);
    if (!wrapper || boundMenus.has(key)) return;

    document.addEventListener('click', (event) => {
      const { wrapper: latestWrapper } = getElements(cfg);
      if (!latestWrapper) return;
      if (latestWrapper.contains(event.target)) return;
      close(cfg);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close(cfg);
    });

    boundMenus.add(key);
  }

  global.SPMSUserMenu = {
    bind,
    toggle,
    close,
  };
})(window);
