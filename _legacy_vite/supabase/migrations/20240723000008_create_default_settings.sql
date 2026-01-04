-- Insert default settings if they don't exist
INSERT INTO settings (key, value, created_at, updated_at)
VALUES (
  'site_settings',
  '{
    "heroImage": "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=1200&q=80",
    "heroTitle": "Handcrafted Crochet Bags",
    "heroSubtitle": "Made with love, carried with pride",
    "companyName": "Cupid Crochy",
    "companyEmail": "hello@cupidcrochy.com",
    "companyPhone": "+880 1234 567890",
    "companyAddress": "123 Craft Street, Dhaka, Bangladesh",
    "socialLinks": {
      "facebook": "https://facebook.com",
      "instagram": "https://instagram.com",
      "twitter": "https://twitter.com"
    }
  }',
  NOW(),
  NOW()
)
ON CONFLICT (key) DO NOTHING;
