require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const session = require('express-session');
const path = require('path');

const app = express();

// Constants
const { SESSION_SECRET = crypto.randomBytes(32).toString('hex'), PORT = 3000 } = process.env;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', require('./routes/auth'));

const tokenRoutes = require('./routes/tokens');
app.use('/api', tokenRoutes);

const refreshTokenRoutes = require('./routes/refreshToken');
app.use('/api', refreshTokenRoutes);

const configRoutes = require('./routes/config');
app.use('/api', configRoutes);

// Frontend route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OAuth URL: http://localhost:${PORT}/auth/kick`);
  console.log(`Session secret: ${SESSION_SECRET.substring(0, 10)}...`);
  console.log(``);
});