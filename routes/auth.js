const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../models/database');

const ENDPOINT = {
  authURL: "https://id.kick.com/oauth/authorize",
  tokenURL: "https://id.kick.com/oauth/token",
  API: "https://api.kick.com/public/v1"
};

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
const SCOPES = ['user:read', 'channel:read', 'channel:write', 'chat:write', 'streamkey:read', 'events:subscribe'];

function generateCodeVerifier() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString("base64url");
}

function generateCodeChallenge(verifier) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return hash.toString("base64url");
}

router.get('/kick', (req, res) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = Buffer.from(JSON.stringify({ codeVerifier })).toString("base64");

  req.session.authState = state;
  req.session.codeVerifier = codeVerifier;

  const authParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",  
  });

  res.redirect(`${ENDPOINT.authURL}?${authParams.toString()}`);
});

router.get('/kick/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) return res.status(400).json({ error: "Missing authorization code or state" });

  try {
    if (state !== req.session.authState) {
      throw new Error("Invalid state parameter");
    }

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: req.session.codeVerifier,
    });

    const tokenResponse = await fetch(ENDPOINT.tokenURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams,
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error("Failed to obtain access token");
    }

    const userResponse = await fetch(ENDPOINT.API + "/channels", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      },
    });

    const userData = await userResponse.json();
    const channel = userData.data[(userData.data.length) - 1];

    db.saveToken(
      channel.broadcaster_user_id,
      channel.slug,
      tokenData.access_token,
      tokenData.refresh_token,
      tokenData.expires_in,
      tokenData.scope,
      tokenData.token_type
    );

    // Store in session
    req.session.authenticated = true;
    req.session.userId = channel.broadcaster_user_id;
    req.session.channelSlug = channel.slug;

    res.redirect('/');
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
