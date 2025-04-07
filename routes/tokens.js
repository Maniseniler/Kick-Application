const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { BROADCAST_ID } = process.env;

router.get('/my-token',async (req, res) => {
    try {
        const token = await db.getToken(BROADCAST_ID);
        if (!token) return res.status(404).json({ error: 'Token not found' });
        
        // Only send non-sensitive info to frontend
        res.json(token);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;