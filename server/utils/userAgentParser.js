// utils/userAgentParser.js
const userAgentParser = require('ua-parser-js');

exports.parseUserAgent = (uaString) => {
  const ua = userAgentParser(uaString);
  
  return {
    browser: ua.browser.name || 'unknown',
    os: ua.os.name || 'unknown',
    deviceType: getDeviceType(ua)
  };
};

function getDeviceType(ua) {
  if (ua.device.type === 'mobile') return 'mobile';
  if (ua.device.type === 'tablet') return 'tablet';
  if (ua.device.type === 'console' || ua.device.type === 'smarttv' || ua.device.type === 'wearable') return 'other';
  if (ua.device.type === 'bot') return 'bot';
  return 'desktop'; // default to desktop if not specified
}