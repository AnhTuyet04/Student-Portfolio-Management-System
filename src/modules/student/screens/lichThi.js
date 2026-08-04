/**
 * lichThi.js
 * Screen module: Lịch Thi
 * This screen displays a static empty-state while the exam schedule
 * has not yet been published. No dynamic logic required.
 * The "Xem Quy Chế Phòng Thi" button calls showSystemInfo() which
 * is exposed globally by hoSoNL.js.
 */

// No runtime module needed — screen is fully static HTML.
// Placeholder export for consistency with other modules.
(function (global) {
  'use strict';

  /* Lấy studentCode từ user session hiện tại */
  function _getStudentCode() {
    try {
      const u = JSON.parse(sessionStorage.getItem('spms_user'));
      // Thử lấy từ profile đầy đủ qua SPMSSelectors
      if (global.SPMSSelectors && (u?.userId || u?.id)) {
        const profile = global.SPMSSelectors.studentProfile(u.userId || u.id);
        if (profile?.studentCode) return profile.studentCode;
      }
      // Fallback: lấy từ STUDENT_PROFILE đã được sync
      return global.STUDENT_PROFILE?.studentCode || u?.studentCode || '';
    } catch { return ''; }
  }

  function render() {
    const code  = _getStudentCode();
    const exams = (code && global.SPMSSelectors?.exams(code)) || [];
    const screen = document.getElementById('screen-lichThi');
    if (!screen || !exams.length) return;
    const panel = screen.querySelector('.panel');
    if (!panel) return;
    panel.innerHTML = `<table class="exam-table"><thead><tr><th>Ngày thi</th><th>Môn thi</th><th>Giờ</th><th>Phòng</th><th>Thời lượng</th><th>Hình thức</th></tr></thead><tbody>${exams.map(item=>`<tr><td>${global.SPMSSelectors.date(item.date)}</td><td><strong>${item.subject.name}</strong></td><td>${item.startTime}</td><td>${item.room}</td><td>${item.durationMinutes} phút</td><td>${item.format}</td></tr>`).join('')}</tbody></table>`;
  }

  document.addEventListener('DOMContentLoaded', render);
  global.StudentLichThiModule = { render };
})(window);
