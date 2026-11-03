const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const { initDB } = require("./backend/config/db");
const carRoutes = require("./backend/routes/carRoutes");
const bookingRoutes = require("./backend/routes/bookingRoutes");
const authRoutes = require("./backend/routes/authRoutes");
const contactRoutes = require("./backend/routes/contactRoutes");
const metaRoutes = require("./backend/routes/metaRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Storage
initDB().catch((err) => console.error("Database initialization error:", err));

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve Frontend Static Files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, ".")));

// API Routes
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", metaRoutes);

// Health Check Endpoint (useful for Render keep-alive & monitoring)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Cars19 Backend API",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Single Page Application Fallback: serve index.html for non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected server error occurred."
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚗 Cars19 Backend Server is running!`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`🔌 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📁 Static files served from: ${__dirname}`);
  console.log(`===============================================`);
});
