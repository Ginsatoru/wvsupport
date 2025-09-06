// server/utils/geoIP.js
const fs = require('fs');
const path = require('path');
const https = require('https');

let geoIPData = null;
let isInitialized = false;

/**
 * Initialize GeoIP functionality
 * Downloads a free IP to country database if not present
 */
async function initGeoIP() {
  try {
    const dbPath = path.join(__dirname, '..', 'data', 'geoip.json');
    
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Check if database file exists
    if (fs.existsSync(dbPath)) {
      try {
        const data = fs.readFileSync(dbPath, 'utf8');
        geoIPData = JSON.parse(data);
        isInitialized = true;
        console.log('✅ GeoIP database loaded successfully');
        return true;
      } catch (error) {
        console.warn('⚠️ Error reading existing GeoIP database:', error.message);
      }
    }

    // If we don't have a database or it's corrupted, create a minimal one
    console.log('📍 Creating minimal GeoIP database...');
    
    // Create a minimal database with some common IP ranges
    const minimalDB = {
      // This is a very basic mapping - in production you'd want a real GeoIP database
      ranges: {
        '127.0.0.1': 'Local',
        '::1': 'Local',
        '192.168': 'Local',
        '10.': 'Local',
        '172.16': 'Local'
      },
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(dbPath, JSON.stringify(minimalDB, null, 2));
    geoIPData = minimalDB;
    isInitialized = true;
    
    console.log('✅ Minimal GeoIP database created');
    console.log('💡 For production, consider using a proper GeoIP service like MaxMind or ipapi.co');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize GeoIP:', error);
    isInitialized = false;
    return false;
  }
}

/**
 * Get country from IP address
 * @param {string} ip - IP address
 * @returns {string} - Country name or 'Unknown'
 */
async function getCountryFromIP(ip) {
  if (!isInitialized || !geoIPData) {
    return 'Unknown';
  }

  try {
    // Handle local/private IPs
    if (!ip || ip === 'unknown' || 
        ip.startsWith('127.') || 
        ip.startsWith('192.168.') || 
        ip.startsWith('10.') || 
        ip.startsWith('172.16.') ||
        ip === '::1') {
      return 'Local';
    }

    // For production, you would implement proper IP range lookup here
    // This is a placeholder implementation
    
    // Try to use a free API service as fallback (with rate limiting)
    if (process.env.NODE_ENV === 'production') {
      try {
        // This is just an example - implement proper rate limiting and error handling
        const response = await fetchWithTimeout(`http://ip-api.com/json/${ip}?fields=country`, 3000);
        const data = await response.json();
        
        if (data && data.country) {
          return data.country;
        }
      } catch (error) {
        console.warn('API lookup failed:', error.message);
      }
    }

    // Fallback to basic detection
    if (geoIPData.ranges) {
      for (const [range, country] of Object.entries(geoIPData.ranges)) {
        if (ip.startsWith(range)) {
          return country;
        }
      }
    }

    return 'Unknown';
  } catch (error) {
    console.error('Error in getCountryFromIP:', error);
    return 'Unknown';
  }
}

/**
 * Fetch with timeout utility
 */
function fetchWithTimeout(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);

    https.get(url, (res) => {
      clearTimeout(timer);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            json: () => Promise.resolve(JSON.parse(data)),
            ok: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (error) {
          reject(error);
        }
      });
      res.on('error', reject);
    }).on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

module.exports = {
  initGeoIP,
  getCountryFromIP
};