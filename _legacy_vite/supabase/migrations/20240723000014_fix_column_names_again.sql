-- Fix column names in products table
ALTER TABLE products
RENAME COLUMN "additionalImages" TO "additional_images";

ALTER TABLE products
RENAME COLUMN "careInstructions" TO "care_instructions";

ALTER TABLE products
RENAME COLUMN "isNew" TO "is_new";

ALTER TABLE products
RENAME COLUMN "isSoldOut" TO "is_sold_out";
