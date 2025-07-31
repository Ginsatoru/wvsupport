const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    
    // More secure header extraction
    const authHeader = req.header('Authorization') || req.header('authorization');
    console.log('Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided or malformed Authorization header');
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1].trim();
    console.log('Extracted token:', token ? '****' + token.slice(-4) : 'none');
    
    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      console.error('❌ Invalid JWT_SECRET configuration');
      return res.status(500).json({
        message: 'Server configuration error',
        code: 'SERVER_ERROR'
      });
    }

    // Verify token with better error handling
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false, // Explicitly check expiration
      clockTolerance: 30, // 30-second leeway for clock skew
    });
    
    console.log('✅ Token decoded successfully:', {
      id: decoded.id,
      isAdmin: decoded.isAdmin,
      iat: decoded.iat && new Date(decoded.iat * 1000),
      exp: decoded.exp && new Date(decoded.exp * 1000)
    });
    
    // Attach user to request
    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin || false,
      role: decoded.role || 'user'
    };
    
    console.log('=== END AUTH DEBUG ===');
    next();
  } catch (err) {
    console.error('❌ Authentication error:', err.name, err.message);
    
    let status = 401;
    let message = 'Authentication failed';
    let code = 'AUTH_ERROR';
    
    if (err.name === 'TokenExpiredError') {
      status = 401;
      message = 'Session expired';
      code = 'TOKEN_EXPIRED';
      console.error('Token expired at:', err.expiredAt);
    } else if (err.name === 'JsonWebTokenError') {
      status = 401;
      message = 'Invalid token';
      code = 'INVALID_TOKEN';
    }

    return res.status(status).json({ 
      message,
      code,
      error: err.name,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const admin = async (req, res, next) => {
  try {
    console.log('=== ADMIN MIDDLEWARE DEBUG ===');
    
    if (!req.user) {
      console.log('❌ No user in request - auth middleware may have failed');
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'NO_USER'
      });
    }

    console.log('User details:', {
      id: req.user.id,
      isAdmin: req.user.isAdmin,
      role: req.user.role
    });

    // More flexible admin check
    const isAdmin = req.user.isAdmin === true || 
                   req.user.role === 'admin' || 
                   req.user.role === 'superadmin';
    
    if (isAdmin) {
      console.log('✅ Admin access granted');
      return next();
    }

    console.log('❌ Admin access denied');
    return res.status(403).json({ 
      message: 'Admin privileges required',
      code: 'ADMIN_REQUIRED',
      debug: process.env.NODE_ENV === 'development' ? {
        userId: req.user.id,
        isAdmin: req.user.isAdmin,
        role: req.user.role
      } : undefined
    });
    
  } catch (err) {
    console.error('❌ Admin authorization error:', err);
    res.status(500).json({ 
      message: 'Authorization check failed',
      code: 'AUTH_CHECK_FAILED'
    });
  }
};

module.exports = { auth, admin };