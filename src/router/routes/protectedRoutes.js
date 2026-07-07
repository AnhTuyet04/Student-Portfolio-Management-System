/**
 * PROTECTED ROUTES
 * Yêu cầu đăng nhập + kiểm tra permissions
 */
import router from '../Router.js';
import { PERMISSIONS } from '../../constants/permissions.js';

export const registerProtectedRoutes = () => {
  // Dashboard
  router.add('/dashboard', async () => {
    const { default: DashboardPage } = await import('../../modules/dashboard/pages/DashboardPage.js');
    new DashboardPage().render();
  }, { auth: true, permissions: [PERMISSIONS.DASHBOARD_VIEW] });

  // Students
  router.add('/students', async () => {
    const { default: StudentListPage } = await import('../../modules/student/pages/StudentListPage.js');
    new StudentListPage().render();
  }, { auth: true, permissions: [PERMISSIONS.STUDENTS_VIEW] });

  router.add('/students/create', async () => {
    const { default: StudentFormPage } = await import('../../modules/student/pages/StudentFormPage.js');
    new StudentFormPage().render();
  }, { auth: true, permissions: [PERMISSIONS.STUDENTS_CREATE] });

  router.add('/students/:id', async ({ params }) => {
    const { default: StudentDetailPage } = await import('../../modules/student/pages/StudentDetailPage.js');
    new StudentDetailPage(params.id).render();
  }, { auth: true, permissions: [PERMISSIONS.STUDENTS_VIEW] });

  router.add('/students/:id/edit', async ({ params }) => {
    const { default: StudentFormPage } = await import('../../modules/student/pages/StudentFormPage.js');
    new StudentFormPage(params.id).render();
  }, { auth: true, permissions: [PERMISSIONS.STUDENTS_UPDATE] });

  // Portfolio
  router.add('/portfolio', async () => {
    const { default: PortfolioPage } = await import('../../modules/portfolio/pages/PortfolioPage.js');
    new PortfolioPage().render();
  }, { auth: true, permissions: [PERMISSIONS.PORTFOLIO_VIEW] });

  router.add('/portfolio/:id', async ({ params }) => {
    const { default: PortfolioDetailPage } = await import('../../modules/portfolio/pages/PortfolioDetailPage.js');
    new PortfolioDetailPage(params.id).render();
  }, { auth: true, permissions: [PERMISSIONS.PORTFOLIO_VIEW] });

  // Reports
  router.add('/reports', async () => {
    const { default: ReportPage } = await import('../../modules/report/pages/ReportPage.js');
    new ReportPage().render();
  }, { auth: true, permissions: [PERMISSIONS.REPORTS_VIEW] });

  // Users (Admin)
  router.add('/users', async () => {
    const { default: UserListPage } = await import('../../modules/user/pages/UserListPage.js');
    new UserListPage().render();
  }, { auth: true, permissions: [PERMISSIONS.USERS_VIEW] });

  // Profile
  router.add('/profile', async () => {
    const { default: ProfilePage } = await import('../../modules/profile/pages/ProfilePage.js');
    new ProfilePage().render();
  }, { auth: true });

  // Settings
  router.add('/settings', async () => {
    const { default: SettingsPage } = await import('../../modules/settings/pages/SettingsPage.js');
    new SettingsPage().render();
  }, { auth: true });

  // Notifications
  router.add('/notifications', async () => {
    const { default: NotificationPage } = await import('../../modules/notification/pages/NotificationPage.js');
    new NotificationPage().render();
  }, { auth: true });

  // Error pages
  router.add('/403', async () => {
    const { default: Error403Page } = await import('../../modules/error/pages/Error403Page.js');
    new Error403Page().render();
  });

  router.add('/404', async () => {
    const { default: Error404Page } = await import('../../modules/error/pages/Error404Page.js');
    new Error404Page().render();
  });
};
