// Environment setup - must be first
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { initGeoIP } = require("./utils/geoIP");
const SocketServer = require("./utils/socket");
const User = require("./models/User");

console.log("Environment:", {
  MONGO_URI: process.env.MONGO_URI ? "*****" : "NOT FOUND",
  JWT_SECRET: process.env.JWT_SECRET ? "*****" : "NOT FOUND",
  PORT: process.env.PORT || "5000 (default)",
});

// ======================
// CONFIG
// ======================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wv-support";
const uploadsDir = path.join(__dirname, "uploads");

const allowedOrigins = [
  // Production
  "https://wvsupportservices.com",
  "http://www.wvsupportservices.com",
  "https://www.wvsupportservices.com",
  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
];

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

const app = express();
const server = http.createServer(app);

// ======================
// MIDDLEWARES
// ======================
app.use(
  cors({
    origin: (origin, callback) =>
      !origin || allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS")),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "X-Access-Token",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400,
  })
);

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf; // raw body kept for webhook verification if needed
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 1000 }));

// Security headers
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: blob: http: https: http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:* *.googleusercontent.com https://maps.googleapis.com https://maps.gstatic.com https://via.placeholder.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// Request logging (dev, or when enabled)
if (process.env.NODE_ENV !== "production" || process.env.ENABLE_REQUEST_LOGGING === "true") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get("origin") || "none"}`);
    next();
  });
}

// Uploaded files
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(uploadsDir)
);

// ======================
// SOCKET.IO
// ======================
const socketServer = new SocketServer(server, allowedOrigins);
socketServer.initialize();
app.set("socket", socketServer);

// ======================
// ROUTES
// ======================
app.get("/api/test", (req, res) => res.json({ success: true, message: "Backend is working!" }));

app.get("/api/health", (req, res) =>
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState,
    uploadsDirExists: fs.existsSync(uploadsDir),
  })
);

app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/team", require("./routes/teamRoute"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Same as WordPress: 2 days by default, 14 days with "Keep me logged in"
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "14d" : "2d" }
    );
    res.json({ token, user: { email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// 404 + ERROR HANDLING
// ======================
app.use((req, res) => res.status(404).json({ success: false, message: "Endpoint not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ======================
// STARTUP
// ======================
mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));

const startServer = async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log("✅ MongoDB connected");

  const geoIPReady = await initGeoIP().catch((err) => {
    console.warn("⚠️  GeoIP initialization failed:", err.message);
    return false;
  });
  if (!geoIPReady) console.warn("⚠️  GeoIP limited - country detection may not work");

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`GeoIP: ${geoIPReady ? "✅ Ready" : "⚠️ Limited"}`);
  });
};

process.on("SIGTERM", () => {
  console.log("\n🔻 SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

process.on("uncaughtException", (err) => {
  console.error("\n❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("\n❌ Unhandled Rejection:", err);
  process.exit(1);
});

startServer().catch((err) => {
  console.error("\n❌ Failed to start server:", err.message);
  process.exit(1);
});