// backend/routes/campaignRoutes.js
import express from "express";
import pool from "../config/db.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const normalizeCampaignRow = (row) => {
  if (!row) return row;
  let platforms = [];
  if (row.platforms) {
    if (Array.isArray(row.platforms)) platforms = row.platforms;
    else {
      try {
        platforms = JSON.parse(row.platforms);
      } catch (e) {
        platforms = typeof row.platforms === "string"
          ? row.platforms.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
      }
    }
  }

  const normalized = { ...row, platforms };

  ["budget_total", "budget_used", "rate_per_million", "max_earnings_per_creator"].forEach((k) => {
    if (normalized[k] !== undefined && normalized[k] !== null && typeof normalized[k] === "string") {
      const n = Number(normalized[k]);
      normalized[k] = Number.isNaN(n) ? normalized[k] : n;
    }
  });

  return normalized;
};

// GET all (public)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campaigns ORDER BY id DESC");
    res.json(result.rows.map(normalizeCampaignRow));
  } catch (err) {
    console.error("Error fetching campaigns:", err.stack || err);
    res.status(500).json({ error: "Server error while fetching campaigns", details: err.message });
  }
});

// GET single (public)
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid campaign id" });
  try {
    const result = await pool.query("SELECT * FROM campaigns WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Campaign not found" });
    res.json(normalizeCampaignRow(result.rows[0]));
  } catch (err) {
    console.error("Error fetching campaign:", err.stack || err);
    res.status(500).json({ error: "Server error while fetching campaign", details: err.message });
  }
});

// CREATE (admin)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      title, description, brand_name, logo_url, budget_total, budget_used,
      rate_per_million, max_submissions, max_earnings_per_creator, platforms,
      status, start_date, end_date, created_by
    } = req.body || {};

    if (!title || !brand_name) return res.status(400).json({ error: "title and brand_name are required" });

    const result = await pool.query(
      `INSERT INTO campaigns
       (title, description, brand_name, logo_url, budget_total, budget_used,
        rate_per_million, max_submissions, max_earnings_per_creator,
        platforms, status, start_date, end_date, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW())
       RETURNING *`,
      [
        title,
        description || null,
        brand_name,
        logo_url || null,
        typeof budget_total === "number" ? budget_total : (budget_total ? Number(budget_total) : 0),
        typeof budget_used === "number" ? budget_used : (budget_used ? Number(budget_used) : 0),
        typeof rate_per_million === "number" ? rate_per_million : (rate_per_million ? Number(rate_per_million) : null),
        max_submissions || null,
        typeof max_earnings_per_creator === "number" ? max_earnings_per_creator : (max_earnings_per_creator ? Number(max_earnings_per_creator) : null),
        JSON.stringify(platforms || []),
        status || "active",
        start_date || null,
        end_date || null,
        created_by || req.user?.userId || null,
      ]
    );

    res.status(201).json(normalizeCampaignRow(result.rows[0]));
  } catch (err) {
    console.error("Error creating campaign:", err.stack || err);
    res.status(500).json({ error: "Server error while creating campaign", details: err.message });
  }
});

// UPDATE (admin)
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid campaign id" });

  try {
    const {
      title, description, brand_name, logo_url, budget_total, budget_used,
      rate_per_million, max_submissions, max_earnings_per_creator, platforms,
      status, start_date, end_date
    } = req.body || {};

    const result = await pool.query(
      `UPDATE campaigns SET
         title=$1, description=$2, brand_name=$3, logo_url=$4,
         budget_total=$5, budget_used=$6, rate_per_million=$7,
         max_submissions=$8, max_earnings_per_creator=$9,
         platforms=$10, status=$11, start_date=$12, end_date=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [
        title, description, brand_name, logo_url,
        typeof budget_total === "number" ? budget_total : (budget_total ? Number(budget_total) : null),
        typeof budget_used === "number" ? budget_used : (budget_used ? Number(budget_used) : null),
        typeof rate_per_million === "number" ? rate_per_million : (rate_per_million ? Number(rate_per_million) : null),
        max_submissions || null,
        typeof max_earnings_per_creator === "number" ? max_earnings_per_creator : (max_earnings_per_creator ? Number(max_earnings_per_creator) : null),
        JSON.stringify(platforms || []),
        status || "pending",
        start_date || null,
        end_date || null,
        id
      ]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Campaign not found" });
    res.json(normalizeCampaignRow(result.rows[0]));
  } catch (err) {
    console.error("Error updating campaign:", err.stack || err);
    res.status(500).json({ error: "Server error while updating campaign", details: err.message });
  }
});

// FINISH (MOVE) - admin only
router.put("/:id/finish", authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid campaign id" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const moveResult = await client.query(
      `INSERT INTO finished_campaigns
         (title, description, brand_name, logo_url, budget_total, budget_used,
          rate_per_million, max_submissions, max_earnings_per_creator,
          platforms, status, start_date, end_date, created_by, created_at, finished_at)
       SELECT title, description, brand_name, logo_url, budget_total, budget_used,
              rate_per_million, max_submissions, COALESCE(max_earnings_per_creator,0),
              platforms, status, start_date, end_date, created_by, created_at, NOW()
       FROM campaigns WHERE id=$1 RETURNING *`,
      [id]
    );

    if (moveResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Campaign not found" });
    }

    await client.query("DELETE FROM campaigns WHERE id=$1", [id]);
    await client.query("COMMIT");

    res.json({ message: "Campaign finished ✅", finished: normalizeCampaignRow(moveResult.rows[0]) });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error finishing campaign:", err.stack || err);
    res.status(500).json({ error: "Server error while finishing campaign", details: err.message });
  } finally {
    client.release();
  }
});

// DELETE (admin)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid campaign id" });

  try {
    const result = await pool.query("DELETE FROM campaigns WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Campaign not found" });
    res.json({ message: "Campaign deleted", deleted: normalizeCampaignRow(result.rows[0]) });
  } catch (err) {
    console.error("Error deleting campaign:", err.stack || err);
    res.status(500).json({ error: "Server error while deleting campaign", details: err.message });
  }
});

// JOIN CAMPAIGN (user joins a campaign) - FIXED
router.post("/:id/join", authenticate, async (req, res) => {
  const campaignId = Number(req.params.id);
  console.log("Join attempt for campaign:", campaignId, "by user:", req.user.userId);
  
  if (!Number.isInteger(campaignId)) {
    return res.status(400).json({ error: "Invalid campaign id" });
  }

  try {
    // Check if campaign exists
    const campaignResult = await pool.query("SELECT * FROM campaigns WHERE id=$1", [campaignId]);
    if (campaignResult.rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const campaign = campaignResult.rows[0];

    // Check if campaign is active
    if (campaign.status !== "active") {
      return res.status(400).json({ error: "Campaign is not active" });
    }

    // Check if user already joined this campaign (check user_campaigns table)
    const existingResult = await pool.query(
      "SELECT id FROM user_campaigns WHERE campaign_id=$1 AND user_id=$2 LIMIT 1",
      [campaignId, req.user.userId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: "Already joined this campaign" });
    }

    // Create a "joined" record in user_campaigns table
    const result = await pool.query(
      `INSERT INTO user_campaigns (campaign_id, user_id, joined_at)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [campaignId, req.user.userId]
    );

    console.log("Successfully joined campaign:", result.rows[0]);
    res.json({ message: "Successfully joined campaign!", participant: result.rows[0] });
  } catch (err) {
    console.error("Error joining campaign:", err.stack || err);
    res.status(500).json({ error: "Server error while joining campaign", details: err.message });
  }
});

// GET USER'S JOINED CAMPAIGNS - FIXED
router.get("/user/me", authenticate, async (req, res) => {
  try {
    console.log("Fetching campaigns for user:", req.user?.userId);
    
    // First check if user exists and is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get campaigns where user has joined (from user_campaigns table)
    const result = await pool.query(`
      SELECT 
        c.id, c.title, c.description, c.brand_name, c.logo_url,
        c.budget_total, c.budget_used, c.rate_per_million,
        c.max_submissions, c.max_earnings_per_creator, c.platforms,
        c.status, c.start_date, c.end_date, c.created_by,
        c.created_at, c.updated_at,
        uc.joined_at as date_joined, uc.status as participation_status
      FROM campaigns c
      INNER JOIN user_campaigns uc ON c.id = uc.campaign_id
      WHERE uc.user_id = $1 AND uc.status = 'active'
      ORDER BY uc.joined_at DESC
    `, [req.user.userId]);

    console.log("Found campaigns:", result.rows.length);

    const campaigns = result.rows.map(row => {
      const normalized = normalizeCampaignRow(row);
      
      // Add user-specific data
      return {
        id: normalized.id,
        title: normalized.title,
        logo: normalized.logo_url,
        description: normalized.description,
        brand_name: normalized.brand_name,
        budget_total: normalized.budget_total,
        budget_used: normalized.budget_used,
        rate_per_million: normalized.rate_per_million,
        max_submissions: normalized.max_submissions,
        max_earnings_per_creator: normalized.max_earnings_per_creator,
        platforms: normalized.platforms,
        status: normalized.status,
        start_date: normalized.start_date,
        end_date: normalized.end_date,
        created_by: normalized.created_by,
        created_at: normalized.created_at,
        updated_at: normalized.updated_at,
        
        // User-specific data
        joined_at: row.date_joined,
        participation_status: row.participation_status,
        views: 0, // Default values for joined campaigns
        earnings: 0,
        budgetTotal: normalized.budget_total,
        user_submissions: 0,
        completion: 0
      };
    });

    console.log("Returning campaigns:", campaigns.length);
    res.json({ campaigns });
  } catch (err) {
    console.error("Error fetching user campaigns:", err);
    res.status(500).json({ error: "Server error while fetching user campaigns", details: err.message });
  }
});

export default router;