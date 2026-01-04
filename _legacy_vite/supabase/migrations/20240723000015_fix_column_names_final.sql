-- Fix column names in products table to ensure consistency
ALTER TABLE products DROP COLUMN IF EXISTS "additionalImages";
ALTER TABLE products DROP COLUMN IF EXISTS "careInstructions";
ALTER TABLE products DROP COLUMN IF EXISTS "isNew";
ALTER TABLE products DROP COLUMN IF EXISTS "isSoldOut";

ALTER TABLE products ADD COLUMN IF NOT EXISTS "additional_images" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "care_instructions" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "is_new" BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "is_sold_out" BOOLEAN DEFAULT false;
