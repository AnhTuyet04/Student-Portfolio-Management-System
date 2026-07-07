/**
 * PUBLIC ROUTES
 * Không cần đăng nhập
 */
import router from '../Router.js';

export const registerPublicRoutes = () => {
  // Home
  router.add('/', async () => {
    const { default: HomePage } = await import('../../modules/home/pages/HomePage.js');
    new HomePage().render();
  }, { guestOnly: false });

  // About
  router.add('/about', async () => {
    const { default: AboutPage } = await import('../../modules/home/pages/AboutPage.js');
    new AboutPage().render();
  });

  // News list
  router.add('/news', async () => {
    const { default: NewsListPage } = await import('../../modules/home/pages/NewsListPage.js');
    new NewsListPage().render();
  });

  // News detail
  router.add('/news/:id', async ({ params }) => {
    const { default: NewsDetailPage } = await import('../../modules/home/pages/NewsDetailPage.js');
    new NewsDetailPage(params.id).render();
  });

  // Contact
  router.add('/contact', async () => {
    const { default: ContactPage } = await import('../../modules/home/pages/ContactPage.js');
    new ContactPage().render();
  });
};
