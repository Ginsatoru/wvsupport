// Small in-memory rate limiter (single server process).
// rateLimit({ windowMs, max, message }) → Express middleware, counted per client IP.
const rateLimit = ({ windowMs, max, message = "Too many requests. Please try again later." }) => {
  const hits = new Map(); // ip → { count, resetAt }

  setInterval(() => {
    const now = Date.now();
    hits.forEach((entry, ip) => entry.resetAt <= now && hits.delete(ip));
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip);
    if (!entry || entry.resetAt <= now) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      res.set("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ success: false, message });
    }
    entry.count += 1;
    next();
  };
};

module.exports = rateLimit;