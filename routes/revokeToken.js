const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { BROADCAST_ID } = process.env;

router.get('/revoke-token',async (req, res) => {
    try {
        const token = await db.getToken(BROADCAST_ID);
        const tokenParams = new URLSearchParams({
            token: token.refreshToken,
            token_hint_type: "refresh_token",
          });
        const response = await fetch(`https://id.kick.com/oauth/revoke`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: tokenParams,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        db.saveToken(
              token.id,
              token.slug,
              "Null",
              "Null",
              0,
              "Null",
              "Null"
            );

        res.json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;