/**
 * AUTH ROUTES
 * Login, Forgot/Reset Password — chuyển hướng nếu đã đăng nhập
 */
import router from '../Router.js';

export const registerAuthRoutes = () => {
  router.add('/login', async () => {
    const { default: LoginPage } = await import('../../modules/auth/pages/LoginPage.js');
    new LoginPage().render();
  }, { guestOnly: true });

  router.add('/forgot-password', async () => {
    const { default: ForgotPasswordPage } = await import('../../modules/auth/pages/ForgotPasswordPage.js');
    new ForgotPasswordPage().render();
  }, { guestOnly: true });

  router.add('/reset-password', async () => {
    const { default: ResetPasswordPage } = await import('../../modules/auth/pages/ResetPasswordPage.js');
    new ResetPasswordPage().render();
  }, { guestOnly: true });
};
