const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'your-secret-key';

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${(process.env.CLIENT_URL || 'http://localhost:5174').trim()}/login?error=auth_failed`,
    failureMessage: true,
    session: false
  }),
  (req, res) => {
    console.log('OAuth callback successful, generating JWT');
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, name: req.user.name, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${(process.env.CLIENT_URL || 'http://localhost:5174').trim()}/dashboard?token=${token}`);
  },
  (err, req, res, next) => {
    console.error('OAuth callback error:', err);
    res.redirect(`${(process.env.CLIENT_URL || 'http://localhost:5174').trim()}/login?error=auth_failed`);
  }
);

// Get current user
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
