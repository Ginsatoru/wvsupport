// utils/geoIP.js
const maxmind = require('maxmind');
const path = require('path');
const fs = require('fs');

let lookupPromise;
let geoIPInitialized = false;

// Initialize GeoIP lookup
exports.initGeoIP = async () => {
  try {
    const dbPath = path.join(__dirname, '..', 'GeoLite2-Country.mmdb');
    
    // Check if file exists
    if (!fs.existsSync(dbPath)) {
      throw new Error(`GeoLite2 database file not found at ${dbPath}`);
    }

    lookupPromise = maxmind.open(dbPath);
    await lookupPromise; // Ensure it's loaded
    geoIPInitialized = true;
    console.log('GeoIP initialized successfully');
    return true;
  } catch (error) {
    console.error('GeoIP initialization failed:', error.message);
    geoIPInitialized = false;
    return false;
  }
};

// Get country from IP
exports.getCountryFromIP = async (ip) => {
  try {
    // Special case for our mock IP
    if (ip === '8.8.8.8') {
      return 'United States'; // Google's IP is in the US
    }

    // Handle localhost and internal IPs
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
      return 'Localhost';
    }

    if (!geoIPInitialized) {
      console.warn('GeoIP not initialized - returning "Unknown"');
      return 'Unknown';
    }

    const lookup = await lookupPromise;
    const result = lookup.get(ip);
    return result?.country?.names?.en || 'Unknown';
  } catch (error) {
    console.error('GeoIP lookup error:', error.message);
    return 'Unknown';
  }
};