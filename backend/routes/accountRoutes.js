import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { ConnectedAccount } from '../models/ConnectedAccount.js';

const router = express.Router();

// GET all connected accounts for the logged-in user
router.get('/', authenticate, async (req, res) => {
    try {
        const accounts = await ConnectedAccount.findByUserId(req.user.id);
        res.json({ accounts });
    } catch (err) {
        console.error('Error fetching connected accounts:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST a new account for verification
router.post('/initiate-verification', authenticate, async (req, res) => {
    const { platform, profileUrl, followersCount, username } = req.body;

    if (!platform || !profileUrl || !username) {
        return res.status(400).json({ error: 'Platform, profile URL, and username are required.' });
    }

    const followers = parseInt(followersCount, 10);
    if (isNaN(followers) || followers < 0) {
        return res.status(400).json({ error: 'Please enter a valid, positive follower count.' });
    }

    try {
        const newAccount = await ConnectedAccount.createForVerification(
            req.user.id,
            platform,
            username,
            profileUrl,
            followers
        );

        res.status(201).json({
            message: 'Account added successfully! It will be verified soon.',
            account: newAccount
        });

    } catch (err) {
        if (err.code === '23505') { // Handles duplicate account error
            return res.status(409).json({ error: `You have already connected a ${platform} account.` });
        }
        console.error('Error initiating verification:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE a connected account
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