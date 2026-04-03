/* ============================================================
   Collection PLP JavaScript — collection-plp.js
   Place in: assets/collection-plp.js
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════
     SLIDER — VS Style (native scroll)
  ══════════════════════════ */
  (function () {
    'use strict';

    var track       = document.getElementById('sliderTrack');
    var viewport    = document.getElementById('sliderViewport');
    var prevBtn     = document.getElementById('prevBtn');
    var nextBtn     = document.getElementById('nextBtn');
    var progressBar = document.getElementById('sliderProgressBar');
    var progressWrap= document.getElementById('sliderProgressWrap');

    if (!track || !viewport) return;

    var cards = Array.from(track.querySelectorAll('.product-card'));
    if (!cards.length) return;

    /* ── Progress bar: scroll position se sync ── */
    function getScrollPct() {
      var max = viewport.scrollWidth - viewport.clientWidth;
      return max > 0 ? (viewport.scrollLeft / max) * 100 : 0;
    }

    function updateBar() {
      if (!progressBar) return;
      progressBar.style.width = getScrollPct() + '%';
    }

    viewport.addEventListener('scroll', updateBar, { passive: true });

    /* ── Prev / Next buttons — scroll by one card width ── */
    function getCardScrollAmount() {
      var card = cards[0];
      if (!card) return 200;
      var gap = 16;
      return card.offsetWidth + gap;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        viewport.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        viewport.scrollBy({ left: getCardScrollAmount(), behavior: 'smooth' });
      });
    }

    /* ── Keyboard navigation ── */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  viewport.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
      if (e.key === 'ArrowRight') viewport.scrollBy({ left:  getCardScrollAmount(), behavior: 'smooth' });
    });

    /* ── Drag to scroll (mouse) ── */
    var grabbed     = false;
    var startX      = 0;
    var startScroll = 0;

    viewport.addEventListener('mousedown', function (e) {
      grabbed     = true;
      startX      = e.clientX;
      startScroll = viewport.scrollLeft;
      viewport.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!grabbed) return;
      viewport.scrollLeft = startScroll + (startX - e.clientX);
    });

    document.addEventListener('mouseup', function () {
      if (!grabbed) return;
      grabbed = false;
      viewport.style.cursor = 'grab';
    });

    /* prevent image/link drag interfering */
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* ── Mouse wheel horizontal scroll ── */
    viewport.addEventListener('wheel', function (e) {
      e.preventDefault();
      viewport.scrollLeft += e.deltaY;
    }, { passive: false });

    /* ── Progress bar click + drag scrub ── */
    if (progressWrap) {
      var barDragging = false;

      function scrubFromEvent(e) {
        var rect    = progressWrap.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var pct     = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        var max     = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollLeft = pct * max;
      }

      progressWrap.addEventListener('mousedown',  function (e) { barDragging = true; scrubFromEvent(e); });
      progressWrap.addEventListener('touchstart', function (e) { barDragging = true; scrubFromEvent(e); }, { passive: true });

      document.addEventListener('mousemove', function (e) { if (barDragging) scrubFromEvent(e); });
      document.addEventListener('touchmove', function (e) { if (barDragging) scrubFromEvent(e); }, { passive: true });

      document.addEventListener('mouseup',  function () { barDragging = false; });
      document.addEventListener('touchend', function () { barDragging = false; });
    }

    /* ── Update prev/next disabled state ── */
    function updateBtnState() {
      if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 0;
      if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= (viewport.scrollWidth - viewport.clientWidth - 1);
    }

    viewport.addEventListener('scroll', updateBtnState, { passive: true });

    /* ── Init ── */
    updateBar();
    updateBtnState();

  })();

  /* ══════════════════════════
     SORT SELECT → redirect
  ══════════════════════════ */
  var sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', this.value);
      window.location.href = url.toString();
    });
  }

  /* ══════════════════════════
     FILTER AUTO-SUBMIT on checkbox
  ══════════════════════════ */
  var filterForm = document.getElementById('filterForm');
  if (filterForm) {
    var checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        filterForm.submit();
      });
    });
  }

  /* ══════════════════════════
     MOBILE SIDEBAR
  ══════════════════════════ */
  var sidebar  = document.getElementById('plpSidebar');
  var openBtn  = document.getElementById('mobileFilterBtn');
  var closeBtn = document.getElementById('sidebarClose');
  var overlay  = document.getElementById('filterOverlay');

  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (openBtn)  openBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay)  overlay.addEventListener('click', closeSidebar);

})();
