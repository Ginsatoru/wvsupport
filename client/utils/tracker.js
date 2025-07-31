// tracker.js (to be included in your public-facing React app)
class AnalyticsTracker {
  constructor() {
    if (window.location.pathname.startsWith('/admin-panel')) {
      return;
    }
    this.sessionId = sessionStorage.getItem('analyticsSessionId') || 
                   this.generateSessionId();
    sessionStorage.setItem('analyticsSessionId', this.sessionId);
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = new Date();
    this.maxScrollDepth = 0;
    this.clickCount = 0;
    this.setupListeners();
    this.trackPageView();
  }

  generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  setupListeners() {
    // Track clicks
    document.addEventListener('click', () => {
      this.clickCount++;
    });

    // Track scroll depth
    window.addEventListener('scroll', () => {
      const scrollDepth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollDepth);
    });

    // Send data when user leaves the page
    window.addEventListener('beforeunload', () => {
      const timeSpent = (new Date() - this.pageLoadTime) / 1000; // in seconds
      this.sendEngagementData(timeSpent);
    });
  }

  trackPageView() {
    const path = window.location.pathname;
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        sessionId: this.sessionId,
        engagement: {
          clicks: 0,
          scrollDepth: 0,
          timeSpent: 0
        }
      })
    }).catch(error => console.error('Error tracking page view:', error));
  }

  sendEngagementData(timeSpent) {
    const path = window.location.pathname;
    navigator.sendBeacon('/api/analytics/track', JSON.stringify({
      path,
      sessionId: this.sessionId,
      engagement: {
        clicks: this.clickCount,
        scrollDepth: this.maxScrollDepth,
        timeSpent
      }
    }));
  }
}

// Initialize tracker when the page loads
window.addEventListener('DOMContentLoaded', () => {
  window.analyticsTracker = new AnalyticsTracker();
});

export default function initTracker() {
  if (!window.analyticsTracker) {
    window.analyticsTracker = new AnalyticsTracker();
  }
}