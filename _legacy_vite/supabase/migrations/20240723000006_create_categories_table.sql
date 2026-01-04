-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Anyone can read categories";
CREATE POLICY "Anyone can read categories"
ON categories FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage categories";
CREATE POLICY "Authenticated users can manage categories"
ON categories FOR ALL
TO authenticated
USING (true);

-- Enable realtime
alter publication supabase_realtime add table categories;

-- Add default categories
INSERT INTO categories (name, slug, description)
VALUES 
('Tote', 'tote', 'Spacious bags with two parallel handles'),
('Crossbody', 'crossbody', 'Bags worn across the body with a long strap'),
('Bucket', 'bucket', 'Cylindrical shaped bags with a drawstring closure'),
('Clutch', 'clutch', 'Small handheld bags without handles'),
('Shoulder', 'shoulder', 'Bags carried on the shoulder with medium-length straps'),
('Handbag', 'handbag', 'General purpose bags with handles')
ON CONFLICT (name) DO NOTHING;