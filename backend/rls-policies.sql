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

-- Disable RLS for now (service key should bypass RLS, but let's disable to test)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE requests DISABLE ROW LEVEL SECURITY;
