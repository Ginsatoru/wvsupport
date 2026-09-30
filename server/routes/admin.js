const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// ── Brute-force protection: failed logins per email and per IP, 15-minute window ──
const WINDOW_MS = 15 * 60 * 1000;
const LIMITS = { email: 5, ip: 20 };
const failures = new Map(); // key → { count, resetAt }

const isBlocked = (key, limit) => {
  const entry = failures.get(key);
  return entry && entry.resetAt > Date.now() && entry.count >= limit;
};
const recordFailure = (key) => {
  const now = Date.now();
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now) failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count += 1;
};
setInterval(() => {
  const now = Date.now();
  failures.forEach((entry, key) => entry.resetAt <= now && failures.delete(key));
}, WINDOW_MS).unref();

// Compared against when the email doesn't exist, so response time doesn't reveal it
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);
const INVALID = { message: "Invalid email or password" };

// POST /api/admin/login  { email, password, rememberMe }
router.post("/login", async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const emailKey = `email:${email}`;
  const ipKey = `ip:${req.ip}`;

  if (isBlocked(emailKey, LIMITS.email) || isBlocked(ipKey, LIMITS.ip)) {
    return res.status(429).json({ message: "Too many failed attempts. Try again in 15 minutes." });
  }
  if (!email || !password) return res.status(400).json(INVALID);

  try {
    const user = await User.findOne({ email });
    const passwordOk = await bcrypt.compare(password, user?.password || DUMMY_HASH);
    if (!user || !passwordOk || !user.isAdmin) {
      recordFailure(emailKey);
      recordFailure(ipKey);
      return res.status(401).json(INVALID);
    }

    failures.delete(emailKey);
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role, isAdmin: true },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: req.body.rememberMe === true ? "14d" : "2d" }
    );
    res.json({ token, user: { email: user.email, isAdmin: true } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/me — the logged-in account (top bar)
router.get("/me", verifyAdmin, async (req, res) => {
  const user = await User.findById(req.admin.id).select("name email role isAdmin createdAt").lean();
  res.json({ user });
});

module.exports = router;