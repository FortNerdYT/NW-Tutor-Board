-- Row Level Security (RLS) Policies
-- Run this in Supabase SQL Editor to add RLS policies to existing tables

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

-- Allow service key to insert requests (bypasses teacher check)
CREATE POLICY "Service key can create requests" ON requests
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Allow teachers to insert their own requests (for client-side operations)
CREATE POLICY "Teachers can create requests" ON requests
  FOR INSERT WITH CHECK (auth.uid()::text = teacher_id::text);

-- Allow service key to update requests
CREATE POLICY "Service key can update requests" ON requests
  FOR UPDATE USING (auth.role() = 'service_role');

-- Allow teachers to update their own requests
CREATE POLICY "Teachers can update own requests" ON requests
  FOR UPDATE USING (auth.uid()::text = teacher_id::text);

-- Allow service key to delete requests
CREATE POLICY "Service key can delete requests" ON requests
  FOR DELETE USING (auth.role() = 'service_role');

-- Allow teachers to delete their own requests
CREATE POLICY "Teachers can delete own requests" ON requests
  FOR DELETE USING (auth.uid()::text = teacher_id::text);
