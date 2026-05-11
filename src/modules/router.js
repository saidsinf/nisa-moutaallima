// ============================================
// Router — Hash-based SPA router
// ============================================

let currentRoute = '';
let routeHandler = null;

export function initRouter(handler) {
  routeHandler = handler;
  window.addEventListener('hashchange', () => {
    currentRoute = getRoute();
    handler(currentRoute);
  });
  currentRoute = getRoute();
  handler(currentRoute);
}

export function navigate(path) {
  window.location.hash = '#' + path;
}

export function getRoute() {
  return window.location.hash.replace('#', '') || '/';
}

export function getRouteParts() {
  return getRoute().split('/').filter(Boolean);
}
