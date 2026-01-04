-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  city TEXT,
  notes TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Processing',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
DROP POLICY IF EXISTS "Authenticated users can read orders";
CREATE POLICY "Authenticated users can read orders"
ON orders FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can insert orders";
CREATE POLICY "Anyone can insert orders"
ON orders FOR INSERT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can update orders";
CREATE POLICY "Authenticated users can update orders"
ON orders FOR UPDATE
TO authenticated
USING (true);

-- Create policies for order items
DROP POLICY IF EXISTS "Authenticated users can read order items";
CREATE POLICY "Authenticated users can read order items"
ON order_items FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can insert order items";
CREATE POLICY "Anyone can insert order items"
ON order_items FOR INSERT
USING (true);

-- Enable realtime
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;