const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { CLIENT_ID,CLIENT_SECRET,BROADCAST_ID } = process.env;

router.get('/refresh-token',async (req, res) => {
    try {
        const token = await db.getToken(BROADCAST_ID);
        const tokenParams = new URLSearchParams({
            refresh_token: token.refreshToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "refresh_token",
          });
        const response = await fetch(`https://id.kick.com/oauth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: tokenParams,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const refreahToken =  await response.json()
        db.saveToken(
              token.id,
              token.slug,
              refreahToken.access_token,
              refreahToken.refresh_token,
              refreahToken.expires_in,
              refreahToken.scope,
              refreahToken.token_type
            );

        res.json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;