// client/utils/tracker.js

class AnalyticsTracker {
  constructor() {
    // Don't track admin panel visits
    if (window.location.pathname.startsWith('/admin-panel') || 
        window.location.pathname.startsWith('/admin')) {
      return;
    }

    this.visitorId = this.getOrCreateVisitorId();
    this.pageLoadTime = new Date();
    this.maxScrollDepth = 0;
    this.clickCount = 0;
    this.hasTrackedPageView = false;

    this.setupListeners();
    this.trackPageView();
  }

  // Generate or retrieve persistent visitor ID
  getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('analyticsVisitorId');
    
    if (!visitorId) {
      // Generate a unique visitor ID
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('analyticsVisitorId', visitorId);
    }
    
    return visitorId;
  }

  setupListeners() {
    // Track clicks
    document.addEventListener('click', (e) => {
      this.clickCount++;
    });

    // Track scroll depth
    const throttledScroll = this.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const winHeight = window.innerHeight;
      const scrollPercent = Math.min((scrollTop + winHeight) / docHeight, 1);
      
      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);
    }, 100);

    window.addEventListener('scroll', throttledScroll);

    // Send data when user leaves the page
    window.addEventListener('beforeunload', () => {
      this.sendFinalEngagementData();
    });

    // Also send data on visibility change (when tab becomes hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.sendFinalEngagementData();
      }
    });
  }

  // Throttle function to limit scroll event frequency
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Track initial page view
  async trackPageView() {
    if (this.hasTrackedPageView) return;
    
    const path = window.location.pathname;
    
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path,
          visitorId: this.visitorId
        })
      });

      if (response.ok) {
        this.hasTrackedPageView = true;
        console.log('Page view tracked successfully');
      } else {
        console.warn('Failed to track page view:', response.status);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Send final engagement data when user leaves
  sendFinalEngagementData() {
    const timeSpent = Math.round((new Date() - this.pageLoadTime) / 1000); // in seconds
    const path = window.location.pathname;

    const data = {
      path,
      visitorId: this.visitorId,
      engagement: {
        clicks: this.clickCount,
        scrollDepth: this.maxScrollDepth,
        timeSpent: timeSpent
      }
    };

    // Use sendBeacon with Blob to ensure proper Content-Type
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json'
      });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      // Fallback for browsers that don't support sendBeacon
      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true
        });
      } catch (error) {
        console.error('Error sending final engagement data:', error);
      }
    }
  }

  // Method to manually track events if needed
  trackEvent(eventName, eventData = {}) {
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: window.location.pathname,
          visitorId: this.visitorId,
          event: {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
}

// Auto-initialize when DOM is ready
let tracker = null;

function initTracker() {
  if (!tracker && typeof window !== 'undefined') {
    tracker = new AnalyticsTracker();
  }
  return tracker;
}

// Initialize immediately if DOM is already loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracker);
  } else {
    initTracker();
  }
}

// Export for manual initialization if needed
export default initTracker;