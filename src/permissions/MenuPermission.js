/**
 * MENU PERMISSION
 * Lọc menu theo permissions của user hiện tại
 */
import PermissionChecker from './PermissionChecker.js';
import { MENU_ITEMS } from '../constants/menu.js';

const MenuPermission = {
  /**
   * Trả về danh sách menu items mà user có quyền xem
   */
  getAccessibleMenu() {
    return MENU_ITEMS
      .filter(item => this._hasAccess(item))
      .map(item => ({
        ...item,
        children: item.children
          ? item.children.filter(child => this._hasAccess(child))
          : undefined,
      }));
  },

  /**
   * Kiểm tra một menu item có accessible không
   */
  _hasAccess(item) {
    if (!item.permissions || item.permissions.length === 0) return true;
    return PermissionChecker.canAny(item.permissions);
  },

  /**
   * Kiểm tra route path có accessible không
   * @param {string} path
   */
  canAccessPath(path) {
    const item = this._findByPath(MENU_ITEMS, path);
    if (!item) return true; // Không có trong menu → cho qua (route guard xử lý)
    return this._hasAccess(item);
  },

  _findByPath(items, path) {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = this._findByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  },
};

export default MenuPermission;
