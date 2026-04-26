const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${(process.env.CLIENT_URL || 'http://localhost:5174').trim()}/login?error=auth_failed`,
    failureMessage: true
  }),
  (req, res) => {
    console.log('OAuth callback successful, redirecting to dashboard');
    res.redirect(`${(process.env.CLIENT_URL || 'http://localhost:5174').trim()}/dashboard`);
  },
  (err, req, res, next) => {
    console.error('OAuth callback error:', err);
    res.redirect(`${(process.env.CLIENT_URL || 'http://localhost:5174').trim()}/login?error=auth_failed`);
  }
);

// Get current user
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
