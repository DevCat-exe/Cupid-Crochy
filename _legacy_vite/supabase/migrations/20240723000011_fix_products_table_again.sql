-- Fix products table structure again
ALTER TABLE products
ADD COLUMN IF NOT EXISTS isSoldOut BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make sure tags is a JSON array
ALTER TABLE products
ALTER COLUMN tags TYPE JSONB USING COALESCE(tags, '[]'::JSONB);

-- Make sure features is a JSON array
ALTER TABLE products
ALTER COLUMN features TYPE JSONB USING COALESCE(features, '[]'::JSONB);

-- Make sure careInstructions is a JSON array
ALTER TABLE products
ALTER COLUMN "careInstructions" TYPE JSONB USING COALESCE("careInstructions", '[]'::JSONB);

-- Make sure additionalImages is a JSON array
ALTER TABLE products
ALTER COLUMN "additionalImages" TYPE JSONB USING COALESCE("additionalImages", '[]'::JSONB);
