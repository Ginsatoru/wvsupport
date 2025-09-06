// server/utils/userAgentParser.js

/**
 * Parse user agent string to extract browser, OS, and device type
 * @param {string} userAgent - The user agent string
 * @returns {object} - Parsed information
 */
function parseUserAgent(userAgent = '') {
  const ua = userAgent.toLowerCase();
  
  // Default values
  let browser = 'unknown';
  let os = 'unknown';
  let deviceType = 'unknown';

  // Browser detection
  if (ua.includes('chrome') && !ua.includes('chromium') && !ua.includes('edg')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('edg')) {
    browser = 'Edge';
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browser = 'Opera';
  } else if (ua.includes('msie') || ua.includes('trident')) {
    browser = 'Internet Explorer';
  } else if (ua.includes('chromium')) {
    browser = 'Chromium';
  }

  // OS detection
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'iOS';
  } else if (ua.includes('cros')) {
    os = 'Chrome OS';
  }

  // Device type detection
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'tablet';
  } else if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    deviceType = 'bot';
  } else {
    deviceType = 'desktop';
  }

  return {
    browser,
    os,
    deviceType
  };
}

module.exports = {
  parseUserAgent
};