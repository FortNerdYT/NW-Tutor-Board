const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/admin');
const supabase = require('../config/supabase');

// Verify admin password
router.post('/verify', adminMiddleware, (req, res) => {
  res.json({ success: true });
});

// Import emails to set as teachers
router.post('/import-teachers', adminMiddleware, async (req, res) => {
  try {
    const { emails } = req.body;
    
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'Invalid emails format' });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const email of emails) {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) continue;

      try {
        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('email', trimmedEmail)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // Error other than "not found"
          results.failed.push({ email: trimmedEmail, error: fetchError.message });
          continue;
        }

        if (existingUser) {
          // Update existing user to teacher
          const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'teacher' })
            .eq('email', trimmedEmail);

          if (updateError) {
            results.failed.push({ email: trimmedEmail, error: updateError.message });
          } else {
            results.success.push({ email: trimmedEmail, action: 'updated' });
          }
        } else {
          // Create new user as teacher (they'll need to login via OAuth)
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              email: trimmedEmail,
              role: 'teacher',
              name: trimmedEmail.split('@')[0] // Default name from email
            });

          if (insertError) {
            results.failed.push({ email: trimmedEmail, error: insertError.message });
          } else {
            results.success.push({ email: trimmedEmail, action: 'created' });
          }
        }
      } catch (error) {
        results.failed.push({ email: trimmedEmail, error: error.message });
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for admin view)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
