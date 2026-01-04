-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT FALSE,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  care_instructions TEXT[] DEFAULT '{}',
  additional_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
DROP POLICY IF EXISTS "Public products access" ON products;
CREATE POLICY "Public products access"
  ON products FOR SELECT
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table products;
