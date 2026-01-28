(function () {
  'use strict';

  function isShortsUrl() {
    return /^\/shorts(\/|$)/.test(location.pathname);
  }

  function redirectAway() {
    window.location.replace('https://www.youtube.com');
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
  });

  // 3) Fallback poll in case yt-navigate-finish isn’t fired for some Shorts navigations
  setInterval(function () {
    if (isShortsUrl()) redirectAway();
  }, 200);
})();
