// backend/routes/submissionRoutes.js
import express from "express";
import pool from "../config/db.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// POST /api/campaigns/:id/submissions  (creator submits content)
router.post("/:id/submissions", authenticate, async (req, res) => {
  try {
    const campaignId = Number(req.params.id);
    const { accounts, reel_url, submitted_at, metadata } = req.body || {};
    if (!campaignId || !Array.isArray(accounts) || accounts.length === 0 || !reel_url) {
      return res.status(400).json({ error: "campaign, accounts and reel_url required" });
    }

    const result = await pool.query(
      `INSERT INTO submissions (campaign_id, user_id, accounts, reel_url, metadata, status, created_at)
       VALUES ($1,$2,$3,$4,$5,'pending', NOW()) RETURNING *`,
      [campaignId, req.user.userId, JSON.stringify(accounts), reel_url, metadata ? JSON.stringify(metadata) : null]
    );

    res.status(201).json({ submission: result.rows[0] });
  } catch (err) {
    console.error("Submission create error:", err);
    res.status(500).json({ error: "Server error while creating submission", details: err.message });
  }
});

// GET submissions for campaign (admin or campaign owner)
router.get("/:id/submissions", authenticate, async (req, res) => {
  try {
    const campaignId = Number(req.params.id);
    const q = await pool.query("SELECT * FROM submissions WHERE campaign_id=$1 ORDER BY id DESC", [campaignId]);
    res.json(q.rows);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
