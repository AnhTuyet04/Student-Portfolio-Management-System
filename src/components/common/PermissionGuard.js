/**
 * PERMISSION GUARD COMPONENT
 * Ẩn/hiện element dựa trên permissions
 *
 * Sử dụng trong HTML:
 *   <button data-perm="students:create">Thêm Học Sinh</button>
 *   <div data-perm-any="students:delete,students:update">...</div>
 *   <div data-perm-all="reports:view,reports:export">...</div>
 *   <button data-role="administrator,principal">Admin Button</button>
 */
import PermissionChecker from '../../permissions/PermissionChecker.js';

const PermissionGuard = {
  /**
   * Áp dụng permission guard cho toàn bộ DOM
   * Gọi sau khi render mỗi page
   */
  apply(container = document) {
    this._applyPerm(container);
    this._applyPermAny(container);
    this._applyPermAll(container);
    this._applyRole(container);
  },

  /**
   * [data-perm="resource:action"] — cần có đúng quyền này
   */
  _applyPerm(container) {
    container.querySelectorAll('[data-perm]').forEach(el => {
      const perm = el.dataset.perm;
      if (!PermissionChecker.can(perm)) {
        el.remove();
      }
    });
  },

  /**
   * [data-perm-any="p1,p2,p3"] — cần có ít nhất 1
   */
  _applyPermAny(container) {
    container.querySelectorAll('[data-perm-any]').forEach(el => {
      const perms = el.dataset.permAny.split(',').map(p => p.trim());
      if (!PermissionChecker.canAny(perms)) {
        el.remove();
      }
    });
  },

  /**
   * [data-perm-all="p1,p2,p3"] — cần có tất cả
   */
  _applyPermAll(container) {
    container.querySelectorAll('[data-perm-all]').forEach(el => {
      const perms = el.dataset.permAll.split(',').map(p => p.trim());
      if (!PermissionChecker.canAll(perms)) {
        el.remove();
      }
    });
  },

  /**
   * [data-role="admin,teacher"] — cần có role phù hợp
   */
  _applyRole(container) {
    container.querySelectorAll('[data-role]').forEach(el => {
      const roles = el.dataset.role.split(',').map(r => r.trim());
      if (!PermissionChecker.hasAnyRole(roles)) {
        el.remove();
      }
    });
  },

  /**
   * Tạo element với permission check
   * @param {string} perm
   * @param {string} html
   */
  renderIf(perm, html) {
    return PermissionChecker.can(perm) ? html : '';
  },

  renderIfAny(perms, html) {
    return PermissionChecker.canAny(perms) ? html : '';
  },
};

export default PermissionGuard;
