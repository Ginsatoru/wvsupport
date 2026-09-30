const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Admin routes: valid token (HS256) + the account still exists, still has access,
// and its password hasn't changed since the token was issued.
const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.slice(7).trim();
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  try {
    const user = await User.findById(decoded.id).select("name email role isAdmin passwordChangedAt").lean();
    const issuedAt = (decoded.iat || 0) * 1000;
    const passwordChanged = user?.passwordChangedAt && issuedAt < user.passwordChangedAt.getTime() - 1000;
    if (!user || !user.isAdmin || passwordChanged) {
      return res.status(401).json({ success: false, message: "Session no longer valid" });
    }
    req.admin = { id: String(user._id), email: user.email, name: user.name, role: user.role };
    next();
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyAdmin;