/**
 * DATE HELPER
 */
const MONTHS_VI = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
];

export const DateHelper = {
  /**
   * Format: '09 Tháng 6, 2026'
   */
  formatLong(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${String(d.getDate()).padStart(2,'0')} ${MONTHS_VI[d.getMonth()]}, ${d.getFullYear()}`;
  },

  /**
   * Format: '09/06/2026'
   */
  formatShort(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  },

  /**
   * Relative time: '2 giờ trước'
   */
  fromNow(dateStr) {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);

    if (mins < 1)    return 'Vừa xong';
    if (mins < 60)   return `${mins} phút trước`;
    if (hours < 24)  return `${hours} giờ trước`;
    if (days < 7)    return `${days} ngày trước`;
    return this.formatLong(dateStr);
  },

  /**
   * ISO string: '2026-06-09'
   */
  toISO(date = new Date()) {
    return date.toISOString().split('T')[0];
  },
};

export default DateHelper;
