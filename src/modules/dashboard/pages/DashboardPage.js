/**
 * DASHBOARD PAGE — Role-based dashboard
 * Hiển thị dashboard khác nhau tùy role
 */
import store from '../../../store/AppStore.js';
import PermissionGuard from '../../../components/common/PermissionGuard.js';
import { ROLE_LABELS } from '../../../constants/roles.js';

class DashboardPage {
  render() {
    const user = store.get('auth.user');
    const role = store.get('auth.role');
    const roleLabel = ROLE_LABELS[role] || role;

    document.getElementById('app').innerHTML = `
      <div style="min-height:100vh; background:var(--color-bg); padding:32px 24px;">
        <div style="max-width:1280px; margin:0 auto;">

          <!-- Header -->
          <div style="margin-bottom:32px;">
            <h1 style="font-size:var(--font-size-2xl); color:var(--color-primary); font-weight:700;">
              Xin chào, ${user?.fullName || user?.username || 'Người dùng'} 👋
            </h1>
            <p style="color:var(--color-text-muted); margin-top:4px; font-size:var(--font-size-sm);">
              Vai trò: <span class="badge badge--primary">${roleLabel}</span>
            </p>
          </div>

          <!-- Stat Cards -->
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          " data-perm-any="students:view,portfolio:view,reports:view">
            <div class="stat-card">
              <div class="stat-card__icon" style="background:#dbeafe; color:var(--color-primary);">
                <i class="fas fa-user-graduate" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Học Sinh</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon" style="background:#d1fae5; color:var(--color-success);">
                <i class="fas fa-folder-open" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Hồ Sơ Năng Lực</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon" style="background:#fef3c7; color:var(--color-warning);">
                <i class="fas fa-trophy" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Thành Tích</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon" style="background:#f3e8ff; color:#7c3aed;">
                <i class="fas fa-book" aria-hidden="true"></i>
              </div>
              <div>
                <div class="stat-card__value">--</div>
                <div class="stat-card__label">Sách Mượn</div>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div style="
            background:white;
            border-radius:12px;
            border:1px solid var(--color-border);
            padding:24px;
          ">
            <h2 style="font-size:var(--font-size-lg); font-weight:600; color:var(--color-text); margin-bottom:16px;">
              Truy cập nhanh
            </h2>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">
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
