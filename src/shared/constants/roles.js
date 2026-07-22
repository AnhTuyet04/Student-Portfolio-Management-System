/**
 * ROLE CONSTANTS
 * Thêm role mới chỉ cần thêm một dòng ở đây
 */
export const ROLES = {
  ADMIN:        'administrator',
  SCHOOL:       'school',
  TEACHER:      'teacher',
  STUDENT:      'student',
  PARENT:       'parent',
  LIBRARIAN:    'librarian',
  PRINCIPAL:    'principal',
  ADMISSION:    'admission',
  ENTERPRISE:   'enterprise',
  EDU_ORG:      'edu_organization',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]:      'Quản Trị Viên',
  [ROLES.SCHOOL]:     'Nhà Trường',
  [ROLES.TEACHER]:    'Giáo Viên',
  [ROLES.STUDENT]:    'Học Sinh',
  [ROLES.PARENT]:     'Phụ Huynh',
  [ROLES.LIBRARIAN]:  'Thủ Thư',
  [ROLES.PRINCIPAL]:  'Hiệu Trưởng',
  [ROLES.ADMISSION]:  'Phòng Tuyển Sinh',
  [ROLES.ENTERPRISE]: 'Doanh Nghiệp',
  [ROLES.EDU_ORG]:    'Tổ Chức Giáo Dục',
};

export const ROLE_BADGE_CLASS = {
  [ROLES.ADMIN]:      'badge--admin',
  [ROLES.TEACHER]:    'badge--teacher',
  [ROLES.STUDENT]:    'badge--student',
  [ROLES.PARENT]:     'badge--parent',
  [ROLES.LIBRARIAN]:  'badge--librarian',
  [ROLES.PRINCIPAL]:  'badge--principal',
};
