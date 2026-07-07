/**
 * HOME PAGE — Landing Page
 * Theo thiết kế Figma:
 * 1. Navbar (PublicLayout)
 * 2. Hero Banner
 * 3. Quick Access (Học Sinh / Phụ Huynh / Phòng Đào Tạo)
 * 4. Tin Tức & Sự Kiện Nổi Bật
 * 5. Footer (PublicLayout)
 */
import PublicLayout from '../../../layouts/PublicLayout.js';
import { NewsService } from '../services/newsService.js';

class HomePage {
  constructor() {
    this._layout = new PublicLayout();
    this._newsData = [];
  }

  async render() {
    // Render layout với skeleton trước
    this._layout.render(this._buildSkeleton(), 'home');

    // Load news bất đồng bộ
    try {
      this._newsData = await NewsService.getLatestNews(3);
    } catch {
      this._newsData = this._getMockNews();
    }

    // Re-render với dữ liệu thật
    this._layout.render(this._buildContent(), 'home');
    this._bindEvents();
  }

  _buildContent() {
    return `
      ${this._buildHero()}
      ${this._buildQuickAccess()}
      ${this._buildNewsSection()}
    `;
  }

  _buildHero() {
    return `
      <section class="hero" aria-labelledby="heroTitle">
        <div class="hero__inner">
          <h1 class="hero__title" id="heroTitle">
            Kiến Tạo Tương Lai Số
          </h1>
          <p class="hero__subtitle">
            Môi trường học tập hiện đại, năng động và sáng tạo hàng đầu.
            Nơi chắp cánh cho những ước mơ công nghệ vững bước vào tương lai.
          </p>
          <div class="hero__cta">
            <a href="#/login" class="btn btn-accent btn-xl">
              <i class="fas fa-rocket" aria-hidden="true"></i>
              Tìm Hiểu Ngay
            </a>
          </div>
        </div>
      </section>
    `;
  }

  _buildQuickAccess() {
    const items = [
      {
        id:    'student',
        label: 'Học Sinh',
        path:  '/login',
        icon:  'fas fa-user-graduate',
        cls:   '',
      },
      {
        id:    'parent',
        label: 'Phụ Huynh',
        path:  '/login',
        icon:  'fas fa-users',
        cls:   'quick-card--middle',
      },
      {
        id:    'training',
        label: 'Phòng Đào Tạo',
        path:  '/login',
        icon:  'fas fa-school',
        cls:   '',
      },
    ];

    const cards = items.map(item => `
      <a href="#${item.path}"
         class="quick-card ${item.cls}"
         data-quick="${item.id}"
         aria-label="Đăng nhập với tư cách ${item.label}">
        ${item.label}
      </a>
    `).join('');

    return `
      <section class="quick-access" aria-label="Truy cập nhanh">
        <div class="quick-access__grid">
          ${cards}
        </div>
      </section>
    `;
  }

  _buildNewsSection() {
    return `
      <section class="news-section" aria-labelledby="newsSectionTitle">
        <div class="news-section__inner">
          <div class="news-section__header">
            <h2 class="news-section__title" id="newsSectionTitle">
              Tin Tức &amp; Sự Kiện Nổi Bật
            </h2>
          </div>
          <div class="news-section__grid" id="newsGrid">
            ${this._renderNewsCards()}
          </div>
          <div class="news-section__more">
            <a href="#/news" class="btn btn-outline">
              Xem tất cả tin tức
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  _renderNewsCards() {
    if (!this._newsData.length) {
      return this._renderNewsSkeletons();
    }
    return this._newsData.map(news => this._renderNewsCard(news)).join('');
  }

  _renderNewsCard(news) {
    return `
      <article class="news-card" data-news-id="${news.id}" tabindex="0"
               role="button" aria-label="Đọc bài: ${news.title}">
        <div class="news-card__image-placeholder" aria-hidden="true">
          <i class="fas fa-image"></i>
          <span>${news.imageLabel || ''}</span>
        </div>
        <div class="news-card__body">
          <time class="news-card__date" datetime="${news.dateISO}">
            ${news.dateFormatted}
          </time>
          <h3 class="news-card__title">${this._escapeHtml(news.title)}</h3>
          <p class="news-card__excerpt">${this._escapeHtml(news.excerpt)}</p>
        </div>
      </article>
    `;
  }

  _renderNewsSkeletons() {
    return Array(3).fill('').map(() => `
      <div class="news-card" aria-hidden="true">
        <div class="skeleton skeleton--card" style="border-radius:0"></div>
        <div class="news-card__body">
          <div class="skeleton skeleton--text" style="width:40%"></div>
          <div class="skeleton skeleton--text" style="width:80%"></div>
          <div class="skeleton skeleton--text" style="width:90%"></div>
          <div class="skeleton skeleton--text" style="width:70%"></div>
        </div>
      </div>
    `).join('');
  }

  _buildSkeleton() {
    return `
      <div class="hero" aria-hidden="true" style="min-height:300px"></div>
      <div class="quick-access">
        <div class="quick-access__grid">
          ${Array(3).fill('<div class="skeleton" style="height:80px;border-radius:12px"></div>').join('')}
        </div>
      </div>
      <div class="news-section">
        <div class="news-section__inner">
          <div class="skeleton skeleton--title mx-auto" style="width:300px;margin-bottom:32px"></div>
          <div class="news-section__grid">
            ${this._renderNewsSkeletons()}
          </div>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    // News card click → navigate to news detail
    document.querySelectorAll('.news-card[data-news-id]').forEach(card => {
      const handler = () => {
        const id = card.dataset.newsId;
        window.location.hash = `#/news/${id}`;
      };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  // ── Mock data (dùng khi chưa có API) ──
  _getMockNews() {
    return [
      {
        id:            '1',
        imageLabel:    '🎓 Khai mạc Hội thảo AI',
        dateISO:       '2026-06-09',
        dateFormatted: '09 Tháng 6, 2026',
        title:         'Khai mạc Hội thảo Quốc tế về Ứng dụng AI vào Đời sống',
        excerpt:       'Hội thảo quy tụ hơn 200 chuyên gia trong và ngoài nước tham gia thảo luận...',
      },
      {
        id:            '2',
        imageLabel:    '🎓 Không khí Tốt nghiệp',
        dateISO:       '2026-06-08',
        dateFormatted: '08 Tháng 6, 2026',
        title:         'Rộn ràng không khí Lễ Tốt nghiệp và Trao bằng Cử nhân',
        excerpt:       'Niềm vui vỡ òa của các tân cử nhân xuất sắc trong ngày vinh danh công sức...',
      },
      {
        id:            '3',
        imageLabel:    '🚀 Chung kết Khởi nghiệp',
        dateISO:       '2026-06-05',
        dateFormatted: '05 Tháng 6, 2026',
        title:         'Chung Kết Cuộc Thi Ý Tưởng Khởi Nghiệp Công Nghệ Trẻ',
        excerpt:       'Cùng nhìn lại những dự án xuất sắc lọt vào vòng chung kết với tính thực tiễn...',
      },
    ];
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

export default HomePage;
