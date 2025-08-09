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
        "https://www.wvsupportservices.com", // Added www version
        "http://www.wvsupportservices.com",
        "http://wvsupportservices.com", // Added non-www http version

        // Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];

      console.log(`🌐 CORS request from origin: ${origin || 'null'}`);
      
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(`✅ CORS allowed for: ${origin || 'null'}`);
        return callback(null, true);
      }
      
      console.log(`❌ CORS blocked for: ${origin}`);
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

// ======================
// STATIC FILE SERVING - MOVED BEFORE SECURITY HEADERS
// ======================
// Debug middleware for uploads (before static serving)
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(__dirname, "uploads", req.path);
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    userAgent: req.get('User-Agent') || 'N/A',
    referer: req.get('Referer') || 'N/A',
    origin: req.get('Origin') || 'N/A',
    host: req.get('Host') || 'N/A'
  };
  
  console.log(`\n📸 === IMAGE REQUEST DEBUG ===`);
  console.log(`🔗 URL: ${req.method} ${req.originalUrl}`);
  console.log(`📁 Local path: ${filePath}`);
  console.log(`🌐 Origin: ${requestInfo.origin}`);
  console.log(`🏠 Host: ${requestInfo.host}`);
  console.log(`📄 Referer: ${requestInfo.referer}`);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ File exists!`);
    console.log(`📊 Size: ${stats.size} bytes`);
    console.log(`📅 Modified: ${stats.mtime.toISOString()}`);
    console.log(`🔐 Permissions: ${(stats.mode & parseInt('777', 8)).toString(8)}`);
  } else {
    console.log(`❌ File NOT found: ${filePath}`);
    
    // List files in the uploads directory
    try {
      const uploadFiles = fs.readdirSync(uploadsDir);
      console.log(`📁 Available files in uploads (${uploadFiles.length}):`);
      uploadFiles.forEach((file, index) => {
        if (index < 10) { // Show first 10 files
          console.log(`   └─ ${file}`);
        }
      });
      if (uploadFiles.length > 10) {
        console.log(`   └─ ... and ${uploadFiles.length - 10} more`);
      }
      
      // Check if there's a similar filename
      const requestedFilename = path.basename(req.path);
      const similarFiles = uploadFiles.filter(file => 
        file.includes(requestedFilename.split('-')[0]) || 
        file.includes(requestedFilename.split('.')[0])
      );
      
      if (similarFiles.length > 0) {
        console.log(`🔍 Similar files found:`);
        similarFiles.forEach(file => console.log(`   └─ ${file}`));
      }
      
    } catch (dirErr) {
      console.log(`❌ Cannot read uploads directory: ${dirErr.message}`);
    }
  }
  console.log(`=================================\n`);
  
  next();
});

// Serve uploaded files with proper headers
app.use(
  "/uploads",
  (req, res, next) => {
    // Add cache headers for images
    res.setHeader("Cache-Control", "public, max-age=86400"); // 24 hours
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross-origin for images
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    // Handle preflight requests for uploads
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  },
  express.static(path.join(__dirname, "uploads"), {
    // Add proper MIME types
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      console.log(`📋 Setting headers for file extension: ${ext}`);
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          res.setHeader("Content-Type", "image/jpeg");
          break;
        case '.png':
          res.setHeader("Content-Type", "image/png");
          break;
        case '.gif':
          res.setHeader("Content-Type", "image/gif");
          break;
        case '.webp':
          res.setHeader("Content-Type", "image/webp");
          break;
        case '.svg':
          res.setHeader("Content-Type", "image/svg+xml");
          break;
        default:
          res.setHeader("Content-Type", "application/octet-stream");
      }
    },
    // Additional options for better file serving
    dotfiles: 'ignore',
    etag: true,
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    index: false,
    maxAge: '1d',
    redirect: false
  })
);

// Fallback for uploads 404 - provide better error info
app.use("/uploads", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.path);
  console.log(`❌ 404 for upload: ${req.path}`);
  
  res.status(404).json({
    success: false,
    message: "File not found",
    requestedPath: req.path,
    absolutePath: filePath,
    uploadsDir: uploadsDir,
    fileExists: fs.existsSync(filePath)
  });
});

// Security headers middleware (after static files)
app.use((req, res, next) => {
  // Skip security headers for uploads to avoid conflicts
  if (req.path.startsWith('/uploads')) {
    return next();
  }

  // Remove server header for security
  res.removeHeader("X-Powered-By");

  // Add security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Updated CSP with proper localhost support for uploads
  const isDevelopment = process.env.NODE_ENV !== "production";
  const port = process.env.PORT || 5000;
  
  // Build CSP based on environment
  let imgSrc = [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "*.googleusercontent.com",
    "https://maps.googleapis.com",
    "https://maps.gstatic.com",
    "https://via.placeholder.com",
    "https://dummyimage.com" // Added for your placeholder images
  ];
  
  // Add localhost sources for development
  if (isDevelopment) {
    imgSrc.push(
      `http://localhost:${port}`,
      `http://127.0.0.1:${port}`,
      "http://localhost:*",
      "http://127.0.0.1:*"
    );
  } else {
    // Add production domain for images
    imgSrc.push("https://wvsupportservices.com");
  }

  const cspDirectives = [
    "default-src 'self'",
    `img-src ${imgSrc.join(" ")}`,
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' ws: wss:",
    "font-src 'self' data:",
    "object-src 'none'",
    "media-src 'self'",
    "frame-src 'none'"
  ];

  res.setHeader("Content-Security-Policy", cspDirectives.join("; "));

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
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

// Enhanced debug endpoint to check uploaded files
app.get("/api/debug/uploads", (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const protocol = req.secure || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const host = req.get('host');
    
    res.json({
      success: true,
      uploadsDir,
      protocol,
      host,
      baseUrl: `${protocol}://${host}`,
      totalFiles: files.length,
      files: files.map((file) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          url: `${protocol}://${host}/uploads/${file}`,
          size: stats.size,
          modified: stats.mtime,
          isFile: stats.isFile(),
          extension: path.extname(file)
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      uploadsDir,
    });
  }
});

// Test image serving endpoint
app.get("/api/test-image/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  console.log(`🧪 Testing image: ${filename}`);
  console.log(`📁 Full path: ${filePath}`);
  console.log(`📁 Exists: ${fs.existsSync(filePath)}`);
  
  if (fs.existsSync(filePath)) {
    const protocol = req.secure || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const host = req.get('host');
    const stats = fs.statSync(filePath);
    
    res.json({
      success: true,
      filename,
      exists: true,
      url: `${protocol}://${host}/uploads/${filename}`,
      path: filePath,
      stats: {
        size: stats.size,
        modified: stats.mtime,
        isFile: stats.isFile(),
        permissions: (stats.mode & parseInt('777', 8)).toString(8)
      }
    });
  } else {
    const availableFiles = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    
    res.status(404).json({
      success: false,
      filename,
      exists: false,
      path: filePath,
      uploadsDir,
      availableFiles: availableFiles.slice(0, 20), // Show first 20 files
      totalFiles: availableFiles.length,
      similarFiles: availableFiles.filter(file => 
        file.includes(filename.split('-')[0]) || 
        file.includes(filename.split('.')[0])
      )
    });
  }
});

// Add endpoint to manually check a team member's image
app.get("/api/debug/team-image/:memberId", async (req, res) => {
  try {
    const memberId = req.params.memberId;
    
    // You'll need to import your team model here
    // const Team = require('./models/Team'); // Adjust path as needed
    // const member = await Team.findById(memberId);
    
    // For now, let's just return debug info
    const protocol = req.secure || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const host = req.get('host');
    
    res.json({
      success: true,
      memberId,
      serverInfo: {
        protocol,
        host,
        uploadsDir,
        nodeEnv: process.env.NODE_ENV,
        // member: member || 'Member model not imported'
      },
      message: "Debug endpoint - implement team member lookup"
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
  console.log(`❌ 404 - Endpoint not found: ${req.method} ${req.path}`);
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
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const domain = process.env.NODE_ENV === 'production' ? 'wvsupportservices.com' : `localhost:${PORT}`;
      
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`---------------------------------`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: ${protocol}://${domain}/api/health`);
      console.log(`Uploads debug: ${protocol}://${domain}/api/debug/uploads`);
      console.log(`Static files: ${protocol}://${domain}/uploads/`);
      console.log(`Test endpoint: ${protocol}://${domain}/api/test`);
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
        } (${uploadsDir})`
      );
      
      // Log available files in uploads directory
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        console.log(`📁 Files in uploads: ${files.length}`);
        if (files.length > 0) {
          console.log(`   └─ ${files.slice(0, 5).join(', ')}${files.length > 5 ? ' ...' : ''}`);
        }
      }
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