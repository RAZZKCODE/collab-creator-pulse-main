// backend/routes/authRoutes.js
import express from "express";
import pool from "../config/db.js"; // आपके pool export के अनुसार adjust کریں
import bcrypt from "bcryptjs";

const router = express.Router();

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

    // check if email already exists
    const exists = await pool.query("SELECT id FROM users WHERE email=$1 LIMIT 1", [email.toLowerCase()]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO users
        (email, username, full_name, phone, locale, avatar_url, bio, password_hash, is_active, is_email_verified, is_admin, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, true, false, false, NOW(), NOW())
       RETURNING id, email, username, full_name, phone, locale, avatar_url, bio, is_active, is_email_verified, is_admin, created_at`,
      [
        email.toLowerCase(),
        username || null,
        full_name || null,
        phone || null,
        locale || null,
        avatar_url || null,
        bio || null,
        passwordHash,
      ]
    );

    const user = result.rows[0];
    // Do NOT return password_hash
    res.status(201).json({ user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
