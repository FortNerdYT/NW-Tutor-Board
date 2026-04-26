const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supabase = require('../config/supabase');

// Get all requests (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = supabase
      .from('requests')
      .select(`
        *,
        users!requests_teacher_id_fkey (
          name,
          email
        )
      `)
      .eq('is_filled', false)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: requests, error } = await query;

    if (error) throw error;

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single request
router.get('/:id', async (req, res) => {
  try {
    const { data: request, error } = await supabase
      .from('requests')
      .select(`
        *,
        users!requests_teacher_id_fkey (
          name,
          email
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create request (teachers only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Create request - User:', req.user);
    console.log('Create request - Body:', req.body);

    if (req.user.role !== 'teacher') {
      console.log('User is not a teacher:', req.user.role);
      return res.status(403).json({ error: 'Only teachers can create requests' });
    }

    const {
      title,
      category,
      description,
      student_requirements,
      min_grade,
      clubs,
      class_taken,
      start_date,
      end_date,
      is_ongoing,
      contact_method,
      contact_instructions
    } = req.body;

    const { data: request, error } = await supabase
      .from('requests')
      .insert({
        teacher_id: req.user.id,
        title,
        category,
        description,
        student_requirements,
        min_grade,
        clubs,
        class_taken,
        start_date: start_date || null,
        end_date: end_date || null,
        is_ongoing: is_ongoing || false,
        contact_method: contact_method || req.user.email,
        contact_instructions
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Request created successfully:', request);
    res.status(201).json(request);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update request (owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existingRequest, error: fetchError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    if (existingRequest.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own requests' });
    }

    const { data: request, error } = await supabase
      .from('requests')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete request (owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existingRequest, error: fetchError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    if (existingRequest.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own requests' });
    }

    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as filled (owner only)
router.patch('/:id/filled', authMiddleware, async (req, res) => {
  try {
    const { data: existingRequest, error: fetchError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    if (existingRequest.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only mark your own requests' });
    }

    const { data: request, error } = await supabase
      .from('requests')
      .update({ is_filled: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
