// backend/models/User.js
import pool from '../config/db.js';

export class User {
  static async create(userData) {
    const { 
      email, 
      username, 
      password_hash, 
      full_name, 
      phone, 
      locale, 
      avatar_url, 
      bio,
      is_active = true,
      is_email_verified = false,
      is_admin = false
    } = userData;
    
    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash, full_name, phone, locale, avatar_url, bio, is_active, is_email_verified, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [email, username, password_hash, full_name, phone, locale, avatar_url, bio, is_active, is_email_verified, is_admin]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateById(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  // ✅ JOIN Function 1: Get user profile with stats (submissions के साथ)
  static async getUserProfileWithStats(id) {
    const result = await pool.query(`
      SELECT 
        u.*,
        COALESCE(stats.total_submissions, 0) as total_videos,
        COALESCE(stats.total_earnings, 0) as total_earned,
        COALESCE(stats.total_views, 0) as total_views
      FROM users u
      LEFT JOIN (
        SELECT 
          s.user_id,
          COUNT(s.id) as total_submissions,
          SUM(s.earnings) as total_earnings,
          SUM(s.views) as total_views
        FROM submissions s
        WHERE s.status = 'approved'
        GROUP BY s.user_id
      ) stats ON u.id = stats.user_id
      WHERE u.id = $1
    `, [id]);

    return result.rows[0];
  }

  // ✅ JOIN Function 2: Get user with all submissions details
  static async getUserWithSubmissions(id) {
    const result = await pool.query(`
      SELECT 
        u.*,
        COALESCE(json_agg(
          json_build_object(
            'id', s.id,
            'campaign_id', s.campaign_id,
            'reel_url', s.reel_url,
            'earnings', s.earnings,
            'views', s.views,
            'status', s.status,
            'created_at', s.created_at,
            'campaign_title', c.title,
            'campaign_brand', c.brand_name,
            'campaign_logo', c.logo_url
          )
        ) FILTER (WHERE s.id IS NOT NULL), '[]') as submissions
      FROM users u
      LEFT JOIN submissions s ON u.id = s.user_id
      LEFT JOIN campaigns c ON s.campaign_id = c.id
      WHERE u.id = $1
      GROUP BY u.id
    `, [id]);

    return result.rows[0];
  }

  // ✅ JOIN Function 3: Get user dashboard statistics
  static async getUserDashboardStats(id) {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT s.id) as total_submissions,
        COUNT(DISTINCT s.campaign_id) as active_campaigns,
        COALESCE(SUM(s.earnings), 0) as total_earnings,
        COALESCE(SUM(s.views), 0) as total_views,
        AVG(s.earnings) as avg_earning_per_submission,
        COUNT(CASE WHEN s.status = 'pending' THEN 1 END) as pending_submissions,
        COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_submissions,
        COUNT(CASE WHEN s.status = 'rejected' THEN 1 END) as rejected_submissions,
        COUNT(DISTINCT c.id) as participated_campaigns
      FROM users u
      LEFT JOIN submissions s ON u.id = s.user_id
      LEFT JOIN campaigns c ON s.campaign_id = c.id
      WHERE u.id = $1
    `, [id]);

    return result.rows[0];
  }

  // ✅ JOIN Function 4: Get recent user activity with campaign details
  static async getUserRecentActivity(id, limit = 10) {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.reel_url,
        s.earnings,
        s.views,
        s.status,
        s.created_at,
        c.title as campaign_title,
        c.brand_name,
        c.logo_url as campaign_logo
      FROM submissions s
      JOIN campaigns c ON s.campaign_id = c.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
      LIMIT $2
    `, [id, limit]);

    return result.rows;
  }

  // ✅ JOIN Function 5: Get user earnings summary by campaign
  static async getUserEarningsByCampaign(id) {
    const result = await pool.query(`
      SELECT 
        c.id as campaign_id,
        c.title as campaign_title,
        c.brand_name,
        c.logo_url,
        COUNT(s.id) as submissions_count,
        SUM(s.earnings) as total_earnings,
        SUM(s.views) as total_views,
        AVG(s.earnings) as avg_earning_per_submission,
        MAX(s.created_at) as last_submission_date
      FROM campaigns c
      LEFT JOIN submissions s ON c.id = s.campaign_id AND s.user_id = $1 AND s.status = 'approved'
      WHERE c.status = 'active' OR s.id IS NOT NULL
      GROUP BY c.id, c.title, c.brand_name, c.logo_url
      ORDER BY total_earnings DESC NULLS LAST
    `, [id]);

    return result.rows;
  }

  // ✅ JOIN Function 6: Get user performance metrics
  static async getUserPerformanceMetrics(id) {
    const result = await pool.query(`
      SELECT 
        COUNT(s.id) as total_submissions,
        COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_submissions,
        COUNT(CASE WHEN s.status = 'rejected' THEN 1 END) as rejected_submissions,
        COUNT(CASE WHEN s.status = 'pending' THEN 1 END) as pending_submissions,
        ROUND(
          CASE WHEN COUNT(s.id) > 0 
          THEN (COUNT(CASE WHEN s.status = 'approved' THEN 1 END)::decimal / COUNT(s.id)) * 100 
          ELSE 0 END, 2
        ) as approval_rate,
        COALESCE(SUM(s.earnings), 0) as total_earnings,
        COALESCE(AVG(s.earnings), 0) as avg_earning_per_submission,
        COALESCE(SUM(s.views), 0) as total_views,
        COALESCE(AVG(s.views), 0) as avg_views_per_submission,
        MAX(s.created_at) as last_activity_date,
        MIN(s.created_at) as first_activity_date
      FROM users u
      LEFT JOIN submissions s ON u.id = s.user_id
      WHERE u.id = $1
    `, [id]);

    return result.rows[0];
  }

  // ✅ JOIN Function 7: Get users by role/type with stats
  static async getUsersWithStats(filters = {}) {
    let whereClause = '';
    const values = [];
    let paramCount = 1;

    if (filters.role) {
      whereClause += ` AND u.is_admin = $${paramCount}`;
      values.push(filters.role === 'admin');
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      whereClause += ` AND u.is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.is_admin,
        u.is_active,
        u.created_at,
        COALESCE(stats.total_submissions, 0) as total_submissions,
        COALESCE(stats.total_earnings, 0) as total_earnings,
        COALESCE(stats.total_views, 0) as total_views,
        COALESCE(stats.avg_approval_rate, 0) as approval_rate
      FROM users u
      LEFT JOIN (
        SELECT 
          s.user_id,
          COUNT(s.id) as total_submissions,
          SUM(s.earnings) as total_earnings,
          SUM(s.views) as total_views,
          ROUND(
            CASE WHEN COUNT(s.id) > 0 
            THEN (COUNT(CASE WHEN s.status = 'approved' THEN 1 END)::decimal / COUNT(s.id)) * 100 
            ELSE 0 END, 2
          ) as avg_approval_rate
        FROM submissions s
        GROUP BY s.user_id
      ) stats ON u.id = stats.user_id
      WHERE 1=1 ${whereClause}
      ORDER BY u.created_at DESC
    `, values);

    return result.rows;
  }

  // ✅ JOIN Function 8: Get admin dashboard overview
  static async getAdminDashboardOverview() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_users,
        COUNT(CASE WHEN is_admin = false THEN 1 END) as regular_users,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users,
        COUNT(CASE WHEN is_email_verified = false THEN 1 END) as unverified_users,
        (
          SELECT COUNT(*) FROM campaigns WHERE status = 'active'
        ) as active_campaigns,
        (
          SELECT COUNT(*) FROM submissions WHERE status = 'pending'
        ) as pending_submissions,
        (
          SELECT COALESCE(SUM(earnings), 0) FROM submissions WHERE status = 'approved'
        ) as total_earnings_paid
      FROM users
    `);

    return result.rows[0];
  }
}