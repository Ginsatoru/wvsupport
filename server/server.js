// Environment setup - must be first
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const fs = require("fs");

const { initGeoIP } = require("./utils/geoIP");
const SocketServer = require("./utils/socket");
const { startEmailInbox } = require("./services/emailInbox");

console.log("Environment:", {
  MONGO_URI: process.env.MONGO_URI ? "*****" : "NOT FOUND",
  JWT_SECRET: process.env.JWT_SECRET ? "*****" : "NOT FOUND",
  PORT: process.env.PORT || "5000 (default)",
});

// Refuse to start without a signing secret; warn if it's weak
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set");
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) console.warn("⚠️  JWT_SECRET is shorter than 32 characters; use a longer random value");

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
app.set("trust proxy", 1); // behind Nginx: req.ip is the visitor's real IP (used by login rate limiting)
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
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));
app.use("/api/users", require("./routes/users"));
app.use("/api/admin", require("./routes/admin")); // login + current account

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

  // Pull customer email replies into their contact thread
  startEmailInbox(socketServer);
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
  console.error("\n❌ Unhandled Rejection (server kept running):", err?.message || err);
});

startServer().catch((err) => {
  console.error("\n❌ Failed to start server:", err.message);
  process.exit(1);
});