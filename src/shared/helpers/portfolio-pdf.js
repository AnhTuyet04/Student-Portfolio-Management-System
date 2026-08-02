/** Mẫu xuất hồ sơ năng lực dùng chung theo giao diện cổng Học sinh. */
(function attachPortfolioPDF(global) {
  'use strict';

  const C = {
    primary: '#1a3a6b', accent: '#f37021', tint: '#eef2f8',
    border: '#d1d9e6', text: '#0f172a', muted: '#6b7280',
    green: '#065f46', greenBg: '#d1fae5',
  };
  const esc = value => String(value ?? '—')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const list = value => Array.isArray(value) ? value : [];

  function section(index, title, content, count) {
    const badge = count == null ? '' : `<span class="count">${count}</span>`;
    return `<section class="section">
      <div class="section-title"><b>${String(index).padStart(2, '0')}&nbsp;/</b><span>${esc(title)}</span>${badge}</div>
      <div class="section-rule"></div>${content}
    </section>`;
  }

  function empty(text) {
    return `<p class="empty">${esc(text)}</p>`;
  }

  function achievementRows(items) {
    if (!items.length) return empty('Chưa có thành tích.');
    return items.map(item => `<article class="card card--primary">
      <div class="card-title">${esc(item.title)}${item.verified === false ? '' : '<span class="verified">✓ ĐÃ XÁC NHẬN</span>'}</div>
      <div class="meta">${esc([item.category, item.level, item.date, item.org].filter(Boolean).join(' · '))}</div>
      <p>${esc(item.desc || '')}</p>
    </article>`).join('');
  }

  function activityRows(items) {
    if (!items.length) return empty('Chưa có hoạt động.');
    return items.map(item => `<article class="card card--accent">
      <div class="card-title">${esc(item.title || item.name)}</div>
      <div class="meta">${esc([item.type, item.role, item.start, item.end, item.hours ? item.hours + ' giờ' : '', item.org].filter(Boolean).join(' · '))}</div>
      <p>${esc(item.desc || '')}</p>
    </article>`).join('');
  }

  function certificateRows(items) {
    if (!items.length) return empty('Chưa có chứng chỉ.');
    return items.map(item => `<article class="card card--muted">
      <div class="card-title">${esc(item.title || item.name)}</div>
      <div class="meta">${esc([item.issuer, item.date || item.issueDate, item.id || item.certId].filter(Boolean).join(' · '))}</div>
    </article>`).join('');
  }

  function subjectTable(items) {
    if (!items.length) return empty('Chưa có dữ liệu học tập.');
    return `<table><thead><tr><th>Môn học</th><th>HK1</th><th>HK2</th><th>Cả năm</th><th>Xếp loại</th></tr></thead>
      <tbody>${items.map(item => `<tr><td>${esc(item.name)}</td><td>${esc(item.hk1 ?? item.c1)}</td><td>${esc(item.hk2 ?? item.c2)}</td><td><b>${esc(item.avg)}</b></td><td>${esc(item.rank || item.xepLoai)}</td></tr>`).join('')}</tbody></table>`;
  }

  function timelineRows(items) {
    if (!items.length) return empty('Chưa có dữ liệu dòng thời gian.');
    return items.map(item => `<div class="timeline">
      <div class="timeline-date">${esc(item.date)}</div><div class="timeline-dot"></div>
      <div><div class="timeline-type">${esc(item.category || item.type || 'Cột mốc')}</div>
      <b>${esc(item.title)}</b><p>${esc(item.desc || '')}</p></div>
    </div>`).join('');
  }

  function build(data) {
    const now = new Date();
    const date = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const achievements = list(data.achievements);
    const activities = list(data.activities);
    const certificates = list(data.certificates);
    const subjects = list(data.subjects);
    const timeline = list(data.timeline);
    const goals = [
      ['Mục tiêu ngắn hạn', data.goalShort],
      ['Mục tiêu trung hạn', data.goalMedium],
      ['Mục tiêu dài hạn', data.goalLong],
    ].filter(item => item[1]);
    const hobbies = String(data.hobbies || '').split(/[,，]/).map(value => value.trim()).filter(Boolean);
    const intro = `<p class="summary">${esc(data.summary || '')}</p>
      ${goals.map(item => `<p class="goal"><b>${esc(item[0])}:</b> ${esc(item[1])}</p>`).join('')}
      ${hobbies.length ? `<div class="hobbies"><b>Sở thích:</b> ${hobbies.map(value => `<span>${esc(value)}</span>`).join('')}</div>` : ''}`;
    const body = [
      section(1, 'Giới thiệu', intro),
      section(2, 'Thành tích', achievementRows(achievements), achievements.length),
      section(3, 'Hoạt động', activityRows(activities), activities.length),
      section(4, 'Chứng chỉ', certificateRows(certificates), certificates.length),
      section(5, 'Kết quả học tập', subjectTable(subjects), subjects.length),
      section(6, 'Dòng thời gian', timelineRows(timeline), timeline.length),
    ].join('');

    return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${esc(data.filename)}</title><style>
      *{box-sizing:border-box}body{margin:0;background:#fff;color:${C.text};font-family:Arial,'Segoe UI',sans-serif}.page{width:210mm;min-height:297mm;margin:auto;background:#fff}
      .hero{background:${C.primary};padding:28px 36px 22px;color:#fff}.hero-top{display:flex;justify-content:space-between;color:rgba(255,255,255,.72);font-size:9px}.brand{color:${C.accent};font-weight:700;letter-spacing:1.5px;text-transform:uppercase}.hero h1{font-size:32px;line-height:1.15;margin:10px 0 6px}.hero-meta{font-size:11px;color:rgba(255,255,255,.85)}
      .quote{padding:16px 36px;border-bottom:1px solid ${C.border};font-size:12px;font-style:italic;color:${C.muted}}.content{padding:24px 36px 32px}.section{margin-bottom:28px;break-inside:avoid}.section-title{display:flex;align-items:center;gap:10px;margin-bottom:6px}.section-title b{font-size:18px;color:${C.accent}}.section-title>span:not(.count){font-size:14px;font-weight:800;color:${C.primary};text-transform:uppercase;letter-spacing:.6px}.count{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:${C.accent};color:#fff;font-size:10px;font-weight:700}.section-rule{height:2px;background:${C.accent};margin-bottom:14px}
      p{font-size:11.5px;line-height:1.55;margin:3px 0}.summary{font-size:12px;line-height:1.7;margin-bottom:10px}.goal b,.hobbies>b{color:${C.primary}}.hobbies{font-size:11.5px;margin-top:8px}.hobbies span{display:inline-block;padding:3px 10px;margin:2px 3px;border-radius:4px;background:${C.tint};color:${C.primary};font-size:11px}
      .card{padding:10px 14px;margin-bottom:12px;background:${C.tint};border-left:3px solid ${C.primary};break-inside:avoid}.card--accent{border-left-color:${C.accent}}.card--muted{border-left-color:${C.muted};background:#f9fafb}.card-title{font-size:13px;font-weight:700;color:${C.primary};display:flex;align-items:center;gap:8px}.verified{font-size:9px;padding:2px 7px;border-radius:3px;background:${C.greenBg};color:${C.green}}.meta{font-size:10.5px;color:${C.muted};margin:4px 0}.empty{color:${C.muted};font-style:italic}
      table{width:100%;border-collapse:collapse;font-size:11.5px}th{padding:7px 10px;background:${C.tint};color:${C.primary};border-bottom:2px solid ${C.border};text-align:left}th:not(:first-child),td:not(:first-child){text-align:center}td{padding:6px 10px;border-bottom:1px solid #edf0f4}tbody tr:nth-child(even){background:${C.tint}}
      .timeline{display:grid;grid-template-columns:70px 12px 1fr;gap:8px;margin-bottom:16px;break-inside:avoid}.timeline-date{text-align:right;font-size:10px;color:${C.muted};font-weight:700}.timeline-dot{width:10px;height:10px;border-radius:50%;background:${C.primary};margin-top:3px}.timeline-type{font-size:9px;font-weight:700;color:${C.accent};text-transform:uppercase;letter-spacing:.5px}.footer{border-top:1px solid ${C.border};padding:8px 36px;display:flex;justify-content:space-between;font-size:9px;color:${C.muted}}
      @media print{@page{size:A4 portrait;margin:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:auto;min-height:auto}}
      </style></head><body><div class="page">
      <header class="hero"><div class="hero-top"><span class="brand">Hệ Thống Đào Tạo · Smart Portfolio</span><span>Xuất ngày ${date}</span></div><h1>${esc(data.name || 'Học sinh')}</h1><div class="hero-meta">Mã HS: ${esc(data.studentCode)} &nbsp;·&nbsp; Lớp: ${esc(data.className)} &nbsp;·&nbsp; Năm học: ${esc(data.year)}</div></header>
      <div class="quote">“${esc(data.motto || 'Mỗi ngày cố gắng hơn ngày hôm qua.')}”</div><main class="content">${body}</main>
      <footer class="footer"><span>Hệ Thống Đào Tạo — Smart Portfolio</span><span>Xuất ${date} ${time} (GMT+7)</span><span>Hồ sơ năng lực</span></footer>
      </div></body></html>`;
  }

  async function exportPDF(data) {
    const safeName = String(data.name || 'HocSinh').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
    const normalized = { ...data, filename: `HoSoNangLuc_${safeName}_DayDu` };
    const popup = global.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    if (!popup) throw new Error('POPUP_BLOCKED');
    popup.document.open(); popup.document.write(build(normalized)); popup.document.close();
    popup.onload = () => setTimeout(() => { popup.focus(); popup.print(); }, 400);
    return normalized.filename;
  }

  global.SPMSPortfolioPDF = { build, export: exportPDF };
})(window);
