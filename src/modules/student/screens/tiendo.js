/**
 * tiendo.js
 * Screen module: Tiến Độ Học Tập
 * Handles progress bar animation for the learning progress screen.
 */

(function (global) {
  'use strict';

  /**
   * Animate all progress bars and competency fills on the screen.
   * Resets width to 0 then transitions to the target width stored
   * in the element's inline style — producing a smooth reveal effect.
   */
  function animateProgressBars() {
    setTimeout(() => {
      document.querySelectorAll('.progress-bar-fill, .competency-item__fill').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          bar.style.transition = 'width 0.9s cubic-bezier(0.4,0,0.2,1)';
          bar.style.width = targetWidth;
        });
      });
    }, 80);
  }

  // Expose module API
  global.StudentTiendoModule = {
    animateProgressBars,
  };

})(window);
