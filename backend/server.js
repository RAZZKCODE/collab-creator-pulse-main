// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Multiple origins support करेगा
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
const allowedOrigins = FRONTEND_URL.split(',').map(url => url.trim());

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, also allow common localhost variations
    if (origin.includes('localhost:8080') || origin.includes('127.0.0.1:8080')) {
      return callback(null, true);
    }
    
    // Allow your specific IP for mobile access
    if (origin.includes('192.168.31.31:8080')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  }, 
  credentials: true 
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaigns", submissionRoutes); // mounts /:id/submissions

// health
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});