const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supabase = require('../config/supabase');

// Update user role
router.patch('/role', authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's requests (teachers)
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can view their requests' });
    }

    const { data: requests, error } = await supabase
      .from('requests')
      .select('*')
      .eq('teacher_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
