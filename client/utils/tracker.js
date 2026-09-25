// client/utils/tracker.js
// Page views + engagement for the public site. Admin/login pages and logged-in admins are never tracked.
//   • one view per route change (SPA navigation included)
//   • time / clicks / scroll are sent when the visitor leaves or hides the page,
//     and only update that view — they never count as a new one

const TRACK_URL = "/api/analytics/track";
const ENGAGEMENT_URL = "/api/analytics/engagement";

const isPrivatePath = (path) => path.startsWith("/admin") || path.startsWith("/login");
// Logged-in admin (valid, unexpired token) browsing the public site — don't count them
const isAdminBrowser = () => {
  try {
    const payload = localStorage.getItem("adminToken").split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload));
    return !exp || exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const newId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

const getVisitorId = () => {
  let id = localStorage.getItem("analyticsVisitorId");
  if (!id) {
    id = newId("visitor");
    localStorage.setItem("analyticsVisitorId", id);
  }
  return id;
};

const postJson = (url, data) => {
  const body = JSON.stringify(data);
  // sendBeacon survives page unload; fall back to a keepalive fetch
  if (navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" }))) return;
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
};

class AnalyticsTracker {
  constructor() {
    this.visitorId = getVisitorId();
    this.view = null;

    document.addEventListener("click", () => this.view && this.view.clicks++);
    window.addEventListener("scroll", () => this.updateScroll(), { passive: true });
    document.addEventListener("visibilitychange", () => document.hidden && this.flush());
    window.addEventListener("pagehide", () => this.flush());
  }

  updateScroll() {
    if (!this.view) return;
    const docHeight = Math.max(document.documentElement.scrollHeight, 1);
    const depth = Math.min((window.scrollY + window.innerHeight) / docHeight, 1);
    this.view.scrollDepth = Math.max(this.view.scrollDepth, depth);
  }

  trackPageView(path) {
    if (isPrivatePath(path) || isAdminBrowser()) {
      this.flush();
      this.view = null;
      return;
    }
    // Same path again within 1s (React StrictMode / double render) counts once
    if (this.view?.path === path && Date.now() - this.view.startedAt < 1000) return;

    this.flush(); // close out the previous page
    this.view = { id: newId("view"), path, startedAt: Date.now(), clicks: 0, scrollDepth: 0 };
    postJson(TRACK_URL, { viewId: this.view.id, path, visitorId: this.visitorId });
  }

  flush() {
    if (!this.view) return;
    postJson(ENGAGEMENT_URL, {
      viewId: this.view.id,
      engagement: {
        clicks: this.view.clicks,
        scrollDepth: this.view.scrollDepth,
        timeSpent: Math.round((Date.now() - this.view.startedAt) / 1000),
      },
    });
  }
}

let tracker = null;

// Call on every route change with the new pathname
const trackPageView = (path = window.location.pathname) => {
  if (typeof window === "undefined") return;
  tracker = tracker || new AnalyticsTracker();
  tracker.trackPageView(path);
};

export default trackPageView;