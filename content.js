(function () {
  'use strict';

  function isShortsUrl() {
    return /^\/shorts(\/|$)/.test(location.pathname);
  }

  function redirectAway() {
    window.location.replace('https://www.youtube.com');
  }

  // --- Remove Shorts shelves/rows from feeds (Home, subscriptions, etc.) ---
  // YouTube is a SPA and keeps appending items while you scroll, so we remove
  // matching modules repeatedly via MutationObserver + a small throttle.

  function normText(s) {
    return String(s || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function removeShortsShelvesOnce() {
    // Desktop: Shorts appears as a "shelf" module in the rich grid feed.
    // Common renderers we see for Shorts shelves:
    // - ytd-rich-shelf-renderer (contains a header/title "Shorts")
    // - ytd-reel-shelf-renderer (legacy / variations)
    var removed = 0;

    var shelfNodes = document.querySelectorAll(
      'ytd-rich-shelf-renderer, ytd-reel-shelf-renderer'
    );

    shelfNodes.forEach(function (shelf) {
      // Try multiple title locations across variations.
      var titleEl =
        shelf.querySelector('#title') ||
        shelf.querySelector('h2') ||
        shelf.querySelector('yt-formatted-string') ||
        shelf.querySelector('[title]');

      var title =
        (titleEl && (titleEl.textContent || titleEl.getAttribute('title'))) || '';

      if (normText(title) === 'shorts') {
        shelf.remove();
        removed++;
      }
    });

    // Also remove individual Shorts tiles if they slip into the grid.
    // Typical markers:
    // - /shorts/ links
    // - ytd-reel-item-renderer / ytd-rich-item-renderer containing such links
    var shortsLinks = document.querySelectorAll('a[href^="/shorts/"]');
    shortsLinks.forEach(function (a) {
      var container =
        a.closest('ytd-rich-item-renderer') ||
        a.closest('ytd-reel-item-renderer') ||
        a.closest('ytd-video-renderer') ||
        a.closest('ytd-grid-video-renderer') ||
        a.closest('ytd-compact-video-renderer') ||
        a.closest('ytd-rich-grid-row') ||
        a.closest('ytd-item-section-renderer') ||
        a;

      // Avoid deleting the entire page structure on an actual Shorts page;
      // redirect logic handles that case.
      if (container && container !== document.documentElement) {
        container.remove();
        removed++;
      }
    });

    return removed;
  }

  var removeScheduled = false;
  function scheduleRemoveShortsShelves() {
    if (removeScheduled) return;
    removeScheduled = true;
    // Small delay to batch DOM mutations.
    setTimeout(function () {
      removeScheduled = false;
      removeShortsShelvesOnce();
    }, 50);
  }

  // 1) Redirect immediately if we loaded on a /shorts/ URL (e.g. new tab, bookmark, or DNR missed)
  if (isShortsUrl()) {
    redirectAway();
    return;
  }

  // 2) When YouTube finishes an in‑page navigation (e.g. clicking a Short from the home feed),
  //    the URL changes via pushState and no full reload happens, so declarativeNetRequest never runs.
  //    Listen for YouTube’s SPA navigation event and redirect if we landed on /shorts/.
  window.addEventListener('yt-navigate-finish', function () {
    if (isShortsUrl()) redirectAway();
    scheduleRemoveShortsShelves();
  });

  // 3) Fallback poll in case yt-navigate-finish isn’t fired for some Shorts navigations
  setInterval(function () {
    if (isShortsUrl()) redirectAway();
  }, 200);

  // 4) Remove Shorts shelves/rows in feeds and keep them removed as the feed grows.
  // Run once as soon as the DOM exists, then observe for changes.
  scheduleRemoveShortsShelves();
  try {
    var obs = new MutationObserver(function () {
      scheduleRemoveShortsShelves();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {
    // Ignore; older browsers / edge cases.
  }
})();
