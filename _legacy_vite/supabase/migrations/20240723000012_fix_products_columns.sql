-- Fix products table columns
ALTER TABLE products
ADD COLUMN IF NOT EXISTS "additional_images" JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "features" JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "care_instructions" JSONB DEFAULT '[]'::jsonb;
