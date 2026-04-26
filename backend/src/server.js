require('dotenv').config();

console.log('Starting server...');
console.log('Environment check:', {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  SESSION_SECRET: process.env.SESSION_SECRET ? 'SET' : 'NOT SET',
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET'
});

try {
  const express = require('express');
  const cors = require('cors');
  const passport = require('passport');
  const path = require('path');
  const authRoutes = require('./routes/auth');
  const requestRoutes = require('./routes/requests');
  const userRoutes = require('./routes/users');
  const adminRoutes = require('./routes/admin');
  
  console.log('All modules loaded successfully');

const app = express();

// Middleware
app.use(cors({
  origin: (process.env.CLIENT_URL || 'http://localhost:5173').trim(),
  credentials: true
}));
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Passport setup (without session)
app.use(passport.initialize());
require('./config/passport');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tutor Board API is running' });
});

// Serve frontend for all non-API routes (GET only)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

} catch (error) {
  console.error('Server startup error:', error);
  process.exit(1);
}
