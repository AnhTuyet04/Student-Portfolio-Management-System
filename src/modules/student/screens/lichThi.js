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
  function render() {
    const exams = global.SPMSSelectors?.exams('HS101001') || [];
    const screen = document.getElementById('screen-lichThi');
    if (!screen || !exams.length) return;
    const panel = screen.querySelector('.panel');
    if (!panel) return;
    panel.innerHTML = `<table class="exam-table"><thead><tr><th>Ngày thi</th><th>Môn thi</th><th>Giờ</th><th>Phòng</th><th>Thời lượng</th><th>Hình thức</th></tr></thead><tbody>${exams.map(item=>`<tr><td>${global.SPMSSelectors.date(item.date)}</td><td><strong>${item.subject.name}</strong></td><td>${item.startTime}</td><td>${item.room}</td><td>${item.durationMinutes} phút</td><td>${item.format}</td></tr>`).join('')}</tbody></table>`;
  }
  document.addEventListener('DOMContentLoaded', render);
  global.StudentLichThiModule = { render };
})(window);
