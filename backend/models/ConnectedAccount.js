import pool from '../config/db.js';
import crypto from 'crypto';

export class ConnectedAccount {
  /**
   * Finds all connected accounts for a specific user, including their status and profile URL.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of connected accounts.
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
   * @param {number} userId - The ID of the user.
   * @param {string} platform - The social media platform (e.g., 'Instagram').
   * @param {string} username - The user's username on the platform.
   * @param {string} profileUrl - The URL of the user's profile.
   * @param {number} followersCount - The number of followers the user has.
   * @returns {Promise<Object>} A promise that resolves to the newly created account object.
   */
  static async createForVerification(userId, platform, username, profileUrl, followersCount) {
    // We still generate a code, which can be used for manual verification by an admin later.
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
    
    const followers = followersCount || 0; // Ensure followers is a number, default to 0
    const { rows } = await pool.query(query, [userId, platform, username, profileUrl, followers, verificationCode]);
    return rows[0];
  }

  /**
   * Deletes a connected account by its ID, ensuring it belongs to the correct user.
   * @param {number} accountId - The ID of the account to delete.
   * @param {number} userId - The ID of the user who owns the account.
   * @returns {Promise<Object|null>} A promise that resolves to the deleted account object, or null if not found.
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