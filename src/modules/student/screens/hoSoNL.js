/**
 * hoSoNL.js
 * Screen module: Hồ Sơ Năng Lực Cá Nhân
 * Manages profile view/edit mode, localStorage persistence, and update history modal.
 */

(function (global) {
  'use strict';

  let profileEditMode = false;

  // Key order must match the DOM order of .input-text elements
  const profileFieldKeys = [
    'fullname', 'birthday', 'gender', 'ethnicity', 'origin',
    'party', 'policy', 'studentCode', 'address',
    'achievement', 'activity', 'certificate', 'skill',
    'study', 'product', 'roadmap',
    'goalShort', 'goalMedium', 'goalLong',
    'hobby', 'favoriteSubject', 'studyMethod',
  ];

  // Thông tin định danh do nhà trường quản lý, học sinh chỉ được xem.
  const lockedProfileFields = new Set([
    'fullname', 'birthday', 'gender', 'ethnicity', 'origin',
    'party', 'policy', 'studentCode', 'address', 'achievement', 'study',
  ]);

  function loadApprovedAchievements() {
    // Ưu tiên lấy studentCode từ user session, fallback STUDENT_PROFILE
    const profile = (typeof getCurrentStudentProfile === 'function')
      ? getCurrentStudentProfile()
      : (global.STUDENT_PROFILE || {});
    const studentCode = String(profile.studentCode || '').toUpperCase();
    const database = global.SPMSDatabase;
    if (!database || !studentCode) return [];
    const student = database.list('students').find(record => String(record.code || '').toUpperCase() === studentCode);
    if (!student) return [];
    const files = database.list('achievementFiles');
    return database.list('achievements')
      .filter(record => record.studentId === student.id && record.status === 'approved')
      .map(record => ({
        ...record,
        evidenceName: files.find(file => file.achievementId === record.id)?.name || ''
      }));
  }

  function approvedAchievementText() {
    return loadApprovedAchievements().map(record => `- ${record.title}`).join('\n');
  }

  function currentStudyResultText() {
    const history = global.GRADE_HISTORY || {};
    const current = history['2026-2027'] || Object.values(history).find(item => item?.isCurrent);
    if (!current?.annual || !current?.kpi) return '';
    const strongest = [...(current.annual.subjects || [])]
      .sort((a, b) => Number(b.avg) - Number(a.avg))
      .slice(0, 3)
      .map(subject => `${subject.name} (${subject.avg})`)
      .join(', ');
    return `- Năm học ${current.label}: ĐTB cả năm ${current.kpi.avg}/10 | Hạnh kiểm: ${current.kpi.conduct} | Xếp loại: ${current.kpi.rank} | ${current.kpi.top}.\n- Môn học nổi bật: ${strongest}.`;
  }

  function getProfileDefaults() {
    // Đọc từ profile của user đang đăng nhập thay vì STUDENT_PROFILE cứng
    const identity = (typeof getCurrentStudentProfile === 'function')
      ? getCurrentStudentProfile()
      : (global.STUDENT_PROFILE || {});
    return {
      fullname:      identity.fullName    || identity.name || '',
      birthday:      identity.birthday    || '',
      gender:        identity.gender      || '',
      ethnicity:     identity.ethnicity   || '',
      origin:        identity.origin      || '',
      party:         identity.party       || '',
      policy:        identity.policy      || '',
      studentCode:   identity.studentCode || '',
      address:       identity.address     || '',
      achievement:   '',
      activity:      '',
      certificate:   '',
      skill:         '',
      study:         '',
      product:       '',
      roadmap:       '',
      goalShort:     '',
      goalMedium:    '',
      goalLong:      '',
      hobby:         '',
      favoriteSubject: '',
      studyMethod:   '',
    };
  }

  function getProfileFieldNodes() {
    const container = document.getElementById('screen-hoSoNL');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.input-text'));
  }

  function renderProfileValues(data) {
    const nodes = getProfileFieldNodes();
    nodes.forEach((node, index) => {
      const key = profileFieldKeys[index];
      if (!key) return;
      node.textContent = data[key] ?? '';
    });
  }

  function _profileStorageKey() {
    try {
      const user = JSON.parse(sessionStorage.getItem('spms_user'));
      const id = user?.userId || user?.id || user?.username || 'default';
      return `studentProfileData_${id}`;
    } catch {
      return 'studentProfileData_default';
    }
  }

  function _profileStudentId() {
    try {
      const user = JSON.parse(sessionStorage.getItem('spms_user'));
      return user?.userId || user?.id || 'STU_001';
    } catch {
      return 'STU_001';
    }
  }

  function saveProfileData(data) {
    const key = _profileStorageKey();
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(key + '_savedAt', new Date().toISOString());
    if (global.SPMSDatabase) {
      const stuId = _profileStudentId();
      global.SPMSDatabase.upsert('studentProfileDrafts', {
        id: 'PROFILE_DRAFT_' + stuId,
        studentId: stuId,
        data,
        savedAt: new Date().toISOString()
      });
    }
  }

  function loadProfileData() {
    const defaults = getProfileDefaults();
    defaults.achievement = approvedAchievementText();
    defaults.study = currentStudyResultText() || defaults.study;
    const stuId = _profileStudentId();
    const databaseDraft = global.SPMSDatabase?.find('studentProfileDrafts', item => item.studentId === stuId);
    const saved = databaseDraft?.data
      ? JSON.stringify(databaseDraft.data)
      : localStorage.getItem(_profileStorageKey());
    if (!saved) return defaults;
    try {
      const data = { ...defaults, ...JSON.parse(saved) };
      lockedProfileFields.forEach(key => { data[key] = defaults[key]; });
      return data;
    } catch {
      return defaults;
    }
  }

  function populateProfileForm() {
    renderProfileValues(loadProfileData());
    renderApprovedAchievements();
  }

  function manageStudentAchievements() {
    const target = document.getElementById('nav-hoSoHS');
    if (typeof global.showScreen === 'function') global.showScreen('hoSoHS', target);
    setTimeout(() => document.getElementById('panel-reward')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function renderApprovedAchievements() {
    const section = document.getElementById('sec-2-thanh-tich');
    const field = section?.querySelector('[data-field="achievement"]');
    const proofBox = section?.querySelector('.proof-box');
    if (!section || !field || !proofBox) return;
    const records = loadApprovedAchievements();
    field.innerHTML = records.length
      ? records.map(record => `<div class="portfolio-approved-item"><span>${esc(record.title)}</span><small><i class="fas fa-check-circle"></i> Đã xác nhận${record.period ? ` · ${esc(record.period)}` : ''}</small></div>`).join('')
      : '<div class="portfolio-achievement-empty">Chưa có thành tích nào được nhà trường xác nhận.</div>';

    const files = records.filter(record => record.evidenceName);
    const filesContainer = proofBox.querySelector('.proof-files');
    if (filesContainer) filesContainer.innerHTML = files.map(record => `<div class="file-chip"><i class="fas fa-file-pdf file-chip__icon file-chip__icon--pdf"></i><span class="file-chip__name" title="${esc(record.evidenceName)}">${esc(record.evidenceName)}</span><button class="file-chip__btn file-chip__btn--view" type="button" onclick="openProofFile('${esc(record.evidenceName)}', this)">Xem</button></div>`).join('');
    const sub = proofBox.querySelector('.proof-sub');
    if (sub) sub.textContent = files.length ? `${files.length} minh chứng của thành tích đã xác nhận.` : 'Chưa có tệp minh chứng đã xác nhận.';

    if (!section.querySelector('.portfolio-manage-achievements')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-ghost btn-sm portfolio-manage-achievements';
      button.innerHTML = '<i class="fas fa-list"></i> Quản lý thành tích';
      button.addEventListener('click', manageStudentAchievements);
      section.querySelector('.form-section-header')?.insertAdjacentElement('afterend', button);
    }
  }

  function updateProfileStatus(message, tone) {
    window.SPMSToast?.show(tone || 'info', 'Hồ sơ năng lực', message, 2400);
  }

  function showSystemInfo(message, tone) {
    updateProfileStatus(message, tone || 'info');
  }

  function setProfileEditMode(isEditing) {
    profileEditMode = isEditing;

    const container  = document.querySelector('#screen-hoSoNL .form-container');
    const actionBtn  = document.getElementById('profileActionBtn');
    const actionsBar = document.getElementById('profileActionsBar');
    const nodes      = getProfileFieldNodes();

    if (container)  container.classList.toggle('is-editing', isEditing);
    if (actionsBar) actionsBar.classList.toggle('is-visible', isEditing);

    if (actionBtn) {
      actionBtn.style.visibility = isEditing ? 'hidden' : '';
    }

    nodes.forEach((node, index) => {
      const key = profileFieldKeys[index];
      const isLocked = lockedProfileFields.has(key);
      const isEditable = isEditing && !!key && !isLocked;
      node.setAttribute('contenteditable', isEditable ? 'true' : 'false');
      node.setAttribute('aria-readonly', isLocked ? 'true' : 'false');
      node.classList.toggle('is-editing', isEditable);
      node.classList.toggle('is-locked', isLocked);
      const inputBox = node.closest('.input-box');
      if (inputBox) {
        inputBox.classList.toggle('input-box--locked', isLocked);
        if (isLocked) inputBox.title = 'Thông tin do nhà trường quản lý';
        else inputBox.removeAttribute('title');
      }
    });

    // Bật/tắt giao diện chỉnh sửa minh chứng
    toggleProofEditUI(isEditing);

    if (isEditing) {
      const firstNode = nodes.find(n => n.getAttribute('contenteditable') === 'true');
      if (firstNode) {
        firstNode.focus();
        const range = document.createRange();
        range.selectNodeContents(firstNode);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  /* ── Proof box edit UI ── */

  /**
   * Khi ở chế độ edit: thêm nút xóa vào từng file-chip và nút "Thêm tệp" vào mỗi proof-box.
   * Khi thoát edit: dọn sạch các UI tạm đó.
   */
  function toggleProofEditUI(isEditing) {
    const screen = document.getElementById('screen-hoSoNL');
    if (!screen) return;

    if (isEditing) {
      // Thêm nút xóa vào từng file-chip hiện có (nếu chưa có)
      screen.querySelectorAll('.file-chip').forEach(chip => {
        if (chip.closest('#sec-2-thanh-tich, #sec-6-hoc-tap')) return;
        if (chip.querySelector('.proof-remove-btn')) return; // đã có rồi
        const btn = document.createElement('button');
        btn.type      = 'button';
        btn.className = 'file-chip__btn proof-remove-btn';
        btn.title     = 'Xóa tệp này';
        btn.setAttribute('aria-label', 'Xóa tệp');
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.addEventListener('click', () => removeProofChip(chip));
        chip.appendChild(btn);
      });

      // Thêm nút "Thêm tệp" vào mỗi proof-box (nếu chưa có)
      screen.querySelectorAll('.proof-box').forEach(box => {
        if (box.closest('#sec-2-thanh-tich, #sec-6-hoc-tap')) return;
        if (box.querySelector('.proof-add-btn')) return;

        // Tạo input file ẩn
        const input = document.createElement('input');
        input.type   = 'file';
        input.accept = '.png,.jpg,.jpeg,.pdf';
        input.multiple = true;
        input.className = 'proof-file-input';
        input.style.display = 'none';
        input.addEventListener('change', function () {
          Array.from(this.files).forEach(file => addProofChip(box, file));
          this.value = '';
        });

        // Nút "Thêm tệp"
        const addBtn = document.createElement('button');
        addBtn.type      = 'button';
        addBtn.className = 'proof-add-btn';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Thêm tệp';
        addBtn.addEventListener('click', () => input.click());

        box.appendChild(input);
        box.appendChild(addBtn);
      });
    } else {
      // Dọn sạch: xóa nút xóa và nút thêm tạm
      screen.querySelectorAll('.proof-remove-btn').forEach(btn => btn.remove());
      screen.querySelectorAll('.proof-add-btn').forEach(btn => btn.remove());
      screen.querySelectorAll('.proof-file-input').forEach(inp => inp.remove());
    }
  }

  /** Xóa một file-chip khỏi proof-box và cập nhật dòng chú thích số lượng */
  function removeProofChip(chip) {
    const box = chip.closest('.proof-box');
    chip.style.transition = 'opacity .18s';
    chip.style.opacity    = '0';
    setTimeout(() => {
      chip.remove();
      updateProofSub(box);
      window.SPMSToast?.show('success', 'Xóa thành công', 'Đã xóa tệp minh chứng khỏi danh sách.', 2200);
    }, 190);
  }

  /** Thêm một file-chip mới vào proof-box từ File object */
  function addProofChip(box, file) {
    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) {
      window.SPMSToast?.show('warning', 'File quá lớn', `Vui lòng chọn file dưới ${maxMB}MB.`, 3000);
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImg = file.type.startsWith('image/');
    const iconClass = isPdf ? 'file-chip__icon--pdf' : isImg ? 'file-chip__icon--img' : '';
    const faIcon    = isPdf ? 'fas fa-file-pdf' : isImg ? 'fas fa-image' : 'fas fa-file-alt';

    const chip = document.createElement('div');
    chip.className = 'file-chip';
    chip.innerHTML = `
      <i class="fas ${faIcon} file-chip__icon ${iconClass}"></i>
      <span class="file-chip__name" title="${file.name}">${file.name}</span>
      <button class="file-chip__btn file-chip__btn--view proof-view-new" type="button"
              onclick="window.SPMSToast?.show('info','Minh chứng','Tệp mới chưa được tải lên máy chủ.',2200)">Xem</button>
    `;

    // Thêm nút xóa ngay lập tức (vì đang ở chế độ edit)
    const removeBtn = document.createElement('button');
    removeBtn.type      = 'button';
    removeBtn.className = 'file-chip__btn proof-remove-btn';
    removeBtn.title     = 'Xóa tệp này';
    removeBtn.setAttribute('aria-label', 'Xóa tệp');
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', () => removeProofChip(chip));
    chip.appendChild(removeBtn);

    // Chèn trước nút "Thêm tệp"
    const addBtn = box.querySelector('.proof-add-btn');
    const filesContainer = box.querySelector('.proof-files');
    if (filesContainer) {
      filesContainer.appendChild(chip);
    } else if (addBtn) {
      box.insertBefore(chip, addBtn);
    } else {
      box.appendChild(chip);
    }

    updateProofSub(box);
    window.SPMSToast?.show('success', 'Minh chứng', `Đã thêm "${file.name}". Nhấn Lưu Hồ Sơ để xác nhận.`, 2800);
  }

  /** Cập nhật dòng .proof-sub đếm số tệp trong proof-box */
  function updateProofSub(box) {
    const subEl = box.querySelector('.proof-sub');
    if (!subEl) return;
    const count = box.querySelectorAll('.file-chip').length;
    if (count === 0) {
      subEl.textContent = 'Chưa có tệp đính kèm.';
    } else {
      subEl.textContent = `${count} minh chứng trong danh sách.`;
    }
  }

  /* ── Proof files snapshot (để diff khi lưu) ── */
  let _proofSnapshot = {};
  let _proofHtmlSnapshot = [];

  /**
   * Đọc trạng thái proof files hiện tại từ DOM.
   * Trả về object: { sectionId: [fileName, ...], ... }
   */
  function snapshotProofFiles() {
    const screen = document.getElementById('screen-hoSoNL');
    if (!screen) return {};
    const result = {};
    screen.querySelectorAll('.proof-box').forEach((box, idx) => {
      const key = 'proof_' + idx;
      result[key] = Array.from(box.querySelectorAll('.file-chip .file-chip__name'))
        .map(el => el.textContent.trim());
    });
    return result;
  }

  /**
   * So sánh 2 snapshot proof và trả về mô tả thay đổi dạng mảng string.
   * VD: ["Minh chứng #1: +Python.jpg", "Minh chứng #2: -OldFile.pdf"]
   */
  function diffProofFiles(before, after) {
    const PROOF_SECTION_NAMES = [
      'Thành tích', 'Hoạt động', 'Chứng chỉ', 'Học tập', 'Sản phẩm',
    ];
    const changes = [];
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    allKeys.forEach(key => {
      const idx    = parseInt(key.replace('proof_', ''));
      const label  = PROOF_SECTION_NAMES[idx] || ('Minh chứng #' + (idx + 1));
      const bFiles = before[key] || [];
      const aFiles = after[key]  || [];
      const added   = aFiles.filter(f => !bFiles.includes(f));
      const removed = bFiles.filter(f => !aFiles.includes(f));
      added.forEach(f   => changes.push({ field: key, label, type: 'added',   file: f }));
      removed.forEach(f => changes.push({ field: key, label, type: 'removed', file: f }));
    });
    return changes;
  }

  function toggleProfileEdit() {
    if (!profileEditMode) {
      // Chụp snapshot proof files trước khi bắt đầu edit
      _proofSnapshot = snapshotProofFiles();
      _proofHtmlSnapshot = Array.from(document.querySelectorAll('#screen-hoSoNL .proof-box'))
        .map(box => box.innerHTML);
      setProfileEditMode(true);
    }
  }

  function cancelProfileEdit() {
    try {
      document.querySelectorAll('#screen-hoSoNL .proof-box').forEach((box, index) => {
        if (_proofHtmlSnapshot[index] != null) box.innerHTML = _proofHtmlSnapshot[index];
      });
      populateProfileForm();
    } finally {
      setProfileEditMode(false);
      _proofHtmlSnapshot = [];
    }
    updateProfileStatus('Đã hủy chỉnh sửa, giữ nguyên dữ liệu trước đó.', 'info');
  }

  function saveProfile() {
    const nodes    = getProfileFieldNodes();
    const prevData = loadProfileData();
    const data     = getProfileDefaults();

    nodes.forEach((node, index) => {
      const key = profileFieldKeys[index];
      if (!key) return;
      if (lockedProfileFields.has(key)) {
        data[key] = prevData[key];
        return;
      }
      data[key] = node.textContent.replace(/\n/g, '\n').trim();
    });

    // Diff proof files
    const proofAfter   = snapshotProofFiles();
    const proofChanges = diffProofFiles(_proofSnapshot, proofAfter);

    saveProfileData(data);
    recordProfileHistory('save', data, prevData, proofChanges);
    setProfileEditMode(false);
    updateProfileStatus('Cập nhật hồ sơ thành công.', 'success');
  }

  function resetProfile() {
    const prevData = loadProfileData();
    const defaults = getProfileDefaults();
    const resetData = { ...defaults };
    lockedProfileFields.forEach(key => {
      resetData[key] = prevData[key];
    });
    renderProfileValues(resetData);
    saveProfileData(resetData);
    recordProfileHistory('reset', resetData, prevData);
    updateProfileStatus('Đã đặt lại về dữ liệu mặc định.', 'info');
  }

  /* ===== PROFILE HISTORY ENGINE ===== */
  const HISTORY_KEY = 'studentProfileHistory';
  const HISTORY_MAX = 50;

  const FIELD_LABELS = {
    fullname: 'Họ và tên',    birthday: 'Ngày sinh',      gender: 'Giới tính',
    ethnicity: 'Dân tộc',     origin: 'Nơi sinh',          party: 'Đoàn viên',
    policy: 'Diện chính sách', studentCode: 'Mã học sinh',  address: 'Địa chỉ',
    achievement: 'Thành tích', activity: 'Hoạt động',       certificate: 'Chứng chỉ',
    skill: 'Kỹ năng',          study: 'Học tập',             product: 'Sản phẩm',
    roadmap: 'Lộ trình',       goalShort: 'MT ngắn hạn',    goalMedium: 'MT trung hạn',
    goalLong: 'MT dài hạn',    hobby: 'Sở thích',           favoriteSubject: 'Môn yêu thích',
    studyMethod: 'Phương pháp học',
  };

  function loadProfileHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveProfileHistory(entries) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries)); } catch { /* quota */ }
  }

  function recordProfileHistory(action, newData, prevData, proofChanges) {
    const history = loadProfileHistory();

    const changedFields = Object.keys(FIELD_LABELS).filter(
      k => (newData[k] || '').trim() !== (prevData[k] || '').trim()
    );

    const entry = {
      id:            Date.now(),
      action,
      timestamp:     new Date().toISOString(),
      changedFields,
      proofChanges:  proofChanges || [],
      snapshot:      { ...newData },
    };

    history.unshift(entry);
    if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
    saveProfileHistory(history);
  }

  function clearProfileHistory() {
    if (!confirm('Xóa toàn bộ lịch sử cập nhật? Hành động này không thể hoàn tác.')) return;
    localStorage.removeItem(HISTORY_KEY);
    renderHistoryModal();
    window.SPMSToast?.show('success', 'Xóa thành công', 'Đã xóa toàn bộ lịch sử cập nhật.', 2200);
  }

  function formatHistoryTime(isoStr) {
    try {
      const d    = new Date(isoStr);
      const now  = new Date();
      const diff = (now - d) / 1000;
      if (diff < 60)    return 'Vừa xong';
      if (diff < 3600)  return `${Math.floor(diff / 60)} phút trước`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
      return d.toLocaleDateString('vi-VN');
    } catch { return isoStr; }
  }

  function formatHistoryTimeFull(isoStr) {
    try {
      const d    = new Date(isoStr);
      const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return `${time} — ${date}`;
    } catch { return isoStr; }
  }

  function renderHistoryModal() {
    const history  = loadProfileHistory();
    const empty    = document.getElementById('historyEmpty');
    const timeline = document.getElementById('historyTimeline');
    const totalEl  = document.getElementById('historyTotalCount');
    const lastEl   = document.getElementById('historyLastTime');
    const clearBtn = document.getElementById('historyClearBtn');
    const subtitle = document.getElementById('historySubtitle');

    if (totalEl) totalEl.textContent = history.length;
    if (lastEl)  lastEl.textContent  = history.length ? formatHistoryTime(history[0].timestamp) : 'Chưa có';
    if (clearBtn) clearBtn.style.display = history.length ? 'inline-flex' : 'none';

    if (subtitle) {
      let user = null;
      try { user = JSON.parse(sessionStorage.getItem('spms_user')); } catch {}
      subtitle.textContent = `Nhật ký thay đổi hồ sơ năng lực của ${user?.name || 'Nguyễn Văn Hoàng Anh'}`;
    }

    if (!timeline || !empty) return;

    if (history.length === 0) {
      empty.style.display    = 'flex';
      timeline.style.display = 'none';
      return;
    }

    empty.style.display    = 'none';
    timeline.style.display = 'block';

    timeline.innerHTML = history.map((entry, idx) => {
      const isLatest   = idx === 0;
      const isSave     = entry.action === 'save';
      const dotClass   = isLatest ? 'history-item__dot--latest' : isSave ? 'history-item__dot--save' : 'history-item__dot--reset';
      const badgeClass = isLatest ? 'history-item__badge--latest' : isSave ? 'history-item__badge--save' : 'history-item__badge--reset';
      const icon       = isSave ? 'fas fa-save' : 'fas fa-undo';
      const label      = isSave ? 'Đã lưu' : 'Đặt lại';
      const actionTxt  = isSave ? 'Cập nhật hồ sơ' : 'Đặt lại về mặc định';
      const itemClass  = isLatest ? 'history-item history-item--latest' : 'history-item';

      let changesHtml = '';
      if (entry.changedFields && entry.changedFields.length > 0) {
        const tags = entry.changedFields.slice(0, 8).map(f =>
          `<span class="history-change-tag history-change-tag--modified">${FIELD_LABELS[f] || f}</span>`
        ).join('');
        const more = entry.changedFields.length > 8
          ? `<span class="history-change-tag">+${entry.changedFields.length - 8} trường</span>`
          : '';
        changesHtml += `<div class="history-item__changes">${tags}${more}</div>`;
      }

      // Proof file changes
      const proofChanges = entry.proofChanges || [];
      if (proofChanges.length > 0) {
        const proofTags = proofChanges.slice(0, 6).map(c => {
          const icon  = c.type === 'added' ? 'fas fa-plus-circle' : 'fas fa-minus-circle';
          const cls   = c.type === 'added' ? 'history-change-tag--proof-add' : 'history-change-tag--proof-remove';
          const verb  = c.type === 'added' ? 'Thêm' : 'Xóa';
          return `<span class="history-change-tag ${cls}" title="${c.label}: ${c.type === 'added' ? '+' : '-'}${c.file}">
            <i class="${icon}" style="margin-right:3px;"></i>${verb} tệp · ${c.label}
          </span>`;
        }).join('');
        const moreProof = proofChanges.length > 6
          ? `<span class="history-change-tag">+${proofChanges.length - 6} tệp</span>`
          : '';
        changesHtml += `<div class="history-item__changes" style="margin-top:4px;">${proofTags}${moreProof}</div>`;
      }

      const hasAnyChange = (entry.changedFields && entry.changedFields.length > 0) || proofChanges.length > 0;
      if (!changesHtml && isSave) {
        changesHtml = `<p class="history-item__no-change">Không có thay đổi so với lần lưu trước.</p>`;
      }

      return `
        <li class="${itemClass}" data-id="${entry.id}">
          <div class="history-item__dot ${dotClass}" aria-hidden="true">
            <i class="${icon}"></i>
          </div>
          <div class="history-item__card">
            <div class="history-item__top">
              <span class="history-item__action">${actionTxt}</span>
              <span class="history-item__badge ${badgeClass}">
                <i class="${icon}"></i> ${label}${isLatest ? ' · Gần nhất' : ''}
              </span>
            </div>
            <div class="history-item__time">
              <i class="fas fa-clock" style="margin-right:3px;"></i>
              ${formatHistoryTimeFull(entry.timestamp)}
            </div>
            ${changesHtml}
          </div>
        </li>`;
    }).join('');
  }

  function openProfileHistoryModal() {
    const modal = document.getElementById('profileHistoryModal');
    if (!modal) return;
    renderHistoryModal();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProfileHistoryModal() {
    const modal = document.getElementById('profileHistoryModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ── Module init ── */
  function init() {
    populateProfileForm();
    setProfileEditMode(false);
    initShareLink();
    global.addEventListener('student-results-updated', populateProfileForm);
    global.SPMSDatabase?.subscribe(detail => {
      const collections = detail?.collections || (detail?.collection ? [detail.collection] : []);
      if (collections.some(name => ['achievements', 'achievementFiles', 'students'].includes(name))) {
        populateProfileForm();
      }
    });
  }

  /* ===== EXPORT PDF ENGINE ===== */

  /**
   * Tạo nội dung HTML cho PDF từ dữ liệu hồ sơ hiện tại.
   * Sử dụng layout tĩnh, tự chứa (không phụ thuộc CSS bên ngoài).
   */
  function buildPDFContent(data, compact) {
    // ── Color palette — màu hệ thống ────────────────────────────────────
    const PRIMARY  = '#1a3a6b';   // --color-primary
    const PRI_L    = '#2a5298';   // --color-primary-light
    const ACCENT   = '#f37021';   // --color-accent
    const BG_PRI   = '#eef2f8';   // primary tint nhạt
    const BORDER   = '#d1d9e6';   // --color-border-strong
    const TEXT     = '#0f172a';   // --color-text-strong
    const MUTED    = '#6b7280';   // --color-text-muted
    const GREEN    = '#065f46';
    const GREEN_B  = '#d1fae5';

    const esc = (v) => String(v || '—')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const now = new Date();
    const nowStr  = now.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
    const nowTime = now.toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' });
    const initials = esc(data.fullname || 'HS').split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0,2);

    // Lấy thông tin từ DOM (lớp, mã số, trường từ page subtitle)
    const subtitleEl = document.querySelector('#screen-hoSoNL .page-subtitle');
    const subtitleText = subtitleEl ? subtitleEl.textContent : '';
    const classMatch = subtitleText.match(/Lớp:\s*([^\|]+)/);
    const codeMatch  = subtitleText.match(/Mã số:\s*([^\|]+)/);
    const className  = classMatch ? classMatch[1].trim() : '7A1';
    const studentCode = data.studentCode || (codeMatch ? codeMatch[1].trim() : '—');

    // ── Helpers ──────────────────────────────────────────────────────────
    let sectionIndex = 0;
    const section = (title, content, count) => {
      sectionIndex++;
      const num = String(sectionIndex).padStart(2, '0');
      const countBadge = count != null
        ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:${ACCENT};color:#fff;font-size:10px;font-weight:700;margin-left:8px;">${count}</span>`
        : '';
      return `
      <div style="margin-bottom:28px;page-break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <span style="font-size:18px;font-weight:800;color:${ACCENT};">${num}&nbsp;/</span>
          <span style="font-size:14px;font-weight:800;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.6px;">${title}</span>
          ${countBadge}
        </div>
        <div style="height:2px;background:${ACCENT};margin-bottom:14px;width:100%;"></div>
        ${content}
      </div>`;
    };

    const bulletLines = (text) => {
      if (!text || text === '—') return `<p style="color:${MUTED};font-style:italic;font-size:11px;">Chưa có thông tin.</p>`;
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        return `<div style="display:flex;gap:7px;margin-bottom:5px;font-size:12px;color:${TEXT};line-height:1.6;">
          <span style="color:${ACCENT};font-weight:700;flex-shrink:0;">·</span><span>${esc(clean)}</span>
        </div>`;
      }).join('');
    };

    const infoGrid = (items) => `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin-bottom:12px;">
        ${items.map(([label, val]) => `
          <div>
            <div style="font-size:9.5px;color:${MUTED};margin-bottom:1px;">${label}</div>
            <div style="font-size:12px;font-weight:600;color:${TEXT};line-height:1.4;">${esc(val)}</div>
          </div>`).join('')}
      </div>`;

    const achievementCard = (title, meta, desc) => `
      <div style="border-left:3px solid ${PRIMARY};padding:10px 14px;margin-bottom:12px;background:${BG_PRI};">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:13px;font-weight:700;color:${PRIMARY};">${esc(title)}</span>
          <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;background:${GREEN_B};color:${GREEN};">✓ ĐÃ XÁC NHẬN</span>
        </div>
        <div style="font-size:10.5px;color:${MUTED};margin-bottom:5px;">${meta}</div>
        <div style="font-size:11.5px;color:${TEXT};line-height:1.55;">${esc(desc)}</div>
      </div>`;

    const gradeTable = (rows) => `
      <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
        <thead>
          <tr style="background:${BG_PRI};">
            <th style="text-align:left;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">Môn học</th>
            <th style="text-align:center;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">HK1</th>
            <th style="text-align:center;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">HK2</th>
            <th style="text-align:center;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">Cả năm</th>
            <th style="text-align:left;padding:7px 10px;font-weight:700;color:${PRIMARY};border-bottom:2px solid ${BORDER};">Xếp loại</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr style="background:${i % 2 === 0 ? '#fff' : BG_PRI};">
              <td style="padding:6px 10px;color:${TEXT};">${esc(r[0])}</td>
              <td style="padding:6px 10px;text-align:center;color:${MUTED};">${esc(r[1])}</td>
              <td style="padding:6px 10px;text-align:center;color:${MUTED};">${esc(r[2])}</td>
              <td style="padding:6px 10px;text-align:center;font-weight:700;color:${PRIMARY};">${esc(r[3])}</td>
              <td style="padding:6px 10px;color:${TEXT};">${esc(r[4])}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    const timelineItem = (date, type, title, desc) => `
      <div style="display:flex;gap:14px;margin-bottom:16px;">
        <div style="text-align:right;min-width:44px;flex-shrink:0;">
          <div style="font-size:13px;font-weight:700;color:${TEXT};">${esc(date.split('/')[0]+'/'+date.split('/')[1])}</div>
          <div style="font-size:10px;color:${MUTED};">${esc(date.split('/')[2] || '')}</div>
        </div>
        <div style="position:relative;padding-left:18px;border-left:2px solid ${BORDER};">
          <div style="position:absolute;left:-6px;top:4px;width:10px;height:10px;border-radius:50%;background:${PRIMARY};border:2px solid #fff;"></div>
          <div style="font-size:9px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;">${esc(type)}</div>
          <div style="font-size:12px;font-weight:700;color:${TEXT};line-height:1.4;">${esc(title)}</div>
          ${desc ? `<div style="font-size:11px;color:${MUTED};margin-top:2px;">${esc(desc)}</div>` : ''}
        </div>
      </div>`;

    const hobbyTags = (text) => {
      if (!text || text === '—') return '';
      return text.split(/[,，、]/).map(t => t.trim()).filter(Boolean).map(t =>
        `<span style="display:inline-block;padding:3px 10px;border-radius:4px;background:${BG_PRI};color:${PRIMARY};font-size:11px;margin:2px 3px;">${esc(t)}</span>`
      ).join('');
    };

    // ── Parse bullet text into achievement cards ──────────────────────
    const parseAchievements = (text) => {
      if (!text) return '';
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        const parts = clean.split(/[.。]/);
        const title = parts[0].trim();
        const desc  = parts.slice(1).join('.').trim();
        return achievementCard(title, '· Hồ sơ năng lực', desc || title);
      }).join('');
    };

    const parseActivities = (text) => {
      if (!text) return '';
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        return `<div style="border-left:3px solid ${ACCENT};padding:8px 12px;margin-bottom:10px;background:${BG_PRI};">
          <div style="font-size:13px;font-weight:700;color:${PRIMARY};">${esc(clean)}</div>
          <div style="font-size:10.5px;color:${MUTED};margin-top:3px;">Club · Năm học 2025–2026</div>
        </div>`;
      }).join('');
    };

    const parseCertificates = (text) => {
      if (!text) return '';
      return text.split('\n').map(line => {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (!clean) return '';
        return `<div style="border-left:3px solid ${MUTED};padding:8px 12px;margin-bottom:10px;background:#f9fafb;">
          <div style="font-size:13px;font-weight:700;color:${PRIMARY};">${esc(clean)}</div>
        </div>`;
      }).join('');
    };

    // ── Grade rows mock (sẽ thay bằng data thực khi có) ─────────────
    const gradeRows = [
      ['Toán học',           '—', '—', data.study ? data.study.match(/Toán\s*\(([^)]+)\)/)?.[1] || '—' : '—', '—'],
      ['Ngữ văn',            '—', '—', '—', '—'],
      ['Tiếng Anh',          '—', '—', data.study ? data.study.match(/Tiếng Anh\s*\(([^)]+)\)/)?.[1] || '—' : '—', '—'],
      ['Khoa học tự nhiên',  '—', '—', data.study ? data.study.match(/KHTN\s*\(([^)]+)\)/)?.[1] || '—' : '—', '—'],
    ];

    // ── Build timeline from roadmap text ──────────────────────────────
    const buildTimeline = (roadmap, achievement, goalShort) => {
      const items = [];
      if (roadmap) {
        roadmap.split('\n').forEach(line => {
          const clean = line.replace(/^[-•]\s*/, '').trim();
          if (!clean) return;
          const yearMatch = clean.match(/(\d{4})/);
          const year = yearMatch ? yearMatch[1] : '2026';
          items.push(timelineItem(`01/01/${year}`, 'Lộ trình · Cột mốc', clean, ''));
        });
      }
      if (goalShort) items.push(timelineItem(`01/01/2026`, 'Mục tiêu · Ngắn hạn', goalShort, ''));
      return items.join('');
    };

    // ── Count bullets ─────────────────────────────────────────────────
    const countLines = (text) => text ? text.split('\n').filter(l => l.trim()).length : 0;

    // ── Intro section content ─────────────────────────────────────────
    const introHTML = `
      <p style="font-size:12px;color:${TEXT};line-height:1.7;margin-bottom:10px;">${esc(data.studyMethod || '')}</p>
      <p style="font-size:11.5px;margin-bottom:3px;"><strong style="color:${PRIMARY};">Mục tiêu ngắn hạn:</strong> ${esc(data.goalShort)}</p>
      <p style="font-size:11.5px;margin-bottom:3px;"><strong style="color:${PRIMARY};">Mục tiêu trung hạn:</strong> ${esc(data.goalMedium)}</p>
      <p style="font-size:11.5px;margin-bottom:8px;"><strong style="color:${PRIMARY};">Mục tiêu dài hạn:</strong> ${esc(data.goalLong)}</p>
      <p style="font-size:11.5px;margin-bottom:4px;"><strong style="color:${PRIMARY};">Sở thích:</strong></p>
      <div>${hobbyTags(data.hobby)}</div>`;

    // ── Full layout ───────────────────────────────────────────────────
    sectionIndex = 0;
    const body = `
      ${section('GIỚI THIỆU', introHTML)}
      ${section('THÀNH TÍCH', parseAchievements(data.achievement), countLines(data.achievement))}
      ${section('HOẠT ĐỘNG', parseActivities(data.activity), countLines(data.activity))}
      ${section('CHỨNG CHỈ', parseCertificates(data.certificate), countLines(data.certificate))}
      ${section('KẾT QUẢ HỌC TẬP', gradeTable(gradeRows), gradeRows.length)}
      ${section('DÒNG THỜI GIAN', buildTimeline(data.roadmap, data.achievement, data.goalShort), countLines(data.roadmap))}
    `;

    return `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;background:#fff;color:${TEXT};">

        <!-- HEADER -->
        <div style="background:${PRIMARY};padding:28px 36px 22px;margin-bottom:0;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
            <div style="font-size:9px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:1.5px;">Hệ Thống Đào Tạo · Smart Portfolio</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.7);">Xuất ngày ${nowStr}</div>
          </div>
          <div style="font-size:32px;font-weight:800;color:#fff;line-height:1.15;margin:10px 0 6px;">${esc(data.fullname || 'Học sinh')}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.85);">
            Mã HS: ${esc(studentCode)} &nbsp;·&nbsp; Lớp: ${esc(className)} &nbsp;·&nbsp; Năm học: 2025–2026
          </div>
        </div>

        <!-- QUOTE -->
        <div style="padding:16px 36px;border-bottom:1px solid ${BORDER};">
          <p style="font-style:italic;color:${MUTED};font-size:12px;margin:0;">"${esc(data.hobby ? 'Mỗi ngày cố gắng hơn ngày hôm qua.' : 'Mỗi ngày cố gắng hơn ngày hôm qua.')}"</p>
        </div>

        <!-- BODY -->
        <div style="padding:24px 36px 32px;">
          ${body}
        </div>

        <!-- FOOTER -->
        <div style="border-top:1px solid ${BORDER};padding:8px 36px;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:9px;color:${MUTED};">Hệ Thống Đào Tạo — Smart Portfolio</div>
          <div style="font-size:9px;color:${MUTED};">Xuất ${nowStr} ${nowTime} (GMT+7)</div>
          <div style="font-size:9px;color:${MUTED};">Trang 1</div>
        </div>

      </div>`;
  }

  function setPDFLoading(visible, desc, pct) {
    const overlay = document.getElementById('pdfLoadingOverlay');
    const descEl  = document.getElementById('pdfLoadingDesc');
    const bar     = document.getElementById('pdfLoadingBar');
    if (!overlay) return;
    if (visible) {
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
    } else {
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
    }
    if (desc && descEl)  descEl.textContent = desc;
    if (bar != null && pct !== undefined) bar.style.width = pct + '%';
  }

  async function runExportPDF(compact) {
    const btn = document.getElementById('exportPdfBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xuất…'; }

    setPDFLoading(true, 'Chuẩn bị nội dung hồ sơ…', 10);

    try {
      const data     = loadProfileData();
      const content  = buildPDFContent(data, compact);
      const safeName = (data.fullname || 'HocSinh').replace(/\s+/g, '_');
      const suffix   = compact ? '_TomTat' : '_DayDu';
      const filename = `HoSoNangLuc_${safeName}${suffix}`;

      setPDFLoading(true, 'Đang mở cửa sổ xuất…', 50);

      // Wrap nội dung thành trang HTML hoàn chỉnh có @media print
      const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${filename}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, 'Segoe UI', sans-serif; background: #fff; }
    @media print {
      @page { size: A4 portrait; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>${content}</body>
</html>`;

      setPDFLoading(true, 'Đang tạo tệp…', 70);

      // Mở popup để print → Save as PDF
      const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
      if (!win) {
        // Popup bị chặn — fallback: tải về HTML
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = filename + '.html';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        window.SPMSToast?.show('info', 'Lưu ý', 'Popup bị chặn. Đã tải file HTML — mở bằng Chrome và dùng Ctrl+P để lưu PDF.', 5000);
        return;
      }

      win.document.open();
      win.document.write(fullHtml);
      win.document.close();

      // Chờ ảnh/font load xong rồi tự mở print dialog
      win.onload = () => {
        setTimeout(() => {
          win.focus();
          win.print();
        }, 400);
      };

      setPDFLoading(true, 'Hoàn tất!', 100);
      await new Promise(r => setTimeout(r, 800));
      window.SPMSToast?.show('success', 'Xuất hồ sơ', 'Cửa sổ in đã mở. Chọn "Save as PDF" để lưu.', 4000);

      return true;
    } catch (err) {
      console.error('[PDF Export]', err);
      window.SPMSToast?.show('error', 'Lỗi xuất hồ sơ', 'Không thể tạo tệp. Vui lòng thử lại.', 3500);
      return false;
    } finally {
      setPDFLoading(false);
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-pdf"></i> Xuất PDF'; }
    }
  }

  function exportProfilePDF()        { return runExportPDF(false); }
  function exportProfilePDFCompact() { return runExportPDF(true);  }

  /* ===== SHARE ENGINE ===== */

  const SHARE_BASE = window.location.origin + window.location.pathname;
  const SHARE_HISTORY_KEY = 'spms_student_portfolio_share_history';
  const SHARE_RECORD_KEY  = 'spms_portfolio_share_records';
  let selectedShareMethod = '';

  function getSessionUser() {
    try { return JSON.parse(sessionStorage.getItem('spms_user')); } catch { return null; }
  }

  function normalizeIdentity(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isOwnStudentPortfolio(user, data) {
    const roleKey = String(user?.roleKey || '').toLowerCase();
    if (roleKey !== 'student') return false;
    const accountCode = String(user?.studentCode || user?.username || '').toUpperCase();
    const profileCode = String(data?.studentCode || '').toUpperCase();
    if (accountCode && profileCode && accountCode === profileCode) return true;
    return !!user?.name && normalizeIdentity(user.name) === normalizeIdentity(data?.fullname);
  }

  function createShareToken() {
    if (global.crypto?.getRandomValues) {
      const bytes = new Uint8Array(18);
      global.crypto.getRandomValues(bytes);
      return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  }

  function appendLocalRecord(key, record) {
    let records = [];
    try { records = JSON.parse(localStorage.getItem(key)) || []; } catch {}
    records.unshift(record);
    localStorage.setItem(key, JSON.stringify(records.slice(0, 100)));
  }

  function ensureShareFlowUI() {
    const modal = document.getElementById('shareProfileModal');
    const body = modal?.querySelector('.share-modal__body');
    const footer = modal?.querySelector('.share-modal__footer');
    if (!body || body.dataset.uc53Ready === 'true') return;
    body.dataset.uc53Ready = 'true';
    body.innerHTML = `
      <p style="font-size:13.5px;color:#374151;margin:0 0 16px;">Chọn một hình thức chia sẻ hồ sơ năng lực:</p>
      <label class="share-method-card" id="studentSharePdfCard" style="display:flex;gap:14px;padding:15px 16px;border:2px solid #e5e7eb;border-radius:10px;cursor:pointer;margin-bottom:10px;">
        <input type="radio" name="studentShareMethod" value="pdf" style="margin-top:3px;accent-color:#1e3a8a;">
        <span><strong style="display:block;font-size:14px;color:#111827;"><i class="fas fa-file-pdf" style="color:#ef4444;margin-right:7px;"></i>Xuất PDF</strong>
        <small style="display:block;color:#6b7280;margin-top:4px;line-height:1.5;">Tạo bản PDF trực quan từ dữ liệu đã lưu trong hồ sơ.</small></span>
      </label>
      <label class="share-method-card" id="studentShareLinkCard" style="display:flex;gap:14px;padding:15px 16px;border:2px solid #e5e7eb;border-radius:10px;cursor:pointer;margin-bottom:16px;">
        <input type="radio" name="studentShareMethod" value="link" style="margin-top:3px;accent-color:#1e3a8a;">
        <span><strong style="display:block;font-size:14px;color:#111827;"><i class="fas fa-link" style="color:#1e3a8a;margin-right:7px;"></i>Tạo liên kết chia sẻ</strong>
        <small style="display:block;color:#6b7280;margin-top:4px;line-height:1.5;">Sinh liên kết duy nhất, chỉ truy cập theo chính sách của hệ thống.</small></span>
      </label>
      <div id="studentShareResult" style="display:none;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:9px;padding:12px 14px;margin-bottom:12px;">
        <div style="font-size:12.5px;font-weight:700;color:#047857;margin-bottom:7px;"><i class="fas fa-check-circle"></i> Chia sẻ thành công</div>
        <div style="display:flex;gap:8px;"><input id="studentShareLinkInput" readonly style="min-width:0;flex:1;border:1px solid #a7f3d0;border-radius:7px;padding:8px 10px;background:#fff;color:#065f46;">
        <button type="button" class="btn btn-primary btn-sm" onclick="copyConfirmedShareLink()"><i class="fas fa-copy"></i> Sao chép</button></div>
      </div>
      <div id="studentShareError" role="alert" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:9px;padding:11px 14px;color:#b91c1c;font-size:12.5px;"></div>
      <div style="margin-top:14px;padding:10px 12px;background:#f8fafc;border-radius:8px;color:#64748b;font-size:11.5px;line-height:1.55;"><i class="fas fa-shield-alt" style="color:#059669;margin-right:5px;"></i>Chỉ dữ liệu đã lưu và được lựa chọn trong hồ sơ mới xuất hiện trong bản chia sẻ.</div>`;
    body.querySelector('#studentSharePdfCard')?.remove();
    const linkCard = body.querySelector('#studentShareLinkCard');
    linkCard?.querySelector('input')?.remove();
    if (linkCard) {
      linkCard.style.cursor = 'default';
      linkCard.style.borderColor = '#bfdbfe';
      linkCard.style.background = '#eff6ff';
    }
    const intro = body.querySelector('p');
    if (intro) intro.textContent = 'Tạo một liên kết duy nhất để chia sẻ hồ sơ năng lực ở chế độ chỉ đọc.';
    footer.innerHTML = `
      <span class="share-modal__footer-note"><i class="fas fa-lock" style="margin-right:4px;color:var(--color-success);"></i>Dữ liệu được bảo vệ theo phân quyền hệ thống.</span>
      <div style="display:flex;gap:9px;">
        <button class="btn btn-ghost btn-sm" type="button" onclick="closeShareModal()">Hủy</button>
        <button class="btn btn-primary btn-sm" id="studentShareConfirmBtn" type="button" onclick="confirmStudentPortfolioShare()"><i class="fas fa-link"></i> Tạo liên kết</button>
      </div>`;
    body.querySelectorAll('input[name="studentShareMethod"]').forEach(input => {
      input.addEventListener('change', () => {
        selectedShareMethod = input.value;
        body.querySelectorAll('.share-method-card').forEach(card => {
          const checked = card.querySelector('input')?.checked;
          card.style.borderColor = checked ? '#1e3a8a' : '#e5e7eb';
          card.style.background = checked ? '#eff6ff' : '#fff';
        });
        document.getElementById('studentShareResult').style.display = 'none';
        document.getElementById('studentShareError').style.display = 'none';
      });
    });
  }

  function buildShareURL() {
    const data      = loadProfileData();
    const isPublic  = document.getElementById('sharePublicToggle')?.checked ?? true;
    const hasExpiry = document.getElementById('shareExpiryToggle')?.checked ?? false;
    const params    = new URLSearchParams({
      view:    'hoSoNL',
      student: data.studentCode || 'HS101001',
      name:    data.fullname    || 'Nguyen Van Hoanh Anh',
      pub:     isPublic  ? '1' : '0',
    });
    if (hasExpiry) {
      const exp = new Date();
      exp.setDate(exp.getDate() + 7);
      params.set('exp', exp.toISOString().slice(0, 10));
    }
    return `${SHARE_BASE}?${params.toString()}`;
  }

  function initShareLink() {
    // Precompute QR khi module khởi động (tạo thêm tốc độ khi mở modal)
  }

  function refreshShareLink() {
    const url = buildShareURL();
    const el  = document.getElementById('shareLinkUrl');
    if (el) el.textContent = url;
    generateQRCode(url);
  }

  async function generateQRCode(url) {
    const canvas = document.getElementById('shareQrCanvas');
    if (!canvas) return;

    // Dùng QR bằng Google Charts API (không cần thư viện thêm)
    const size     = 140;
    const apiUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=FFFFFF&color=1a3a6b&margin=4`;
    const frame    = document.getElementById('shareQrFrame');
    if (!frame) return;

    // Thay canvas bằng img từ API (đơn giản và đáng tin cậy hơn)
    let img = frame.querySelector('img.qr-img');
    if (!img) {
      img = document.createElement('img');
      img.className   = 'qr-img';
      img.alt         = 'QR Code hồ sơ năng lực';
      img.style.cssText = 'width:140px;height:140px;border-radius:8px;display:block;';
      frame.innerHTML = '';
      frame.appendChild(img);
    }
    img.src = apiUrl;
  }

  function openShareModal() {
    const modal = document.getElementById('shareProfileModal');
    if (!modal) return;

    // Cập nhật tên học sinh trong modal
    const data = loadProfileData();
    const user = getSessionUser();
    if (!user) {
      window.SPMSToast?.show('error', 'Không thể chia sẻ', 'Bạn cần đăng nhập để chia sẻ hồ sơ năng lực.', 3200);
      return;
    }
    if (!isOwnStudentPortfolio(user, data)) {
      window.SPMSToast?.show('error', 'Không có quyền chia sẻ', 'Học sinh chỉ được chia sẻ hồ sơ năng lực của chính mình.', 3500);
      return;
    }
    if (profileEditMode) {
      window.SPMSToast?.show('warning', 'Hồ sơ chưa sẵn sàng', 'Hãy lưu hoặc hủy các thay đổi trước khi chia sẻ.', 3500);
      return;
    }
    ensureShareFlowUI();
    const token = createShareToken();
    const createdAt = new Date().toISOString();
    const shareRecord = {
      token, ownerId: data.studentCode, ownerName: data.fullname, type: 'link',
      policy: { access: 'unique-token', readOnly: true }, snapshot: { ...data }, createdAt, revoked: false,
    };
    const shareUrl = new URL('portfolio-share.html', window.location.href);
    shareUrl.searchParams.set('token', token);
    const payloadBytes = new TextEncoder().encode(JSON.stringify(shareRecord));
    const payload = btoa(Array.from(payloadBytes, byte => String.fromCharCode(byte)).join(''))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    shareUrl.searchParams.set('data', payload);
    const artifact = shareUrl.href;
    appendLocalRecord(SHARE_RECORD_KEY, { ...shareRecord, url: artifact });
    appendLocalRecord(SHARE_HISTORY_KEY, {
      id: `share_${Date.now()}_${token.slice(0, 8)}`, ownerId: data.studentCode,
      ownerName: data.fullname, type: 'link', artifact, sharedBy: data.studentCode,
      actorRole: 'student', createdAt, durationMs: 0, status: 'success',
    });
    const body = modal.querySelector('.share-modal__body');
    const footer = modal.querySelector('.share-modal__footer');
    if (body) body.innerHTML = `
      <div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:10px;padding:14px 16px;">
        <div style="font-size:12.5px;font-weight:700;color:#1e3a8a;margin-bottom:8px;"><i class="fas fa-check-circle" style="color:#059669;margin-right:5px;"></i>Liên kết chia sẻ</div>
        <div style="display:flex;gap:8px;align-items:center;">
          <input id="studentShareLinkInput" value="${artifact.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" readonly style="min-width:0;flex:1;border:1px solid #bfdbfe;border-radius:7px;padding:9px 10px;background:#fff;color:#1e3a8a;outline:none;">
          <button type="button" class="btn btn-primary btn-sm" onclick="copyConfirmedShareLink()"><i class="fas fa-copy"></i> Sao chép</button>
        </div>
      </div>`;
    if (footer) footer.innerHTML = `
      <button class="btn btn-primary btn-sm" type="button" onclick="closeShareModal()">Đóng</button>`;
    const nameEl = document.getElementById('shareStudentName');
    if (nameEl) nameEl.textContent = data.fullname || 'Học Sinh';

    // Cập nhật link & QR
    const url = buildShareURL();
    const el  = document.getElementById('shareLinkUrl');
    if (el) el.textContent = url;
    generateQRCode(url);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  async function confirmStudentPortfolioShare() {
    const btn = document.getElementById('studentShareConfirmBtn');
    const errorBox = document.getElementById('studentShareError');
    const resultBox = document.getElementById('studentShareResult');
    if (!selectedShareMethod) {
      if (errorBox) { errorBox.textContent = 'Vui lòng chọn “Xuất PDF” hoặc “Tạo liên kết chia sẻ”.'; errorBox.style.display = 'block'; }
      return;
    }
    const data = loadProfileData();
    const user = getSessionUser();
    if (!user || !isOwnStudentPortfolio(user, data)) {
      if (errorBox) { errorBox.textContent = 'Phiên đăng nhập không có quyền chia sẻ hồ sơ năng lực này.'; errorBox.style.display = 'block'; }
      return;
    }
    if (profileEditMode || !data.studentCode) {
      if (errorBox) { errorBox.textContent = 'Hồ sơ chưa được lưu thành công hoặc chưa sẵn sàng để chia sẻ.'; errorBox.style.display = 'block'; }
      return;
    }
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý…'; }
    if (errorBox) errorBox.style.display = 'none';
    const startedAt = Date.now();
    try {
      let artifact = '';
      if (selectedShareMethod === 'pdf') {
        const ok = await Promise.race([
          exportProfilePDF(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000)),
        ]);
        if (!ok) throw new Error('PDF_FAILED');
        artifact = `HoSoNangLuc_${String(data.fullname || 'HocSinh').replace(/\s+/g, '_')}_DayDu.pdf`;
      } else {
        const token = createShareToken();
        const base = new URL('portfolio-share.html', window.location.href);
        base.searchParams.set('token', token);
        artifact = base.href;
        appendLocalRecord(SHARE_RECORD_KEY, {
          token, ownerId: data.studentCode, type: 'link', url: artifact,
          policy: { access: 'unique-token', readOnly: true },
          snapshot: { ...data }, createdAt: new Date().toISOString(), revoked: false,
        });
        const input = document.getElementById('studentShareLinkInput');
        if (input) input.value = artifact;
        if (resultBox) resultBox.style.display = 'block';
      }
      appendLocalRecord(SHARE_HISTORY_KEY, {
        id: `share_${Date.now()}_${createShareToken().slice(0, 8)}`,
        ownerId: data.studentCode, ownerName: data.fullname,
        type: selectedShareMethod, artifact, sharedBy: data.studentCode,
        actorRole: 'student', createdAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt, status: 'success',
      });
      window.SPMSToast?.show('success', 'Chia sẻ hồ sơ thành công', selectedShareMethod === 'pdf'
        ? 'Cửa sổ xuất PDF đã mở và lịch sử chia sẻ đã được ghi nhận.'
        : 'Liên kết duy nhất đã được tạo và lịch sử chia sẻ đã được ghi nhận.', 4000);
    } catch (error) {
      console.error('[UC-5.3 Share]', error);
      if (errorBox) {
        errorBox.textContent = error?.message === 'TIMEOUT'
          ? 'Quá thời gian tạo dữ liệu chia sẻ (05 giây). Vui lòng thực hiện lại.'
          : 'Không thể tạo tệp PDF hoặc liên kết chia sẻ. Vui lòng thực hiện lại.';
        errorBox.style.display = 'block';
      }
      window.SPMSToast?.show('error', 'Chia sẻ không thành công', 'Vui lòng kiểm tra và thực hiện lại thao tác.', 3500);
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-link"></i> Tạo liên kết'; }
    }
  }

  function copyConfirmedShareLink() {
    const input = document.getElementById('studentShareLinkInput');
    if (!input?.value) return;
    const done = () => window.SPMSToast?.show('success', 'Đã sao chép', 'Liên kết chia sẻ đã được sao chép.', 2200);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(input.value).then(done).catch(() => {
      input.select(); document.execCommand('copy'); done();
    });
    else { input.select(); document.execCommand('copy'); done(); }
  }

  function closeShareModal() {
    const modal = document.getElementById('shareProfileModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function copyShareLink() {
    const url = buildShareURL();
    const btn = document.getElementById('copyLinkBtn');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopyBtnSuccess(btn);
      }).catch(() => fallbackCopy(url, btn));
    } else {
      fallbackCopy(url, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); setCopyBtnSuccess(btn); } catch {}
    document.body.removeChild(ta);
  }

  function setCopyBtnSuccess(btn) {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Đã sao chép';
    btn.classList.add('share-link-copy-btn--success');
    window.SPMSToast?.show('success', 'Sao chép', 'Đã sao chép liên kết chia sẻ.', 2200);
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.classList.remove('share-link-copy-btn--success');
    }, 2200);
  }

  function shareViaEmail() {
    const data    = loadProfileData();
    const url     = buildShareURL();
    const subject = encodeURIComponent(`Hồ sơ năng lực: ${data.fullname || 'Học sinh'}`);
    const body    = encodeURIComponent(
      `Xin chào,\n\nTôi muốn chia sẻ hồ sơ năng lực cá nhân.\n\nXem hồ sơ tại: ${url}\n\nTrân trọng,\n${data.fullname || ''}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    window.SPMSToast?.show('success', 'Chia sẻ thành công', 'Đã mở ứng dụng email với liên kết hồ sơ.', 2400);
  }

  function shareViaZalo() {
    const url = encodeURIComponent(buildShareURL());
    // Zalo Share API (open in new tab)
    window.open(`https://zalo.me/share/url?url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=500');
    window.SPMSToast?.show('success', 'Chia sẻ thành công', 'Đã mở cửa sổ chia sẻ qua Zalo.', 2400);
  }

  function shareViaFacebook() {
    const url = encodeURIComponent(buildShareURL());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer,width=600,height=500');
    window.SPMSToast?.show('success', 'Chia sẻ thành công', 'Đã mở cửa sổ chia sẻ qua Facebook.', 2400);
  }

  async function shareViaNative() {
    const data = loadProfileData();
    const url  = buildShareURL();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hồ Sơ Năng Lực — ${data.fullname || 'Học Sinh'}`,
          text:  `Xem hồ sơ năng lực của ${data.fullname || 'học sinh'} tại đây:`,
          url,
        });
        window.SPMSToast?.show('success', 'Chia sẻ thành công', 'Hồ sơ đã được chia sẻ.', 2400);
      } catch (err) {
        if (err.name !== 'AbortError') {
          window.SPMSToast?.show('info', 'Chia sẻ', 'Không thể mở hộp thoại chia sẻ.', 2500);
        }
      }
    } else {
      copyShareLink();
    }
  }

  function downloadQRCode() {
    const frame = document.getElementById('shareQrFrame');
    if (!frame) return;
    const img = frame.querySelector('img.qr-img');
    if (!img || !img.src) return;

    // Tải ảnh QR qua fetch để không bị chặn bởi CORS
    fetch(img.src)
      .then(r => r.blob())
      .then(blob => {
        const a    = document.createElement('a');
        a.href     = URL.createObjectURL(blob);
        a.download = 'QR_HoSoNangLuc.png';
        a.click();
        URL.revokeObjectURL(a.href);
        window.SPMSToast?.show('success', 'Tải QR', 'Đã tải mã QR về thiết bị.', 2200);
      })
      .catch(() => {
        window.SPMSToast?.show('info', 'QR', 'Nhấn chuột phải vào ảnh QR và chọn "Lưu ảnh".', 3000);
      });
  }

  // Expose module API
  global.StudentHoSoNLModule = {
    init,
    openProfileHistoryModal,
    closeProfileHistoryModal,
  };

  /* ===== PROOF FILE VIEWER ===== */

  /**
   * Metadata map for demo proof files.
   * In a real system this would come from the server.
   */
  const PROOF_FILE_META = {
    'Bang_Diem_Tong_Ket_2026_2027_Lop_7A1.pdf': {
      type: 'pdf',
      section: 'Học tập & Kết quả năm học',
      issuedBy: 'Trường THCS Nguyễn Văn Cừ',
      issuedDate: '31 / 05 / 2027',
      size: '264 KB',
      desc: 'Bảng điểm tổng kết năm học 2026 – 2027 của học sinh Nguyễn Văn Hoàng Anh, lớp 7A1.',
    },
    'Bang_Khen_Hoc_Sinh_Gioi_Xuat_Sac_Khoi_7.pdf': {
      type: 'pdf',
      section: 'Thành tích & Giải thưởng',
      issuedBy: 'Trường THCS Nguyễn Văn Cừ',
      issuedDate: '15 / 01 / 2026',
      size: '238 KB',
      desc: 'Bằng khen xác nhận danh hiệu Học sinh Giỏi xuất sắc khối 7.',
    },
    'Giay_Chung_Nhan_Tin_Hoc_Tre_2025.pdf': {
      type: 'pdf',
      section: 'Thành tích & Giải thưởng',
      issuedBy: 'Sở GD&ĐT Thành phố Đà Nẵng',
      issuedDate: '15 / 08 / 2025',
      size: '245 KB',
      desc: 'Giấy chứng nhận Giải Nhất cuộc thi Tin học trẻ cấp Thành phố năm 2025.',
    },
    'Minh_chung_hoat_dong.pdf': {
      type: 'pdf',
      section: 'Hoạt động ngoại khóa',
      issuedBy: 'Trường THCS Nguyễn Văn Cừ',
      issuedDate: '20 / 06 / 2025',
      size: '182 KB',
      desc: 'Xác nhận tham gia CLB STEM và chương trình tình nguyện "Áo ấm cho em 2025".',
    },
    'Chung_Chi_Cambridge_B1_NguyenVanHoangAnh.pdf': {
      type: 'pdf',
      section: 'Chứng chỉ học thuật',
      issuedBy: 'Cambridge Assessment English',
      issuedDate: '10 / 03 / 2025',
      size: '310 KB',
      desc: 'Cambridge B1 Preliminary — Merit. Kết quả: Reading 75%, Writing 78%, Listening 80%, Speaking 82%.',
    },
    'Python_Certificate_Basic.jpg': {
      type: 'img',
      section: 'Chứng chỉ kỹ năng',
      issuedBy: 'EduPortal Online Learning',
      issuedDate: '05 / 11 / 2024',
      size: '124 KB',
      desc: 'Hoàn thành khóa học Lập trình Python cơ bản — 24 giờ học, đạt điểm 92/100.',
    },
    'Bang_Diem_Chi_Tiet_HK1_Lop7.pdf': {
      type: 'pdf',
      section: 'Kết quả học tập',
      issuedBy: 'Trường THCS Nguyễn Văn Cừ',
      issuedDate: '15 / 01 / 2026',
      size: '198 KB',
      desc: 'Bảng điểm chi tiết học kỳ I lớp 7 — ĐTB 9.1, Hạnh kiểm Tốt.',
    },
  };

  /**
   * Open the proof file viewer modal for a given filename.
   * @param {string} fileName - tên file hiển thị trong .file-chip__name
   * @param {HTMLElement} [triggerEl] - element kích hoạt (để trả focus về sau khi đóng)
   */
  function openProofFile(fileName, triggerEl) {
    const overlay = document.getElementById('proofModalOverlay');
    if (!overlay) return;

    const meta = PROOF_FILE_META[fileName] || {
      type: 'file',
      section: 'Hồ sơ năng lực',
      issuedBy: '—',
      issuedDate: '—',
      size: '—',
      desc: 'Không có mô tả cho tệp này.',
    };

    // Icon
    const iconEl = overlay.querySelector('.proof-modal__icon');
    iconEl.className = 'proof-modal__icon';
    if (meta.type === 'pdf') {
      iconEl.classList.add('proof-modal__icon--pdf');
      iconEl.innerHTML = '<i class="fas fa-file-pdf"></i>';
    } else if (meta.type === 'img') {
      iconEl.classList.add('proof-modal__icon--img');
      iconEl.innerHTML = '<i class="fas fa-image"></i>';
    } else {
      iconEl.classList.add('proof-modal__icon--file');
      iconEl.innerHTML = '<i class="fas fa-file-alt"></i>';
    }

    // Title & meta
    overlay.querySelector('.proof-modal__title').textContent = fileName;
    overlay.querySelector('#proofMetaSection').textContent   = meta.section;
    overlay.querySelector('#proofMetaIssuer').textContent    = meta.issuedBy;
    overlay.querySelector('#proofMetaDate').textContent      = meta.issuedDate;
    overlay.querySelector('#proofMetaSize').textContent      = meta.size;
    overlay.querySelector('#proofMetaDesc').textContent      = meta.desc;

    // Store trigger for focus-return on close
    overlay._triggerEl = triggerEl || null;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    setTimeout(() => overlay.querySelector('.proof-modal__close')?.focus(), 60);
  }

  function closeProofModal() {
    const overlay = document.getElementById('proofModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Return focus to trigger
    if (overlay._triggerEl) {
      overlay._triggerEl.focus();
      overlay._triggerEl = null;
    }
  }

  // Expose module API
  global.StudentHoSoNLModule = {
    init,
    openProfileHistoryModal,
    closeProfileHistoryModal,
  };

  // Expose globals for inline HTML onclick attributes
  global.toggleProfileEdit        = toggleProfileEdit;
  global.cancelProfileEdit        = cancelProfileEdit;
  global.saveProfile              = saveProfile;
  global.resetProfile             = resetProfile;
  global.openProfileHistoryModal  = openProfileHistoryModal;
  global.closeProfileHistoryModal = closeProfileHistoryModal;
  global.clearProfileHistory      = clearProfileHistory;
  global.showSystemInfo           = showSystemInfo;

  // PDF & Share
  global.exportProfilePDF         = exportProfilePDF;
  global.exportProfilePDFCompact  = exportProfilePDFCompact;
  global.openShareModal           = openShareModal;
  global.closeShareModal          = closeShareModal;
  global.confirmStudentPortfolioShare = confirmStudentPortfolioShare;
  global.copyConfirmedShareLink   = copyConfirmedShareLink;
  global.copyShareLink            = copyShareLink;
  global.refreshShareLink         = refreshShareLink;
  global.shareViaEmail            = shareViaEmail;
  global.shareViaZalo             = shareViaZalo;
  global.shareViaFacebook         = shareViaFacebook;
  global.shareViaNative           = shareViaNative;
  global.downloadQRCode           = downloadQRCode;

  // Proof file viewer
  global.openProofFile            = openProofFile;
  global.closeProofModal          = closeProofModal;

})(window);
