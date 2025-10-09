import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { ConnectedAccount } from '../models/ConnectedAccount.js';

const router = express.Router();

// --- API Endpoints ---

/**
 * @route   GET /api/accounts
 * @desc    Get all connected accounts for the logged-in user
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const accounts = await ConnectedAccount.findByUserId(req.user.id);
        res.json({ accounts });
    } catch (err) {
        console.error('Error fetching connected accounts:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * @route   POST /api/accounts/initiate-verification
 * @desc    Add a new social account for manual verification
 * @access  Private
 */
router.post('/initiate-verification', authenticate, async (req, res) => {
    // We now get all required fields directly from the request body
    const { platform, profileUrl, followersCount, username } = req.body;

    // Validate that all required fields are present
    if (!platform || !profileUrl || !username) {
        return res.status(400).json({ error: 'Platform, profile URL, and username are required.' });
    }

    try {
        // We no longer need to extract the username from the URL
        // We pass all the data directly to our model function
        const newAccount = await ConnectedAccount.createForVerification(
            req.user.id,
            platform,
            username,
            profileUrl,
            followersCount
        );

        res.status(201).json({
            message: 'Account added successfully! It will be verified soon.',
            account: newAccount
        });

    } catch (err) {
        // This provides a user-friendly error if they try to add the same account twice
        if (err.code === '23505') { // PostgreSQL unique violation error code
             return res.status(409).json({ error: `You have already connected a ${platform} account.` });
        }
        console.error('Error initiating verification:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});


/**
 * @route   DELETE /api/accounts/:id
 * @desc    Disconnect a social media account
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const accountId = parseInt(req.params.id, 10);
        if (isNaN(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID.' });
        }

        const deletedAccount = await ConnectedAccount.deleteById(accountId, req.user.id);

        if (!deletedAccount) {
            return res.status(404).json({ error: 'Account not found or you do not have permission.' });
        }

        res.json({ message: 'Account disconnected successfully.' });
    } catch (err) {
        console.error('Error disconnecting account:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});


export default router;