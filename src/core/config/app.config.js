/**
 * APP CONFIGURATION
 * Student Portfolio Management System
 */
const AppConfig = {
  name:        'Hệ Thống Quản Lý Hồ Sơ Năng Lực Học Sinh',
  shortName:   'SPMS',
  version:     '1.0.0',
  description: 'Student Portfolio Management System',

  // API
  apiBaseUrl:  'http://localhost:3000/api/v1',
  apiTimeout:  15000, // 15s

  // Auth
  tokenKey:    'spms_token',
  refreshKey:  'spms_refresh',
  userKey:     'spms_user',

  // App
  defaultLocale:   'vi',
  defaultTheme:    'light',
  itemsPerPage:    10,
  maxUploadSize:   10 * 1024 * 1024, // 10MB
  allowedFileTypes:['image/jpeg','image/png','image/webp','application/pdf'],

  // Features
  enableDarkMode:  true,
  enableAuditLog:  true,
  enableExport:    true,
};

export default AppConfig;
