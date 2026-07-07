/**
 * PERMISSION CHECKER — Core RBAC Engine
 * Kiểm tra quyền dựa trên danh sách permissions của user
 */
import store from '../store/AppStore.js';

const PermissionChecker = {
  /**
   * Lấy danh sách permissions hiện tại của user
   */
  getPermissions() {
    return store.get('auth.permissions') || [];
  },

  /**
   * Kiểm tra user có quyền cụ thể không
   * @param {string} permission - e.g. 'students:view'
   */
  can(permission) {
    const permissions = this.getPermissions();
    // Admin có tất cả quyền
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  },

  /**
   * Kiểm tra user có TẤT CẢ các quyền trong danh sách
   * @param {string[]} permissionList
   */
  canAll(permissionList) {
    return permissionList.every(p => this.can(p));
  },

  /**
   * Kiểm tra user có ÍT NHẤT MỘT quyền trong danh sách
   * @param {string[]} permissionList
   */
  canAny(permissionList) {
    return permissionList.some(p => this.can(p));
  },

  /**
   * Kiểm tra user có role cụ thể
   * @param {string} role
   */
  hasRole(role) {
    return store.get('auth.role') === role;
  },

  /**
   * Kiểm tra user có ít nhất một trong các roles
   * @param {string[]} roles
   */
  hasAnyRole(roles) {
    const currentRole = store.get('auth.role');
    return roles.includes(currentRole);
  },

  /**
   * User đã đăng nhập chưa
   */
  isAuthenticated() {
    return store.get('auth.isLoggedIn') === true;
  },
};

export default PermissionChecker;
