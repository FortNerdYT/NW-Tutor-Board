-- Row Level Security (RLS) Policies
-- Run this in Supabase SQL Editor to add RLS policies to existing tables

-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Service key can manage users" ON users;
DROP POLICY IF EXISTS "Unfilled requests are viewable by everyone" ON requests;
DROP POLICY IF EXISTS "Service key can create requests" ON requests;
DROP POLICY IF EXISTS "Teachers can create requests" ON requests;
DROP POLICY IF EXISTS "Service key can update requests" ON requests;
DROP POLICY IF EXISTS "Teachers can update own requests" ON requests;
DROP POLICY IF EXISTS "Service key can delete requests" ON requests;
DROP POLICY IF EXISTS "Teachers can delete own requests" ON requests;

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
-- Allow anyone to read users (for displaying request authors)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Allow service key to insert/update users (for OAuth)
CREATE POLICY "Service key can manage users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Requests RLS policies
-- Allow anyone to read unfilled requests
CREATE POLICY "Unfilled requests are viewable by everyone" ON requests
  FOR SELECT USING (is_filled = false);

-- Allow service key full access to requests (backend uses service key)
CREATE POLICY "Service key can manage requests" ON requests
  FOR ALL USING (auth.role() = 'service_role');
