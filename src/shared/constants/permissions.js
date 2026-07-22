/**
 * PERMISSION CONSTANTS
 * Format: 'resource:action'
 */

// ── Actions ──
export const ACTIONS = {
  VIEW:    'view',
  CREATE:  'create',
  UPDATE:  'update',
  DELETE:  'delete',
  APPROVE: 'approve',
  REJECT:  'reject',
  EXPORT:  'export',
  SHARE:   'share',
  ADMIN:   'admin',
};

// ── Resources ──
export const RESOURCES = {
  DASHBOARD:       'dashboard',
  STUDENTS:        'students',
  PORTFOLIO:       'portfolio',
  LEARNING_RESULT: 'learning_result',
  ACHIEVEMENT:     'achievement',
  SKILL:           'skill',
  CERTIFICATE:     'certificate',
  GOAL:            'goal',
  SELF_ASSESSMENT: 'self_assessment',
  EXTRACURRICULAR: 'extracurricular',
  LIBRARY:         'library',
  BORROW_BOOK:     'borrow_book',
  REPORTS:         'reports',
  NOTIFICATION:    'notification',
  USERS:           'users',
  ROLES:           'roles',
  PERMISSIONS:     'permissions',
  AUDIT_LOG:       'audit_log',
  PROFILE:         'profile',
  SETTINGS:        'settings',
};

// ── Build permission key: 'students:view' ──
export const perm = (resource, action) => `${resource}:${action}`;

// ── Common permission shortcuts ──
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW:           perm(RESOURCES.DASHBOARD, ACTIONS.VIEW),

  // Students
  STUDENTS_VIEW:            perm(RESOURCES.STUDENTS, ACTIONS.VIEW),
  STUDENTS_CREATE:          perm(RESOURCES.STUDENTS, ACTIONS.CREATE),
  STUDENTS_UPDATE:          perm(RESOURCES.STUDENTS, ACTIONS.UPDATE),
  STUDENTS_DELETE:          perm(RESOURCES.STUDENTS, ACTIONS.DELETE),
  STUDENTS_EXPORT:          perm(RESOURCES.STUDENTS, ACTIONS.EXPORT),

  // Portfolio
  PORTFOLIO_VIEW:           perm(RESOURCES.PORTFOLIO, ACTIONS.VIEW),
  PORTFOLIO_CREATE:         perm(RESOURCES.PORTFOLIO, ACTIONS.CREATE),
  PORTFOLIO_UPDATE:         perm(RESOURCES.PORTFOLIO, ACTIONS.UPDATE),
  PORTFOLIO_APPROVE:        perm(RESOURCES.PORTFOLIO, ACTIONS.APPROVE),
  PORTFOLIO_SHARE:          perm(RESOURCES.PORTFOLIO, ACTIONS.SHARE),
  PORTFOLIO_EXPORT:         perm(RESOURCES.PORTFOLIO, ACTIONS.EXPORT),

  // Learning Result
  LEARNING_RESULT_VIEW:     perm(RESOURCES.LEARNING_RESULT, ACTIONS.VIEW),
  LEARNING_RESULT_CREATE:   perm(RESOURCES.LEARNING_RESULT, ACTIONS.CREATE),
  LEARNING_RESULT_UPDATE:   perm(RESOURCES.LEARNING_RESULT, ACTIONS.UPDATE),

  // Achievement
  ACHIEVEMENT_VIEW:         perm(RESOURCES.ACHIEVEMENT, ACTIONS.VIEW),
  ACHIEVEMENT_CREATE:       perm(RESOURCES.ACHIEVEMENT, ACTIONS.CREATE),
  ACHIEVEMENT_APPROVE:      perm(RESOURCES.ACHIEVEMENT, ACTIONS.APPROVE),

  // Skill
  SKILL_VIEW:               perm(RESOURCES.SKILL, ACTIONS.VIEW),
  SKILL_CREATE:             perm(RESOURCES.SKILL, ACTIONS.CREATE),
  SKILL_UPDATE:             perm(RESOURCES.SKILL, ACTIONS.UPDATE),

  // Library
  LIBRARY_VIEW:             perm(RESOURCES.LIBRARY, ACTIONS.VIEW),
  BORROW_BOOK_CREATE:       perm(RESOURCES.BORROW_BOOK, ACTIONS.CREATE),
  BORROW_BOOK_APPROVE:      perm(RESOURCES.BORROW_BOOK, ACTIONS.APPROVE),

  // Reports
  REPORTS_VIEW:             perm(RESOURCES.REPORTS, ACTIONS.VIEW),
  REPORTS_EXPORT:           perm(RESOURCES.REPORTS, ACTIONS.EXPORT),

  // Users
  USERS_VIEW:               perm(RESOURCES.USERS, ACTIONS.VIEW),
  USERS_CREATE:             perm(RESOURCES.USERS, ACTIONS.CREATE),
  USERS_UPDATE:             perm(RESOURCES.USERS, ACTIONS.UPDATE),
  USERS_DELETE:             perm(RESOURCES.USERS, ACTIONS.DELETE),
  USERS_ADMIN:              perm(RESOURCES.USERS, ACTIONS.ADMIN),

  // Roles & Permissions
  ROLES_ADMIN:              perm(RESOURCES.ROLES, ACTIONS.ADMIN),
  PERMISSIONS_ADMIN:        perm(RESOURCES.PERMISSIONS, ACTIONS.ADMIN),

  // Audit Log
  AUDIT_LOG_VIEW:           perm(RESOURCES.AUDIT_LOG, ACTIONS.VIEW),
};
