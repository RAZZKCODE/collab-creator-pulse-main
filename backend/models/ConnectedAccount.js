import pool from '../config/db.js';
import crypto from 'crypto';

export class ConnectedAccount {
  /**
   * Finds all connected accounts for a user, including all necessary fields.
   */
  static async findByUserId(userId) {
    const query = `
      SELECT id, platform, username, followers_count, engagement_rate, last_synced_at, status, profile_url 
      FROM connected_accounts 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  /**
   * Creates a new account entry with all the user-provided details.
   */
  static async createForVerification(userId, platform, username, profileUrl, followersCount) {
    const verificationCode = `cp-${crypto.randomBytes(4).toString('hex')}`;
    
    const query = `
      INSERT INTO connected_accounts (user_id, platform, username, profile_url, followers_count, verification_code, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      ON CONFLICT (user_id, platform) DO UPDATE SET
        username = EXCLUDED.username,
        profile_url = EXCLUDED.profile_url,
        followers_count = EXCLUDED.followers_count,
        verification_code = EXCLUDED.verification_code,
        status = 'pending',
        updated_at = NOW()
      RETURNING *
    `;
    
    const followers = followersCount || 0;
    const { rows } = await pool.query(query, [userId, platform, username, profileUrl, followers, verificationCode]);
    return rows[0];
  }

  /**
   * Deletes a connected account by its ID.
   */
  static async deleteById(accountId, userId) {
    const query = `
      DELETE FROM connected_accounts 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [accountId, userId]);
    return rows[0];
  }
}