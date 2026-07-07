/**
 * MENU CONFIGURATION
 * Mỗi menu item gắn với permissions cần có
 * Menu sẽ tự động hiển thị/ẩn theo permissions của user
 */
import { PERMISSIONS } from './permissions.js';

export const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    path: '/dashboard',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  {
    id: 'students',
    label: 'Học Sinh',
    icon: 'fas fa-user-graduate',
    path: '/students',
    permissions: [PERMISSIONS.STUDENTS_VIEW],
    children: [
      { id: 'students-list',   label: 'Danh Sách',    path: '/students',        permissions: [PERMISSIONS.STUDENTS_VIEW] },
      { id: 'students-create', label: 'Thêm Học Sinh', path: '/students/create', permissions: [PERMISSIONS.STUDENTS_CREATE] },
    ],
  },
  {
    id: 'portfolio',
    label: 'Hồ Sơ Năng Lực',
    icon: 'fas fa-folder-open',
    path: '/portfolio',
    permissions: [PERMISSIONS.PORTFOLIO_VIEW],
  },
  {
    id: 'learning-result',
    label: 'Kết Quả Học Tập',
    icon: 'fas fa-chart-line',
    path: '/learning-results',
    permissions: [PERMISSIONS.LEARNING_RESULT_VIEW],
  },
  {
    id: 'achievement',
    label: 'Thành Tích',
    icon: 'fas fa-trophy',
    path: '/achievements',
    permissions: [PERMISSIONS.ACHIEVEMENT_VIEW],
  },
  {
    id: 'skill',
    label: 'Kỹ Năng',
    icon: 'fas fa-star',
    path: '/skills',
    permissions: [PERMISSIONS.SKILL_VIEW],
  },
  {
    id: 'library',
    label: 'Thư Viện',
    icon: 'fas fa-book',
    path: '/library',
    permissions: [PERMISSIONS.LIBRARY_VIEW],
    children: [
      { id: 'library-books',  label: 'Sách',        path: '/library',        permissions: [PERMISSIONS.LIBRARY_VIEW] },
      { id: 'library-borrow', label: 'Mượn Sách',   path: '/library/borrow', permissions: [PERMISSIONS.BORROW_BOOK_CREATE] },
    ],
  },
  {
    id: 'reports',
    label: 'Báo Cáo',
    icon: 'fas fa-chart-bar',
    path: '/reports',
    permissions: [PERMISSIONS.REPORTS_VIEW],
  },
  {
    id: 'notifications',
    label: 'Thông Báo',
    icon: 'fas fa-bell',
    path: '/notifications',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  // ── Admin only ──
  {
    id: 'users',
    label: 'Người Dùng',
    icon: 'fas fa-users',
    path: '/users',
    permissions: [PERMISSIONS.USERS_VIEW],
    group: 'admin',
  },
  {
    id: 'roles',
    label: 'Vai Trò',
    icon: 'fas fa-shield-alt',
    path: '/roles',
    permissions: [PERMISSIONS.ROLES_ADMIN],
    group: 'admin',
  },
  {
    id: 'permissions',
    label: 'Phân Quyền',
    icon: 'fas fa-lock',
    path: '/permissions',
    permissions: [PERMISSIONS.PERMISSIONS_ADMIN],
    group: 'admin',
  },
  {
    id: 'audit-log',
    label: 'Nhật Ký',
    icon: 'fas fa-history',
    path: '/audit-logs',
    permissions: [PERMISSIONS.AUDIT_LOG_VIEW],
    group: 'admin',
  },
  {
    id: 'settings',
    label: 'Cài Đặt',
    icon: 'fas fa-cog',
    path: '/settings',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    group: 'system',
  },
];
