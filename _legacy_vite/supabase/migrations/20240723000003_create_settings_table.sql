CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can read settings";
CREATE POLICY "Authenticated users can read settings"
ON settings FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can update settings";
CREATE POLICY "Authenticated users can update settings"
ON settings FOR UPDATE
TO authenticated
USING (true);

-- Enable realtime
alter publication supabase_realtime add table settings;

-- Insert default settings
INSERT INTO settings (key, value)
VALUES 
('site_settings', '{"heroImage": "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=1200&q=80", "heroTitle": "Handcrafted Crochet Bags", "heroSubtitle": "Made with love, carried with pride", "companyName": "Cupid Crochy", "companyEmail": "hello@cupidcrochy.com", "companyPhone": "+880 1234 567890", "companyAddress": "123 Craft Street, Dhaka, Bangladesh", "socialLinks": {"facebook": "https://facebook.com", "instagram": "https://instagram.com", "twitter": "https://twitter.com"}}')
ON CONFLICT (key) DO NOTHING;