-- Add sold_out column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT FALSE;

-- Create categories from products if they don't exist
CREATE OR REPLACE FUNCTION create_category_from_product()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the category exists
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = NEW.category) THEN
    -- Create the category
    INSERT INTO categories (name, slug, description)
    VALUES (
      NEW.category,
      LOWER(REPLACE(NEW.category, ' ', '-')),
      'Category created automatically from product'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create categories
DROP TRIGGER IF EXISTS create_category_trigger ON products;
CREATE TRIGGER create_category_trigger
BEFORE INSERT OR UPDATE OF category ON products
FOR EACH ROW
EXECUTE FUNCTION create_category_from_product();

-- Clean up existing data
DO $$
DECLARE
  product_record RECORD;
BEGIN
  FOR product_record IN SELECT DISTINCT category FROM products LOOP
    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = product_record.category) THEN
      INSERT INTO categories (name, slug, description)
      VALUES (
        product_record.category,
        LOWER(REPLACE(product_record.category, ' ', '-')),
        'Category created automatically from product'
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;
