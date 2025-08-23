// Environment setup - MUST BE AT THE VERY TOP
require("dotenv").config({ path: __dirname + "/.env" });
console.log("Environment variables loaded:", {
  MONGO_URI: process.env.MONGO_URI ? "*****" : "NOT FOUND",
  JWT_SECRET: process.env.JWT_SECRET ? "*****" : "NOT FOUND",
  PORT: process.env.PORT || "5000 (default)",
});

// Core dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { initGeoIP } = require("./utils/geoIP");
const teamRoutes = require("./routes/teamRoute");
const newsletterRoutes = require('./routes/newsletterRoutes');


// Security and authentication
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("./models/User");
const Message = require("./models/Message");

// Routes
const settingsRouter = require("./routes/settings");
const authRouter = require("./routes/auth");
const analyticsRouter = require("./routes/analytics");
const analyticsController = require("./controllers/analyticsController");
const contactRoutes = require("./routes/contactRoutes");

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Database Configuration
const FALLBACK_URI = "mongodb://127.0.0.1:27017/wv-support";
const connectionURI = process.env.MONGO_URI || FALLBACK_URI;

// ======================
// ENSURE UPLOADS DIRECTORY EXISTS
// ======================
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// ======================
// MIDDLEWARES
// ======================

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        // Production domains
        "https://wvsupportservices.com",
        "http://www.wvsupportservices.com",
        "https://www.wvsupportservices.com",

        // Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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
    optionsSuccessStatus: 200, // For legacy browser support
    maxAge: 86400, // Cache preflight response for 24 hours
  })
);

// Enhanced body parsing with security limits
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      // Store raw body for webhook verification if needed
      req.rawBody = buf;
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 1000,
  })
);

// Security headers middleware
app.use((req, res, next) => {
  // Remove server header for security
  res.removeHeader("X-Powered-By");

  // Add security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Updated CSP to allow images from uploads directory and localhost
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: blob: http: https: http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:* *.googleusercontent.com https://maps.googleapis.com https://maps.gstatic.com https://via.placeholder.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  next();
});

// Request logging middleware (optional)
if (
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_REQUEST_LOGGING === "true"
) {
  app.use((req, res, next) => {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${
        req.get("origin") || "none"
      }`
    );
    next();
  });
}

// ======================
// STATIC FILE SERVING
// ======================
// Serve uploaded files with proper headers
app.use(
  "/uploads",
  (req, res, next) => {
    // Add cache headers for images
    res.setHeader("Cache-Control", "public, max-age=86400"); // 24 hours
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross-origin for images
    next();
  },
  express.static(path.join(__dirname, "uploads"), {
    // Add proper MIME types
    setHeaders: (res, path) => {
      if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      } else if (path.endsWith(".gif")) {
        res.setHeader("Content-Type", "image/gif");
      } else if (path.endsWith(".webp")) {
        res.setHeader("Content-Type", "image/webp");
      }
    },
  })
);

// Debug middleware for uploads
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(__dirname, "uploads", req.path);
  console.log(`📸 Image request: ${req.path}`);
  console.log(`📁 File exists: ${fs.existsSync(filePath)}`);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
  }
  next();
});

// ======================
// DATABASE CONNECTION
// ======================
const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB with URI: ${connectionURI}`);
    await mongoose.connect(connectionURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// ======================
// TRACK ANALYTICS
// ======================

initGeoIP().then(() => {
  console.log("GeoIP initialized");
});

// ======================
// ROUTES
// ======================

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend is working!" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState,
    uploadsDir: uploadsDir,
    uploadsDirExists: fs.existsSync(uploadsDir),
  });
});

// Debug endpoint to check uploaded files
app.get("/api/debug/uploads", (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    res.json({
      success: true,
      uploadsDir,
      files: files.map((file) => ({
        name: file,
        url: `${req.protocol}://${req.get("host")}/uploads/${file}`,
        size: fs.statSync(path.join(uploadsDir, file)).size,
        modified: fs.statSync(path.join(uploadsDir, file)).mtime,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      uploadsDir,
    });
  }
});

// ======================
// Initialize Socket.IO
// ======================
const SocketServer = require("./utils/socket");
const socketServer = new SocketServer(server);
socketServer.initialize();
app.set("socket", socketServer); // Make accessible in routes

// ======================
// Mount routers
// ======================
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/settings", settingsRouter);
app.use("/api/auth", authRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/team", teamRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use("/api/contact", contactRoutes);

// ======================
// ADMIN AUTHENTICATION
// ======================

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  // Temporary hardcoded admin (remove in production)
  if (email === "admin@wvsupport.com" && password === "!@#aaapos") {
    const token = jwt.sign(
      { id: "admin-id", email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isAdmin)
      return res.status(403).json({ message: "Admin access required" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// ERROR HANDLING
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ======================
// SERVER STARTUP
// ======================
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Initialize GeoIP (continue even if it fails)
    const geoIPReady = await initGeoIP()
      .then((success) => {
        if (!success) {
          console.warn(
            "⚠️  GeoIP functionality limited - country detection may not work"
          );
        }
        return success;
      })
      .catch((err) => {
        console.warn("⚠️  GeoIP initialization failed:", err.message);
        return false;
      });

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`---------------------------------`);
      console.log(`Admin login: http://localhost:${PORT}/api/admin/login`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Uploads debug: http://localhost:${PORT}/api/debug/uploads`);
      console.log(`Static files: http://localhost:${PORT}/uploads/`);
      console.log(`---------------------------------`);
      console.log(
        `GeoIP Status: ${geoIPReady ? "✅ Ready" : "⚠️ Limited functionality"}`
      );
      console.log(
        `Database: ${
          mongoose.connection.readyState === 1
            ? "✅ Connected"
            : "❌ Disconnected"
        }`
      );
      console.log(
        `Uploads Directory: ${
          fs.existsSync(uploadsDir) ? "✅ Ready" : "❌ Missing"
        }`
      );
    });
  } catch (error) {
    console.error("\n❌ Server startup failed:", error.message);
    console.error("Exiting process...");
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n🔻 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("\n❌ Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("\n❌ Unhandled Rejection:", err);
  process.exit(1);
});

// Start the server
startServer().catch((err) => {
  console.error("\n❌ Failed to start server:", err);
  process.exit(1);
});
