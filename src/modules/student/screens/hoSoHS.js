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
    const draft = global.SPMSDatabase?.find('studentRecordDrafts', item => item.studentId === 'STU_001');
    if (draft?.data) return draft.data;
    try { return JSON.parse(localStorage.getItem(HS_STORAGE_KEY)) || {}; } catch { return {}; }
  }

  function hsSave(data) {
    try { localStorage.setItem(HS_STORAGE_KEY, JSON.stringify(data)); } catch { /* quota exceeded */ }
    if (global.SPMSDatabase) {
      global.SPMSDatabase.upsert('studentRecordDrafts', {
        id: 'RECORD_DRAFT_STU_001', studentId: 'STU_001', data, savedAt: new Date().toISOString()
      });
    }
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
    ['tab-coban', 'tab-ketqua', 'tab-khen', 'tab-tudanhgia'].forEach(id => {
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
      panel.style.display = 'flex';
    } else if (tabId === 'tab-tudanhgia') {
      panel.style.display = 'block';
      const inner = panel.querySelector('.profile-layout');
      if (inner) inner.style.display = 'flex';
      tdgInit();
    } else {
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

/* ============================================================
   TỰ ĐÁNH GIÁ — Self-Assessment Module
   ============================================================ */

const TDG_KEY     = 'student_self_assessments';
const TDG_MAX     = 50;

const TDG_STAR_LABELS = ['', 'Yếu', 'Trung bình', 'Khá', 'Tốt', 'Xuất sắc'];
const TDG_OVERALL_LABELS = {
  excellent: 'Xuất sắc',
  good:      'Tốt',
  ok:        'Ổn',
  poor:      'Chưa tốt',
};
const TDG_SEMESTER_LABELS = {
  'hk1-2026-2027': 'Học Kỳ I — 2026–2027',
  'hk2-2026-2027': 'Học Kỳ II — 2026–2027',
  'hk1-2025-2026': 'Học Kỳ I — 2025–2026',
  'hk2-2025-2026': 'Học Kỳ II — 2025–2026',
};

// Current star selections: { studyRating: 0, conductRating: 0 }
const _tdgStars = { studyRating: 0, conductRating: 0 };
let   _tdgOverall = '';

/* ── Storage ── */
function tdgLoad() {
  try {
    return JSON.parse(localStorage.getItem(TDG_KEY)) || [];
  } catch { return []; }
}

function tdgSave(list) {
  try { localStorage.setItem(TDG_KEY, JSON.stringify(list)); } catch {}
}

/* ── Init — gọi mỗi lần mở tab ── */
function tdgInit() {
  tdgBindStars();
  tdgBindOverall();
  tdgBindSemesterChange();
  tdgBindForm();

  const semester = document.getElementById('tdg-semester-select')?.value || 'hk1-2026-2027';
  tdgShowSemester(semester);
  tdgUpdateSidebar();
}

/* ── Star rating ── */
function tdgBindStars() {
  document.querySelectorAll('.tdg-star-row').forEach(row => {
    const key = row.dataset.key;
    row.querySelectorAll('.tdg-star').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val);
        _tdgStars[key] = val;
        tdgRenderStars(row, val);
      });
      btn.addEventListener('mouseenter', () => {
        tdgRenderStars(row, parseInt(btn.dataset.val), true);
      });
      btn.addEventListener('mouseleave', () => {
        tdgRenderStars(row, _tdgStars[key] || 0);
      });
    });
  });
}

function tdgRenderStars(row, val, hover) {
  const key = row.dataset.key;
  row.querySelectorAll('.tdg-star').forEach(btn => {
    const bVal = parseInt(btn.dataset.val);
    btn.classList.toggle('active',  bVal <= val);
    btn.classList.toggle('hover',   hover && bVal <= val);
  });
  const lbl = row.querySelector('.tdg-star-label');
  if (lbl) lbl.textContent = val > 0 ? TDG_STAR_LABELS[val] : '';
}

/* ── Overall options ── */
function tdgBindOverall() {
  const container = document.getElementById('tdg-overall');
  if (!container) return;
  container.querySelectorAll('.tdg-overall-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _tdgOverall = btn.dataset.val;
      container.querySelectorAll('.tdg-overall-btn').forEach(b =>
        b.classList.toggle('active', b === btn)
      );
    });
  });
}

/* ── Semester change ── */
function tdgBindSemesterChange() {
  const sel = document.getElementById('tdg-semester-select');
  if (!sel) return;
  sel.addEventListener('change', () => {
    tdgShowSemester(sel.value);
    const lbl = document.getElementById('tdg-semester-label');
    if (lbl) lbl.textContent = TDG_SEMESTER_LABELS[sel.value] || sel.value;
  });
  // init label
  const lbl = document.getElementById('tdg-semester-label');
  if (lbl) lbl.textContent = TDG_SEMESTER_LABELS[sel.value] || sel.value;
}

/* ── Show semester: điều phối 3 zone ── */
function tdgShowSemester(semesterId) {
  const entry = tdgLoad().find(e => e.semesterId === semesterId);
  const viewZone  = document.getElementById('tdg-view-zone');
  const emptyZone = document.getElementById('tdg-empty-zone');
  const form      = document.getElementById('tdgForm');
  const badge     = document.getElementById('tdg-saved-badge');

  if (entry) {
    // Đã có đánh giá → hiện card xem
    if (viewZone)  { viewZone.style.display  = 'block'; tdgRenderViewCard(entry); }
    if (emptyZone) emptyZone.style.display = 'none';
    if (form)      form.style.display      = 'none';
    if (badge)     badge.style.display     = 'inline-flex';
  } else {
    // Chưa có → hiện empty state
    if (viewZone)  viewZone.style.display  = 'none';
    if (emptyZone) emptyZone.style.display = 'block';
    if (form)      form.style.display      = 'none';
    if (badge)     badge.style.display     = 'none';
  }
}

/* ── Render card xem đánh giá ── */
function tdgRenderViewCard(entry) {
  const cardEl = document.getElementById('tdg-view-card');
  if (!cardEl) return;

  const starStr = (n) =>
    `<span class="tdg-hist-stars">${'★'.repeat(n||0)}${'☆'.repeat(5-(n||0))}</span> <span style="color:#6b7280;font-size:12px;">${TDG_STAR_LABELS[n||0]}</span>`;

  const overallIcon = { excellent: '😁', good: '🙂', ok: '😐', poor: '😟' };
  const savedDate   = new Date(entry.savedAt).toLocaleDateString('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric'});
  const savedTime   = new Date(entry.savedAt).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'});

  const row = (label, val) => val
    ? `<div class="tdg-view-row"><span class="tdg-view-row__label">${label}</span><span class="tdg-view-row__value">${_tdgEsc(val)}</span></div>`
    : '';

  cardEl.innerHTML = `
    <div class="tdg-view-meta">
      <span class="tdg-view-meta__date"><i class="far fa-clock"></i> Lưu lúc ${savedTime}, ${savedDate}</span>
    </div>

    <div class="tdg-view-section">
      <div class="tdg-view-section__title"><i class="fas fa-star"></i> Đánh giá tổng quát</div>
      <div class="tdg-view-overall ${entry.overall}">${overallIcon[entry.overall]||''} ${TDG_OVERALL_LABELS[entry.overall]||'—'}</div>
    </div>

    <div class="tdg-view-section">
      <div class="tdg-view-section__title"><i class="fas fa-book-open"></i> Học tập</div>
      <div class="tdg-view-stars-row">
        <span>Điểm học tập:</span> ${starStr(entry.studyRating)}
      </div>
      ${row('Môn làm tốt', entry.strongSubject)}
      ${row('Môn cần cải thiện', entry.weakSubject)}
      ${row('Nhận xét', entry.studyNote)}
    </div>

    <div class="tdg-view-section">
      <div class="tdg-view-section__title"><i class="fas fa-heart"></i> Thái độ</div>
      <div class="tdg-view-stars-row">
        <span>Điểm thái độ:</span> ${starStr(entry.conductRating)}
      </div>
      ${row('Điều tự hào', entry.conductNote)}
    </div>

    ${(entry.activityNote || entry.growthNote) ? `
    <div class="tdg-view-section">
      <div class="tdg-view-section__title"><i class="fas fa-running"></i> Hoạt động & Phát triển</div>
      ${row('Hoạt động ngoại khóa', entry.activityNote)}
      ${row('Sự phát triển', entry.growthNote)}
    </div>` : ''}

    ${entry.goalNext ? `
    <div class="tdg-view-section">
      <div class="tdg-view-section__title"><i class="fas fa-bullseye"></i> Mục tiêu kỳ tới</div>
      ${row('Mục tiêu', entry.goalNext)}
    </div>` : ''}

    ${entry.overallNote ? `
    <div class="tdg-view-section">
      <div class="tdg-view-section__title"><i class="fas fa-comment"></i> Chia sẻ thêm</div>
      <p class="tdg-view-note">${_tdgEsc(entry.overallNote)}</p>
    </div>` : ''}
  `;
}

/* ── Chuyển sang chế độ edit ── */
function tdgEnterEdit() {
  const semester = document.getElementById('tdg-semester-select')?.value;
  const entry    = semester ? tdgLoad().find(e => e.semesterId === semester) : null;

  // Populate form nếu đã có data
  if (entry) {
    tdgPopulateForm(entry);
  } else {
    tdgResetFields();
  }

  document.getElementById('tdg-view-zone')?.style && (document.getElementById('tdg-view-zone').style.display = 'none');
  document.getElementById('tdg-empty-zone')?.style && (document.getElementById('tdg-empty-zone').style.display = 'none');
  const form = document.getElementById('tdgForm');
  if (form) form.style.display = 'block';
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Hủy edit → quay về view/empty ── */
function tdgCancelEdit() {
  const semester = document.getElementById('tdg-semester-select')?.value || 'hk1-2026-2027';
  tdgShowSemester(semester);
}

/* ── Xóa đánh giá hiện tại ── */
function tdgDeleteCurrent() {
  const semester = document.getElementById('tdg-semester-select')?.value;
  if (!semester) return;
  if (!confirm('Xóa bản đánh giá kỳ này?')) return;
  let list = tdgLoad().filter(e => e.semesterId !== semester);
  tdgSave(list);
  tdgShowSemester(semester);
  tdgUpdateSidebar();
  window.SPMSToast?.show('success', 'Xóa thành công', 'Đã xóa bản tự đánh giá.', 2200);
}

/* ── Populate form từ entry ── */
function tdgPopulateForm(entry) {
  document.querySelectorAll('#tdgForm [data-key]').forEach(el => {
    const key = el.dataset.key;
    if (!entry[key]) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = entry[key];
  });
  ['studyRating', 'conductRating'].forEach(key => {
    const val = parseInt(entry[key]) || 0;
    _tdgStars[key] = val;
    const row = document.querySelector(`.tdg-star-row[data-key="${key}"]`);
    if (row) tdgRenderStars(row, val);
  });
  if (entry.overall) {
    _tdgOverall = entry.overall;
    document.querySelectorAll('.tdg-overall-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.val === entry.overall)
    );
  }
}
function tdgBindForm() {
  const form = document.getElementById('tdgForm');
  if (!form || form._tdgBound) return;
  form._tdgBound = true;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    tdgSubmit();
  });
}

/* ── Load đánh giá đã lưu cho 1 kỳ ── */
function tdgLoadSemester(semesterId) {
  const list   = tdgLoad();
  const latest = list.find(e => e.semesterId === semesterId);

  // Reset form
  tdgResetFields();

  if (latest) {
    // Populate fields
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.dataset.key;
      if (!latest[key]) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = latest[key];
      }
    });
    // Stars
    ['studyRating', 'conductRating'].forEach(key => {
      const val = parseInt(latest[key]) || 0;
      _tdgStars[key] = val;
      const row = document.querySelector(`.tdg-star-row[data-key="${key}"]`);
      if (row) tdgRenderStars(row, val);
    });
    // Overall
    if (latest.overall) {
      _tdgOverall = latest.overall;
      const container = document.getElementById('tdg-overall');
      if (container) {
        container.querySelectorAll('.tdg-overall-btn').forEach(btn =>
          btn.classList.toggle('active', btn.dataset.val === latest.overall)
        );
      }
    }
    // Badge
    const badge = document.getElementById('tdg-saved-badge');
    if (badge) badge.style.display = 'inline-flex';
  } else {
    const badge = document.getElementById('tdg-saved-badge');
    if (badge) badge.style.display = 'none';
  }
}

/* ── Submit ── */
function tdgSubmit() {
  const semester = document.getElementById('tdg-semester-select')?.value;
  if (!semester) return;

  // Validate required
  if (!_tdgStars.studyRating || !_tdgStars.conductRating || !_tdgOverall) {
    window.SPMSToast?.show('warning', 'Tự đánh giá', 'Vui lòng chọn đánh giá sao và đánh giá tổng quát.', 2500);
    return;
  }

  const entry = {
    id:           Date.now(),
    semesterId:   semester,
    semesterLabel: TDG_SEMESTER_LABELS[semester] || semester,
    savedAt:      new Date().toISOString(),
    studyRating:  _tdgStars.studyRating,
    conductRating: _tdgStars.conductRating,
    overall:      _tdgOverall,
  };

  // Collect text fields
  document.querySelectorAll('[data-key]').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      entry[el.dataset.key] = el.value.trim();
    }
  });

  // Save — replace nếu cùng kỳ, thêm mới nếu khác
  let list = tdgLoad();
  const existing = list.findIndex(e => e.semesterId === semester);
  if (existing >= 0) {
    list[existing] = entry;
  } else {
    list.unshift(entry);
    if (list.length > TDG_MAX) list.length = TDG_MAX;
  }
  tdgSave(list);

  // Quay về view zone
  tdgShowSemester(semester);
  tdgUpdateSidebar();
  window.SPMSToast?.show('success', 'Tự đánh giá', `Đã lưu đánh giá kỳ "${TDG_SEMESTER_LABELS[semester] || semester}".`, 2800);
}

/* ── Reset form ── */
function tdgReset() {
  if (!confirm('Xóa trắng toàn bộ nội dung đang nhập?')) return;
  tdgResetFields();
}

function tdgResetFields() {
  document.querySelectorAll('#tdgForm [data-key]').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = '';
  });
  _tdgStars.studyRating   = 0;
  _tdgStars.conductRating = 0;
  _tdgOverall = '';
  document.querySelectorAll('.tdg-star-row').forEach(row => tdgRenderStars(row, 0));
  document.querySelectorAll('.tdg-overall-btn').forEach(btn => btn.classList.remove('active'));
  const noteEl = document.getElementById('tdg-save-note');
  if (noteEl) noteEl.textContent = '';
}

/* ── Sidebar stats ── */
function tdgUpdateSidebar() {
  const list = tdgLoad();
  const countEl = document.getElementById('tdg-count');
  const lastEl  = document.getElementById('tdg-last-time');
  if (countEl) countEl.textContent = list.length;
  if (lastEl) {
    lastEl.textContent = list.length
      ? new Date(list[0].savedAt).toLocaleDateString('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric'})
      : 'Chưa có';
  }
}

/* ── History modal ── */
function tdgOpenHistory() {
  const overlay = document.getElementById('tdgHistoryOverlay');
  if (!overlay) return;
  tdgRenderHistory();
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function tdgCloseHistory() {
  const overlay = document.getElementById('tdgHistoryOverlay');
  if (!overlay) return;
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function tdgRenderHistory() {
  const list    = tdgLoad();
  const listEl  = document.getElementById('tdgHistoryList');
  const emptyEl = document.getElementById('tdgHistoryEmpty');
  const countEl = document.getElementById('tdg-hist-count-val');
  const clearBtn = document.getElementById('tdg-hist-clear-btn');

  if (countEl)  countEl.textContent  = list.length;
  if (clearBtn) clearBtn.style.display = list.length ? 'inline-flex' : 'none';

  if (!listEl || !emptyEl) return;

  if (!list.length) {
    emptyEl.style.display = 'flex';
    listEl.innerHTML = '';
    return;
  }

  emptyEl.style.display = 'none';

  const overallIcon = { excellent: '😁', good: '🙂', ok: '😐', poor: '😟' };
  const starStr = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  listEl.innerHTML = list.map((e, i) => `
    <div class="tdg-hist-card ${i === 0 ? 'tdg-hist-card--latest' : ''}">
      <div class="tdg-hist-card__header">
        <span class="tdg-hist-card__semester">${e.semesterLabel || e.semesterId}</span>
        <span class="tdg-hist-card__overall">${overallIcon[e.overall] || ''} ${TDG_OVERALL_LABELS[e.overall] || '—'}</span>
        <span class="tdg-hist-card__date">${new Date(e.savedAt).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'})}</span>
      </div>
      <div class="tdg-hist-card__stars">
        <span>Học tập: <span class="tdg-hist-stars">${starStr(e.studyRating||0)}</span> ${TDG_STAR_LABELS[e.studyRating||0]}</span>
        <span style="margin-left:16px;">Thái độ: <span class="tdg-hist-stars">${starStr(e.conductRating||0)}</span> ${TDG_STAR_LABELS[e.conductRating||0]}</span>
      </div>
      ${e.studyNote   ? `<div class="tdg-hist-card__field"><span class="tdg-hist-card__field-label">Học tập:</span> ${_tdgEsc(e.studyNote)}</div>` : ''}
      ${e.growthNote  ? `<div class="tdg-hist-card__field"><span class="tdg-hist-card__field-label">Phát triển:</span> ${_tdgEsc(e.growthNote)}</div>` : ''}
      ${e.goalNext    ? `<div class="tdg-hist-card__field"><span class="tdg-hist-card__field-label">Mục tiêu:</span> ${_tdgEsc(e.goalNext)}</div>` : ''}
      ${e.overallNote ? `<div class="tdg-hist-card__field"><span class="tdg-hist-card__field-label">Chia sẻ:</span> ${_tdgEsc(e.overallNote)}</div>` : ''}
      <div class="tdg-hist-card__actions">
        <button class="btn btn-ghost btn-sm" type="button" onclick="tdgLoadEntry('${e.semesterId}');tdgCloseHistory();">
          <i class="fas fa-eye"></i> Xem / Sửa
        </button>
        <button class="btn btn-ghost btn-sm" style="color:#dc2626;" type="button" onclick="tdgDeleteEntry(${e.id})">
          <i class="fas fa-trash-alt"></i> Xóa
        </button>
      </div>
    </div>`).join('');
}

function _tdgEsc(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function tdgLoadEntry(semesterId) {
  const sel = document.getElementById('tdg-semester-select');
  if (sel) {
    sel.value = semesterId;
    sel.dispatchEvent(new Event('change'));
  }
  tdgShowSemester(semesterId);
}

function tdgDeleteEntry(id) {
  if (!confirm('Xóa bản đánh giá này?')) return;
  let list = tdgLoad().filter(e => e.id !== id);
  tdgSave(list);
  tdgRenderHistory();
  tdgUpdateSidebar();
  // Cập nhật view zone nếu kỳ đang hiển thị bị xóa
  const semester = document.getElementById('tdg-semester-select')?.value;
  if (semester) tdgShowSemester(semester);
  window.SPMSToast?.show('success', 'Xóa thành công', 'Đã xóa bản tự đánh giá.', 2200);
}

function tdgClearHistory() {
  if (!confirm('Xóa toàn bộ lịch sử tự đánh giá? Hành động này không thể hoàn tác.')) return;
  localStorage.removeItem(TDG_KEY);
  tdgRenderHistory();
  tdgUpdateSidebar();
  window.SPMSToast?.show('success', 'Xóa thành công', 'Đã xóa toàn bộ lịch sử tự đánh giá.', 2400);
}

// Đóng modal khi click backdrop
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('tdgHistoryOverlay');
  if (overlay && e.target === overlay) tdgCloseHistory();
});
