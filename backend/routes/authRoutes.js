// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Import database models instead of demo data
import { User } from "../models/User.js";
import pool from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      username,
      full_name,
      phone,
      locale,
      avatar_url,
      bio,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // Check if email already exists in database
    const existingUser = await User.findByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    const newUser = await User.create({
      email: email.toLowerCase(),
      username: username || null,
      password_hash: passwordHash,
      full_name: full_name || null,
      phone: phone || null,
      locale: locale || 'en',
      avatar_url: avatar_url || null,
      bio: bio || null,
      is_active: true,
      is_email_verified: false,
      is_admin: false,
    });

    // Remove password hash from response
    const user = { ...newUser };
    delete user.password_hash;

    // Create token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, accessToken: token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    // Find user in database
    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.is_active) {
      return res.status(403).json({ error: "Account inactive" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return minimal user object
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin
    };
    res.json({ accessToken: token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove sensitive data
    const safeUser = { ...user };
    delete safeUser.password_hash;

    res.json({ user: safeUser });
  } catch (err) {
    console.error("me error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/connected-accounts
router.get("/connected-accounts", async (req, res) => {
  try {
    // For now, return dummy data - आप बाद में real implementation कर सकते हैं
    const connectedAccounts = [
      { id: 1, platform: "Instagram", username: "@learnwithraz" },
      { id: 2, platform: "YouTube", username: "noughtytauji" },
      { id: 3, platform: "TikTok", username: "@memmer.47" },
    ];
    
    res.json({ accounts: connectedAccounts });
  } catch (err) {
    console.error("Connected accounts error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;