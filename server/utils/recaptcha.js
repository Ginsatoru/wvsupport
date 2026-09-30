// Checks a reCAPTCHA token with Google. Needs RECAPTCHA_SECRET_KEY in .env.
// Without a secret: blocked in production, allowed (with a warning) in development.
const verifyRecaptcha = async (token, ip) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") return false;
    console.warn("⚠️  RECAPTCHA_SECRET_KEY not set; reCAPTCHA check skipped (development only)");
    return true;
  }
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || "" }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("reCAPTCHA check failed:", err.message);
    return false;
  }
};

module.exports = { verifyRecaptcha };