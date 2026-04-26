-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requests table
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('tutoring', 'lab_help', 'organization', 'tech_help', 'other')),
  description TEXT NOT NULL,
  student_requirements TEXT,
  min_grade VARCHAR(10),
  clubs TEXT,
  class_taken VARCHAR(255),
  start_date DATE,
  end_date DATE,
  is_ongoing BOOLEAN DEFAULT false,
  contact_method VARCHAR(255),
  contact_instructions TEXT,
  is_filled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_requests_teacher_id ON requests(teacher_id);
CREATE INDEX idx_requests_category ON requests(category);
CREATE INDEX idx_requests_created_at ON requests(created_at);
CREATE INDEX idx_users_email ON users(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
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
