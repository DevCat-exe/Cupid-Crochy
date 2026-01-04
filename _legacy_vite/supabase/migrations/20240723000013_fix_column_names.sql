-- Fix column names in products table
ALTER TABLE products
RENAME COLUMN "is_new" TO "isNew";

ALTER TABLE products
RENAME COLUMN "is_sold_out" TO "isSoldOut";

ALTER TABLE products
RENAME COLUMN "additional_images" TO "additionalImages";

ALTER TABLE products
RENAME COLUMN "care_instructions" TO "careInstructions";
