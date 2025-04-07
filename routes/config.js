const express = require('express');
const router = express.Router();

router.get('/client-config', (req, res) => {
  res.json({
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  });
});

module.exports = router;