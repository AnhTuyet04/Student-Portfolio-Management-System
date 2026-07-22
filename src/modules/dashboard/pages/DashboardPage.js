/**
 * DASHBOARD PAGE — Role-based dashboard
 * Hiển thị dashboard khác nhau tùy role
 */
import store from '../../../core/store/AppStore.js';
import PermissionGuard from '../../../shared/components/common/PermissionGuard.js';
import { ROLE_LABELS } from '../../../shared/constants/roles.js';

class DashboardPage {
  render() {
    const user = store.get('auth.user');
    const role = store.get('auth.role');
    const roleLabel = ROLE_LABELS[role] || role;

    document.getElementById('app').innerHTML = `
      <div class="dashboard-page">
        <div class="dashboard-shell">

          <!-- Header -->
          <div class="dashboard-header">
            <h1 class="dashboard-title">
              Xin chào, ${user?.fullName || user?.username || 'Người dùng'} 👋
            </h1>
            <p class="dashboard-subtitle">
              Vai trò: <span class="badge badge--primary">${roleLabel}</span>
            </p>
          </div>

          <!-- Stat Cards -->
          <div class="dashboard-stat-grid" data-perm-any="students:view,portfolio:view,reports:view">
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--primary">
                <i class="fas fa-user-graduate" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Học Sinh</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--success">
                <i class="fas fa-folder-open" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Hồ Sơ Năng Lực</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--warning">
                <i class="fas fa-trophy" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Thành Tích</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--role">
                <i class="fas fa-book" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Sách Mượn</div>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="dashboard-panel">
            <h2 class="dashboard-panel__title">
              Truy cập nhanh
            </h2>
            <div class="dashboard-quick-links">
              <a href="#/students" class="btn btn-outline btn-sm" data-perm="students:view">
                <i class="fas fa-user-graduate" aria-hidden="true"></i> Học Sinh
              </a>
              <a href="#/portfolio" class="btn btn-outline btn-sm" data-perm="portfolio:view">
                <i class="fas fa-folder-open" aria-hidden="true"></i> Hồ Sơ Năng Lực
              </a>
              <a href="#/reports" class="btn btn-outline btn-sm" data-perm="reports:view">
                <i class="fas fa-chart-bar" aria-hidden="true"></i> Báo Cáo
              </a>
              <a href="#/users" class="btn btn-outline btn-sm" data-perm="users:view">
                <i class="fas fa-users" aria-hidden="true"></i> Người Dùng
              </a>
            </div>
          </div>

        </div>
      </div>
    `;

    // Apply RBAC guards
    PermissionGuard.apply();
  }
}

export default DashboardPage;
