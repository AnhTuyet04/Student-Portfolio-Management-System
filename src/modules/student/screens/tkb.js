/**
 * tkb.js
 * Screen module: Thời Khóa Biểu
 * Renders timetable grid from data and manages the slide-over subject detail panel.
 */

(function (global) {
  'use strict';

  /* ── Period time definitions ── */
  const PERIOD_TIMES = {
    1: { start: '07:00', end: '07:45', label: 'Tiết 1' },
    2: { start: '07:50', end: '08:35', label: 'Tiết 2' },
    3: { start: '08:45', end: '09:30', label: 'Tiết 3' },
    4: { start: '09:40', end: '10:25', label: 'Tiết 4' },
    5: { start: '10:35', end: '11:20', label: 'Tiết 5' },
    6: { start: '13:30', end: '14:15', label: 'Tiết 6' },
    7: { start: '14:20', end: '15:05', label: 'Tiết 7' },
    8: { start: '15:15', end: '16:00', label: 'Tiết 8' },
    9: { start: '16:05', end: '16:50', label: 'Tiết 9' },
  };

  /*
    Slot structure:
    {
      name, teacher, room, roomIcon,
      color,       // CSS class: subj--blue | subj--green | ...
      accentColor, // hex for stripe & icon background
      iconColor,   // hex for icon text
      icon,        // FA icon class
      periods,     // array of period numbers e.g. [1, 2]
      note,        // optional note string
      desc,        // optional subject description
    }
  */
  const TKB_DATA = {
    2: {
      morning: [
        {
          name: 'Chào Cờ Đầu Tuần', teacher: 'BGH & Đoàn trường',
          room: 'Sân trường', roomIcon: 'fas fa-flag',
          color: 'subj--yellow', accentColor: '#FEF3C7', iconColor: '#92400E',
          icon: 'fas fa-flag', periods: [1],
          desc: 'Hoạt động chào cờ định kỳ đầu tuần. Học sinh tập trung đúng giờ, mặc đồng phục chỉnh tề.',
          note: 'Học sinh tập hợp trước 06:55. Đồng phục áo dài trắng (nữ) hoặc sơ mi trắng (nam).',
        },
        {
          name: 'Toán Đại Số', teacher: 'Thầy Nguyễn Đạo',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--green', accentColor: '#DCFCE7', iconColor: '#047857',
          icon: 'fas fa-square-root-alt', periods: [2, 3, 4],
          desc: 'Chương trình Toán Đại Số lớp 7. Nội dung học kỳ I: Số hữu tỉ, biểu thức đại số, đa thức một biến.',
          note: 'Tiết 2 đến Tiết 4. Mang đủ sách giáo khoa và vở bài tập Toán.',
        },
        {
          name: 'Tin Học Ứng Dụng', teacher: 'Thầy Lê Duy Minh',
          room: 'Phòng Máy Tính 2', roomIcon: 'fas fa-desktop',
          color: 'subj--indigo', accentColor: '#EEF2FF', iconColor: '#4338CA',
          icon: 'fas fa-laptop-code', periods: [6, 7],
          desc: 'Tin học ứng dụng lớp 7. Học kỳ I: Soạn thảo văn bản Word, bảng tính Excel cơ bản.',
        },
      ],
    },
    3: {
      morning: [
        {
          name: 'Ngữ Văn', teacher: 'Cô Phan Ngọc Chi',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--blue', accentColor: '#DBEAFE', iconColor: '#1D4ED8',
          icon: 'fas fa-book-open', periods: [1, 2],
          desc: 'Ngữ Văn lớp 7. Học kỳ I: Văn biểu cảm, tục ngữ, ca dao, thơ Đường luật.',
        },
        {
          name: 'Tiếng Anh (Cơ bản)', teacher: 'Cô Lê Thu Hà',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--teal', accentColor: '#CCFBF1', iconColor: '#0F766E',
          icon: 'fas fa-globe', periods: [3, 4],
          desc: 'Tiếng Anh cơ bản lớp 7. Tập trung vào ngữ pháp, từ vựng và luyện đọc hiểu.',
        },
      ],
      afternoon: [
        {
          name: 'Giáo Dục Thể Chất', teacher: 'Thầy Hoàng Minh Đức',
          room: 'Nhà Đa Năng', roomIcon: 'fas fa-running',
          color: 'subj--red', accentColor: '#FFE4E6', iconColor: '#BE123C',
          icon: 'fas fa-futbol', periods: [6, 7],
          desc: 'GDTC lớp 7. Học kỳ I: Thể dục nhịp điệu, bóng đá, bóng rổ cơ bản.',
          note: 'Mặc trang phục thể dục theo quy định. Mang giày thể thao.',
        },
      ],
    },
    4: {
      morning: [
        {
          name: 'Toán Hình Học', teacher: 'Thầy Nguyễn Đạo',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--green', accentColor: '#DCFCE7', iconColor: '#047857',
          icon: 'fas fa-draw-polygon', periods: [1, 2],
          desc: 'Toán Hình Học lớp 7. Học kỳ I: Đường thẳng song song, tam giác bằng nhau.',
        },
        {
          name: 'Vật Lý', teacher: 'Thầy Trần Trọng Tuấn',
          room: 'Phòng Thí Nghiệm', roomIcon: 'fas fa-flask',
          color: 'subj--purple', accentColor: '#F3E8FF', iconColor: '#7C3AED',
          icon: 'fas fa-atom', periods: [3, 4],
          desc: 'Vật Lý lớp 7. Học kỳ I: Quang học (gương phẳng, gương cầu), âm học.',
          note: 'Học tại Phòng Thí Nghiệm. Cần mang theo bảo hộ mắt khi thực hành.',
        },
      ],
      afternoon: [
        {
          name: 'Địa Lý', teacher: 'Cô Đặng Minh Thư',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--blue', accentColor: '#DBEAFE', iconColor: '#1D4ED8',
          icon: 'fas fa-map-marked-alt', periods: [6, 7],
          desc: 'Địa Lý lớp 7. Học kỳ I: Môi trường và các hoạt động kinh tế của con người, châu Phi.',
        },
      ],
    },
    5: {
      morning: [
        {
          name: 'Ngữ Văn', teacher: 'Cô Phan Ngọc Chi',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--blue', accentColor: '#DBEAFE', iconColor: '#1D4ED8',
          icon: 'fas fa-book-open', periods: [1, 2],
          desc: 'Ngữ Văn lớp 7 — tiết luyện tập và kiểm tra bài cũ.',
        },
        {
          name: 'Hóa Học', teacher: 'Cô Hoàng Gia Linh',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--orange', accentColor: '#FFEDD5', iconColor: '#C2410C',
          icon: 'fas fa-flask', periods: [3, 4],
          desc: 'Hóa Học lớp 7. Học kỳ I: Nguyên tử, phân tử, đơn chất và hợp chất, hóa trị.',
        },
      ],
      afternoon: [
        {
          name: 'Quốc Phòng An Ninh', teacher: 'Thầy Hoàng Minh Đức',
          room: 'Sân thể chất', roomIcon: 'fas fa-shield-alt',
          color: 'subj--red', accentColor: '#FFE4E6', iconColor: '#BE123C',
          icon: 'fas fa-shield-alt', periods: [6, 7],
          desc: 'GDQPAN lớp 7. Học kỳ I: Truyền thống giữ nước của dân tộc, điều lệnh đội ngũ.',
          note: 'Mặc đồng phục thể dục. Tập trung tại sân thể chất đúng giờ.',
        },
      ],
    },
    6: {
      morning: [
        {
          name: 'Tiếng Anh (Giao tiếp)', teacher: 'GV bản ngữ (Mr. Smiths)',
          room: 'Phòng Máy Tính 1', roomIcon: 'fas fa-desktop',
          color: 'subj--teal', accentColor: '#CCFBF1', iconColor: '#0F766E',
          icon: 'fas fa-comments', periods: [1, 2],
          desc: 'Tiếng Anh giao tiếp với giáo viên bản ngữ. Tập trung kỹ năng nghe — nói, phát âm chuẩn.',
          note: 'Học tại Phòng Máy Tính 1. Tích cực phát biểu bằng tiếng Anh.',
        },
        {
          name: 'Sinh Học', teacher: 'Cô Võ Phương Thảo',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--green', accentColor: '#DCFCE7', iconColor: '#047857',
          icon: 'fas fa-leaf', periods: [3, 4],
          desc: 'Sinh Học lớp 7. Học kỳ I: Giới động vật — động vật không xương sống và có xương sống.',
        },
        {
          name: 'GD Công Dân', teacher: 'Cô Bùi Thị Thanh',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--orange', accentColor: '#FFEDD5', iconColor: '#C2410C',
          icon: 'fas fa-balance-scale', periods: [6, 7],
          desc: 'GDCD lớp 7. Học kỳ I: Sống giản dị, trung thực, tự trọng, đạo đức và kỷ luật.',
        },
      ],
    },
    7: {
      morning: [
        {
          name: 'Lịch Sử', teacher: 'Thầy Đỗ Văn Nam',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--indigo', accentColor: '#EEF2FF', iconColor: '#4338CA',
          icon: 'fas fa-landmark', periods: [1, 2],
          desc: 'Lịch Sử lớp 7. Học kỳ I: Xã hội phong kiến châu Âu, Văn hóa Phục Hưng, cải cách tôn giáo.',
        },
        {
          name: 'Sinh Hoạt Lớp', teacher: 'Cô Xuân Hiền (CN)',
          room: 'Phòng 201', roomIcon: 'fas fa-door-open',
          color: 'subj--yellow', accentColor: '#FEF3C7', iconColor: '#92400E',
          icon: 'fas fa-users', periods: [3],
          desc: 'Sinh hoạt lớp cuối tuần. Nhận xét tuần học, kế hoạch tuần tới, hoạt động thi đua.',
          note: 'Lớp trưởng chuẩn bị báo cáo thi đua tuần. Phụ huynh có thể được liên lạc qua sổ liên lạc.',
        },
      ],
    },
  };

  // Lấy TKB từ database theo user đang đăng nhập
  (function loadTimetableFromDatabase() {
    let lookupKey = '';
    try {
      const u = JSON.parse(sessionStorage.getItem('spms_user'));
      lookupKey = u?.userId || u?.id || u?.username || '';
    } catch { /* ignore */ }
    if (!lookupKey) return;
    const sharedTimetable = window.SPMSSelectors?.timetable(lookupKey) || [];
    if (!sharedTimetable.length) return;
    Object.keys(TKB_DATA).forEach(key => delete TKB_DATA[key]);
    sharedTimetable.forEach(entry => {
      const day = TKB_DATA[entry.weekday] || (TKB_DATA[entry.weekday] = { morning: [], afternoon: [] });
      const slot = {
        name: entry.subject?.name || '—',
        teacher: entry.teacher?.fullName || 'Giáo viên bộ môn',
        room: entry.room || '—',
        roomIcon: 'fas fa-door-open',
        color: 'subj--blue',
        accentColor: '#DBEAFE',
        iconColor: '#1D4ED8',
        icon: 'fas fa-book-open',
        periods: [entry.period],
        desc: `Môn ${entry.subject?.name || ''}`,
      };
      (entry.period <= 5 ? day.morning : day.afternoon).push(slot);
    });
  })();

  const DAY_NAMES = { 2: 'Thứ Hai', 3: 'Thứ Ba', 4: 'Thứ Tư', 5: 'Thứ Năm', 6: 'Thứ Sáu', 7: 'Thứ Bảy' };

  /* ── Week navigation state ── */
  // weekOffset = 0 means current week, -1 = last week, +1 = next week, etc.
  let _weekOffset = 0;

  /**
   * Get the Monday of the week that contains `date`.
   * Vietnamese week starts on Monday (ISO week).
   */
  function getWeekMonday(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
    const diff = day === 0 ? -6 : 1 - day; // adjust to Monday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get the week number in the school year.
   * School year starts on the first Monday of September.
   * Returns 1-based week number, clamped to [1, 52].
   */
  function getSchoolWeekNumber(monday) {
    // Determine school year start: first Monday of September of the current or previous year
    const year = monday.getMonth() >= 8 ? monday.getFullYear() : monday.getFullYear() - 1;
    const sep1 = new Date(year, 8, 1); // September 1
    const sep1Day = sep1.getDay();
    const daysToMonday = sep1Day === 0 ? 1 : sep1Day === 1 ? 0 : 8 - sep1Day;
    const schoolStart = new Date(sep1);
    schoolStart.setDate(sep1.getDate() + daysToMonday);
    schoolStart.setHours(0, 0, 0, 0);

    const diffMs   = monday.getTime() - schoolStart.getTime();
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, diffWeeks + 1);
  }

  /** Format a Date as dd/mm/yyyy */
  function fmtDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  }

  /**
   * Update the week label element and re-highlight today's column.
   * Also disables/enables the "previous" button when at week 1.
   */
  function updateWeekUI() {
    const today      = new Date();
    const curMonday  = getWeekMonday(today);
    curMonday.setDate(curMonday.getDate() + _weekOffset * 7);

    const saturday = new Date(curMonday);
    saturday.setDate(curMonday.getDate() + 5);

    const weekNum = getSchoolWeekNumber(curMonday);

    const labelEl = document.querySelector('#screen-tkb .week-label');
    if (labelEl) {
      labelEl.textContent = `Tuần ${String(weekNum).padStart(2, '0')}  (${fmtDate(curMonday)} – ${fmtDate(saturday)})`;
    }

    // Highlight today's column in the thead
    const thead = document.querySelector('#screen-tkb .timetable-grid thead tr');
    if (thead) {
      const ths = thead.querySelectorAll('th');
      // ths[0] = BUỔI/TIẾT, ths[1]=T2, ths[2]=T3, … ths[6]=T7
      // Column index maps: day-of-week 1(Mon)→1, 2(Tue)→2, …, 6(Sat)→6
      const todayDayOfWeek = today.getDay(); // 0=Sun,1=Mon,…6=Sat

      ths.forEach((th, i) => th.classList.remove('th--today'));

      if (_weekOffset === 0 && todayDayOfWeek >= 1 && todayDayOfWeek <= 6) {
        const thIdx = todayDayOfWeek; // Mon=1→ths[1], …, Sat=6→ths[6]
        if (ths[thIdx]) ths[thIdx].classList.add('th--today');
      }
    }

    // Disable "prev" button when at or before week 1
    const prevBtn = document.querySelector('#screen-tkb .week-nav-btn[aria-label="Tuần trước"]');
    if (prevBtn) {
      prevBtn.disabled = (weekNum <= 1 && _weekOffset <= 0);
    }
  }

  /** Navigate to the previous week */
  function prevWeek() {
    const today     = new Date();
    const curMonday = getWeekMonday(today);
    curMonday.setDate(curMonday.getDate() + (_weekOffset - 1) * 7);
    const weekNum = getSchoolWeekNumber(curMonday);
    if (weekNum < 1) return; // don't go before school start
    _weekOffset--;
    updateWeekUI();
    animateTableTransition('right');
  }

  /** Navigate to the next week */
  function nextWeek() {
    _weekOffset++;
    updateWeekUI();
    animateTableTransition('left');
  }

  /**
   * Brief slide animation on the timetable when navigating weeks.
   * direction: 'left' (forward) | 'right' (backward)
   */
  function animateTableTransition(direction) {
    const wrap = document.querySelector('#screen-tkb .timetable-wrap');
    if (!wrap) return;
    const outClass = direction === 'left' ? 'tkb-slide-out-left' : 'tkb-slide-out-right';
    const inClass  = direction === 'left' ? 'tkb-slide-in-left'  : 'tkb-slide-in-right';
    wrap.classList.add(outClass);
    setTimeout(() => {
      wrap.classList.remove(outClass);
      wrap.classList.add(inClass);
      setTimeout(() => wrap.classList.remove(inClass), 280);
    }, 160);
  }

  /* ── Build a timetable cell ── */
  function makeCell(slot) {
    if (!slot) return `<td><div class="off-cell">—</div></td>`;
    const ps = slot.periods;
    const periodStr = ps.length > 2
      ? `Tiết ${ps[0]} – ${ps[ps.length - 1]}`
      : ps.map(p => `Tiết ${p}`).join(' – ');
    const noteEsc   = (slot.note  || '').replace(/"/g, '&quot;');
    const descEsc   = (slot.desc  || '').replace(/"/g, '&quot;');
    return `<td>
      <div class="subject-cell ${slot.color} subject-cell--clickable"
           onclick="StudentTKBModule.openSubjectDetail(this)"
           data-name="${slot.name}"
           data-teacher="${slot.teacher}"
           data-room="${slot.room}"
           data-room-icon="${slot.roomIcon}"
           data-accent="${slot.accentColor}"
           data-icon-color="${slot.iconColor}"
           data-icon="${slot.icon}"
           data-periods='${JSON.stringify(slot.periods)}'
           data-note="${noteEsc}"
           data-desc="${descEsc}"
           title="Click để xem chi tiết tiết học"
           role="button" tabindex="0"
           onkeydown="if(event.key==='Enter'||event.key===' ')StudentTKBModule.openSubjectDetail(this)">
        <div class="subject-cell__name">${slot.name}</div>
        <div class="subject-cell__room"><i class="${slot.roomIcon}"></i> ${slot.room}</div>
        <div class="subject-cell__teacher">${slot.teacher}</div>
        ${periodStr ? `<div class="subject-cell__note">${periodStr}</div>` : ''}
      </div>
    </td>`;
  }

  /* ── Render timetable grid from data ── */
  function renderTKB() {
    const tbody = document.querySelector('#screen-tkb .timetable-grid tbody');
    if (!tbody) return;

    let mornRow1 = `<tr>
      <td rowspan="2"><div class="session-name">CA SÁNG</div><div class="session-time">07:00 – 11:20</div></td>`;
    let mornRow2 = '<tr>';
    let afternRow = `<tr>
      <td><div class="session-name session-name--afternoon">CA CHIỀU</div><div class="session-time">13:30 – 16:50</div></td>`;

    for (let day = 2; day <= 7; day++) {
      const dayData = TKB_DATA[day] || {};
      const morningSlots  = dayData.morning  || [];
      const afternoonSlots = dayData.afternoon || [];

      const m0 = morningSlots[0] ? { ...morningSlots[0] } : null;
      const m1 = morningSlots[1] ? { ...morningSlots[1] } : null;
      const m2 = morningSlots[2] ? { ...morningSlots[2] } : null;

      mornRow1 += makeCell(m0);
      mornRow2 += makeCell(m1);

      const aftSlot = afternoonSlots[0]
        ? { ...afternoonSlots[0] }
        : (m2 || null);

      if (aftSlot) {
        afternRow += makeCell(aftSlot);
      } else if (day === 7) {
        afternRow += `<td><div class="off-cell">Nghỉ học chiều</div></td>`;
      } else {
        afternRow += `<td><div class="off-cell">—</div></td>`;
      }
    }

    mornRow1  += '</tr>';
    mornRow2  += '</tr>';
    afternRow += '</tr>';

    tbody.innerHTML = `
      ${mornRow1}
      ${mornRow2}
      <tr class="break-row"><td colspan="7">NGHỈ TRƯA &amp; BÁN TRÚ &nbsp;(11:20 – 13:30)</td></tr>
      ${afternRow}
    `;
  }

  /* ── Open subject detail slide-over ── */
  function openSubjectDetail(cellEl) {
    const name      = cellEl.dataset.name      || '—';
    const teacher   = cellEl.dataset.teacher   || '—';
    const room      = cellEl.dataset.room      || '—';
    const roomIcon  = cellEl.dataset.roomIcon  || 'fas fa-door-open';
    const accent    = cellEl.dataset.accent    || '#DBEAFE';
    const iconColor = cellEl.dataset.iconColor || '#1D4ED8';
    const icon      = cellEl.dataset.icon      || 'fas fa-book';
    const note      = cellEl.dataset.note      || '';
    const desc      = cellEl.dataset.desc      || '';

    let periods = [];
    try { periods = JSON.parse(cellEl.dataset.periods || '[]'); } catch { /* ignore */ }

    // Determine day label from table header
    let dayLabel = '';
    const td    = cellEl.closest('td');
    const row   = cellEl.closest('tr');
    if (td && row) {
      const table  = row.closest('table');
      const allTds = Array.from(row.querySelectorAll('td'));
      const tdIdx  = allTds.indexOf(td);
      const thEls  = table ? table.querySelectorAll('thead th') : [];
      if (thEls[tdIdx + 1]) dayLabel = thEls[tdIdx + 1].textContent.trim();
    }

    // Stripe
    document.getElementById('tkbDetailStripe').style.background = iconColor;

    // Icon block
    const iconEl = document.getElementById('tkbDetailIcon');
    iconEl.style.background = accent;
    iconEl.style.color       = iconColor;
    iconEl.innerHTML         = `<i class="${icon}"></i>`;

    // Header text
    document.getElementById('tkbDetailName').textContent = name;
    document.getElementById('tkbDetailDay').textContent  =
      dayLabel
        ? `${dayLabel} — ${periods.map(p => `Tiết ${p}`).join(', ')}`
        : `Tiết ${periods.join(', ')}`;

    // Meta cards
    document.getElementById('tkbDetailMeta').innerHTML = `
      <div class="tkb-meta-card">
        <div class="tkb-meta-card__label"><i class="fas fa-chalkboard-teacher"></i> Giáo viên</div>
        <div class="tkb-meta-card__value">${teacher}</div>
      </div>
      <div class="tkb-meta-card">
        <div class="tkb-meta-card__label"><i class="${roomIcon}"></i> Phòng học</div>
        <div class="tkb-meta-card__value">${room}</div>
      </div>`;

    // Note bar
    const noteBar  = document.getElementById('tkbDetailNoteBar');
    const noteText = document.getElementById('tkbDetailNoteText');
    if (note) {
      noteText.textContent  = note;
      noteBar.style.display = 'flex';
    } else {
      noteBar.style.display = 'none';
    }

    // Period timeline
    document.getElementById('tkbDetailPeriods').innerHTML = periods.map(p => {
      const t = PERIOD_TIMES[p];
      if (!t) return '';
      return `<div class="tkb-period-item">
        <div class="tkb-period-item__num" style="background:${iconColor}">${p}</div>
        <div class="tkb-period-item__content">
          <div class="tkb-period-item__time">${t.label} &nbsp;·&nbsp; ${t.start} – ${t.end}</div>
          <div class="tkb-period-item__desc">Thời lượng: 45 phút</div>
        </div>
      </div>`;
    }).join('');

    // Subject description
    const descSection = document.getElementById('tkbDetailDescSection');
    const descEl      = document.getElementById('tkbDetailDesc');
    if (desc) {
      descEl.innerHTML = `
        <div class="tkb-meta-card__label" style="margin-bottom:var(--space-2)">
          <i class="fas fa-info-circle"></i> Nội dung môn học
        </div>
        <div style="font-size:var(--font-body-sm);color:var(--color-text-secondary);line-height:var(--line-height-relaxed)">
          ${desc}
        </div>`;
      descSection.style.display = 'block';
    } else {
      descSection.style.display = 'none';
    }

    // Open panel
    const overlay = document.getElementById('tkbDetailOverlay');
    const panel   = document.getElementById('tkbDetailPanel');
    overlay.classList.add('open');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => panel.querySelector('.tkb-detail-panel__close')?.focus(), 50);
  }

  /* ── Close subject detail slide-over ── */
  function closeSubjectDetail() {
    const overlay = document.getElementById('tkbDetailOverlay');
    const panel   = document.getElementById('tkbDetailPanel');
    if (!overlay || !panel) return;
    overlay.classList.remove('open');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ── Module init ── */
  function init() {
    renderTKB();
    updateWeekUI();

    // Wire overlay click-to-close
    const overlay = document.getElementById('tkbDetailOverlay');
    if (overlay) {
      overlay.addEventListener('click', closeSubjectDetail);
    }

    // Wire week navigation buttons
    const prevBtn = document.querySelector('#screen-tkb .week-nav-btn[aria-label="Tuần trước"]');
    const nextBtn = document.querySelector('#screen-tkb .week-nav-btn[aria-label="Tuần sau"]');
    if (prevBtn) prevBtn.addEventListener('click', prevWeek);
    if (nextBtn) nextBtn.addEventListener('click', nextWeek);
  }

  // Expose module API
  global.StudentTKBModule = {
    init,
    openSubjectDetail,
    closeSubjectDetail,
    prevWeek,
    nextWeek,
  };

})(window);
