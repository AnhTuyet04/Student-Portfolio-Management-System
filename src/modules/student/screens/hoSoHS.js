/**
 * hoSoHS.js
 * Screen module: Hồ Sơ Học Sinh
 * Inline-edit engine for student profile panels + grade table + attendance/rewards.
 * Data is persisted to localStorage under key 'studentHoSoHS'.
 */

(function (global) {
  'use strict';

  const HS_STORAGE_KEY = 'studentHoSoHS';

  // Track which panels are currently in edit mode
  const _hsEditState   = {};
  // Snapshots for cancel-undo
  const _hsSnapshots   = {};

  /* ── Storage helpers ── */
  function hsLoad() {
    try { return JSON.parse(localStorage.getItem(HS_STORAGE_KEY)) || {}; } catch { return {}; }
  }

  function hsSave(data) {
    try { localStorage.setItem(HS_STORAGE_KEY, JSON.stringify(data)); } catch { /* quota exceeded */ }
  }

  /* ── Populate all [data-field] elements from stored data ── */
  function hsPopulate() {
    const data = hsLoad();

    document.querySelectorAll('#screen-hoSoHS [data-field]').forEach(el => {
      const key = el.getAttribute('data-field');
      if (data[key] !== undefined) el.textContent = data[key];
    });

    if (data.grades) {
      document.querySelectorAll('#hs-grade-tbody tr[data-subject]').forEach(row => {
        const g = data.grades[row.getAttribute('data-subject')];
        if (!g) return;
        ['oral', 'mid', 'final', 'avg'].forEach(col => {
          const td = row.querySelector(`[data-col="${col}"]`);
          if (td && g[col] !== undefined) td.textContent = g[col];
        });
      });
    }
  }

  /* ── Toggle edit / save ── */
  function hsToggleEdit(panelId, sectionKey) {
    // Kiểm tra quyền: học sinh chỉ được edit panel cơ bản & gia đình
    const role = getCurrentRole();
    if (role === 'student' && STUDENT_READONLY_PANELS[panelId]) {
      if (window.SPMSToast?.show) {
        window.SPMSToast.show('warning', 'Không có quyền', 'Chỉ giáo viên hoặc quản trị viên mới có thể chỉnh sửa mục này.', 2500);
      }
      return;
    }

    // Nút header chỉ mở edit mode — không toggle sang Lưu
    if (!_hsEditState[panelId]) {
      hsEnterEdit(panelId, sectionKey);
    }
  }

  function hsEnterEdit(panelId, sectionKey) {
    _hsEditState[panelId] = true;
    _hsSnapshots[panelId] = hsSnapshotPanel(panelId);

    const panel   = document.getElementById(panelId);
    const banner  = document.getElementById('banner-'  + sectionKey);
    const actions = document.getElementById('actions-' + sectionKey);
    const editBtn = document.getElementById('btn-edit-' + sectionKey);

    if (panel)   panel.classList.add('is-editing');
    if (banner)  banner.classList.add('visible');
    if (actions) actions.classList.add('visible');

    // Nút header: ẩn đi khi đang edit (action bar dưới đảm nhiệm Lưu / Hủy)
    if (editBtn) editBtn.style.visibility = 'hidden';

    panel.querySelectorAll('[data-field]').forEach(el => el.setAttribute('contenteditable', 'true'));

    if (panelId === 'panel-ketqua') {
      document.querySelectorAll('#hs-grade-tbody td[data-col]').forEach(td =>
        td.setAttribute('contenteditable', 'true')
      );
    }
  }

  function hsCancelEdit(panelId, sectionKey) {
    const snap = _hsSnapshots[panelId];
    if (snap) {
      Object.entries(snap.fields).forEach(([k, v]) => {
        const el = document.querySelector(`[data-field="${k}"]`);
        if (el) el.textContent = v;
      });
      if (snap.grades) {
        Object.entries(snap.grades).forEach(([subj, cols]) => {
          const row = document.querySelector(`#hs-grade-tbody tr[data-subject="${subj}"]`);
          if (!row) return;
          Object.entries(cols).forEach(([col, val]) => {
            const td = row.querySelector(`[data-col="${col}"]`);
            if (td) td.textContent = val;
          });
        });
      }
    }

    hsExitEdit(panelId, sectionKey);

    if (window.SPMSToast?.show) {
      window.SPMSToast.show('info', 'Hồ sơ học sinh', 'Đã hủy — dữ liệu không thay đổi.', 2000);
    }
  }

  function hsSavePanel(panelId, sectionKey) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const data = hsLoad();

    panel.querySelectorAll('[data-field]').forEach(el => {
      data[el.getAttribute('data-field')] = el.textContent.trim();
    });

    if (panelId === 'panel-ketqua') {
      data.grades = data.grades || {};
      document.querySelectorAll('#hs-grade-tbody tr[data-subject]').forEach(row => {
        const subj = row.getAttribute('data-subject');
        data.grades[subj] = { oral: '', mid: '', final: '', avg: '' };
        ['oral', 'mid', 'final', 'avg'].forEach(col => {
          const td = row.querySelector(`[data-col="${col}"]`);
          if (td) data.grades[subj][col] = td.textContent.trim();
        });
      });
    }

    hsSave(data);
    hsExitEdit(panelId, sectionKey);

    // Update save timestamp note
    const noteEl = document.getElementById('note-' + sectionKey);
    if (noteEl) {
      const now = new Date();
      noteEl.textContent = `Đã lưu lúc ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ngày ${now.toLocaleDateString('vi-VN')}`;
    }

    const panelLabels = {
      'panel-coban-1': 'Thông tin lý lịch cá nhân',
      'panel-coban-2': 'Thông tin gia đình & liên hệ phụ huynh',
      'panel-ketqua':  'Kết quả học tập & điểm số',
      'panel-khen':    'Chuyên cần & khen thưởng',
    };
    const label = panelLabels[panelId] || 'Hồ sơ học sinh';

    if (window.SPMSToast?.show) {
      window.SPMSToast.show('success', 'Cập nhật thành công', `Đã lưu thay đổi: ${label}.`, 2500);
    }
  }

  function hsExitEdit(panelId, sectionKey) {
    delete _hsEditState[panelId];

    const panel   = document.getElementById(panelId);
    const banner  = document.getElementById('banner-'  + sectionKey);
    const actions = document.getElementById('actions-' + sectionKey);
    const editBtn = document.getElementById('btn-edit-' + sectionKey);

    if (panel)   panel.classList.remove('is-editing');
    if (banner)  banner.classList.remove('visible');
    if (actions) actions.classList.remove('visible');

    // Khôi phục nút Chỉnh sửa ở header
    if (editBtn) {
      editBtn.style.visibility = '';
      editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i> Chỉnh sửa';
      editBtn.classList.remove('btn-primary');
      editBtn.classList.add('btn-outline');
    }

    panel.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

    if (panelId === 'panel-ketqua') {
      document.querySelectorAll('#hs-grade-tbody td[contenteditable]').forEach(td =>
        td.removeAttribute('contenteditable')
      );
    }
  }

  /* ── Snapshot panel state for cancel-undo ── */
  function hsSnapshotPanel(panelId) {
    const panel = document.getElementById(panelId);
    const snap  = { fields: {}, grades: null };

    panel.querySelectorAll('[data-field]').forEach(el => {
      snap.fields[el.getAttribute('data-field')] = el.textContent;
    });

    if (panelId === 'panel-ketqua') {
      snap.grades = {};
      document.querySelectorAll('#hs-grade-tbody tr[data-subject]').forEach(row => {
        const subj = row.getAttribute('data-subject');
        snap.grades[subj] = {};
        ['oral', 'mid', 'final', 'avg'].forEach(col => {
          const td = row.querySelector(`[data-col="${col}"]`);
          if (td) snap.grades[subj][col] = td.textContent;
        });
      });
    }

    return snap;
  }

  /* ── Profile tab switcher (screen-hoSoHS) ── */
  function switchTab(tabBtn, tabId) {
    // Remove active from all tab buttons
    tabBtn.closest('.profile-tabs-bar')
      .querySelectorAll('.profile-tab')
      .forEach(t => t.classList.remove('active'));
    tabBtn.classList.add('active');

    // Hide all panels
    const screen = tabBtn.closest('[id^="screen-"]');
    ['tab-coban', 'tab-ketqua', 'tab-khen'].forEach(id => {
      const el = screen.querySelector('#' + id);
      if (!el) return;
      el.style.display = 'none';
      el.classList.add('screen--hidden');
    });

    // Show selected panel
    const panel = screen.querySelector('#' + tabId);
    if (!panel) return;
    panel.classList.remove('screen--hidden');

    if (tabId === 'tab-coban') {
      // tab-coban is itself a .profile-layout — needs flex
      panel.style.display = 'flex';
    } else {
      // tab-ketqua / tab-khen are wrapper divs — use block
      panel.style.display = 'block';
      const inner = panel.querySelector('.profile-layout');
      if (inner) inner.style.display = 'flex';
    }
  }

  /* ── Permission helpers ── */

  /**
   * Trả về role của user hiện tại từ sessionStorage.
   * Nếu chưa đăng nhập hoặc không xác định → mặc định 'student'.
   */
  function getCurrentRole() {
    try {
      const user = JSON.parse(sessionStorage.getItem('spms_user'));
      return (user && user.roleKey ? user.roleKey : 'student').toLowerCase();
    } catch {
      return 'student';
    }
  }

  /**
   * Các panel mà role học sinh (student) KHÔNG được chỉnh sửa.
   * Key = panelId, value = sectionKey tương ứng.
   */
  const STUDENT_READONLY_PANELS = {
    'panel-ketqua': 'ketqua',
    'panel-khen':   'khen',
    'panel-reward': 'reward',
  };

  /**
   * Ẩn nút Chỉnh sửa trên các panel mà role hiện tại không được phép,
   * và thêm tooltip giải thích lý do.
   */
  function applyEditPermissions() {
    const role = getCurrentRole();
    if (role === 'student') {
      Object.keys(STUDENT_READONLY_PANELS).forEach(panelId => {
        const sectionKey = STUDENT_READONLY_PANELS[panelId];
        const editBtn = document.getElementById('btn-edit-' + sectionKey);
        if (editBtn) editBtn.style.display = 'none';
      });
    }
  }

  /* ── Module init ── */
  function init() {
    hsPopulate();
    applyEditPermissions();

    // Set default tab state
    const defaultTabBtn = document.querySelector('#screen-hoSoHS .profile-tab.active');
    if (defaultTabBtn) switchTab(defaultTabBtn, 'tab-coban');
  }

  // Expose module API + globals for inline HTML onclick
  global.StudentHoSoHSModule = { init };

  // Expose functions called from inline HTML attributes
  global.hsToggleEdit  = hsToggleEdit;
  global.hsCancelEdit  = hsCancelEdit;
  global.hsSavePanel   = hsSavePanel;
  global.switchTab     = switchTab;

})(window);
