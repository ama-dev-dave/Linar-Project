-- Create database
-- CREATE DATABASE restaurant_db;

-- Connect to the database
-- \c restaurant_db;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name) VALUES 
    ('Appetizers'),
    ('Main Course'),
    ('Drinks'),
    ('Desserts')
ON CONFLICT (name) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, is_available) VALUES
    (1, 'Chicken Wings', 'Crispy chicken wings with BBQ sauce', 8.99, 'https://via.placeholder.com/300x200?text=Chicken+Wings', true),
    (1, 'Mozzarella Sticks', 'Fried mozzarella with marinara sauce', 6.99, 'https://via.placeholder.com/300x200?text=Mozzarella+Sticks', true),
    (2, 'Grilled Salmon', 'Fresh salmon with lemon butter sauce', 18.99, 'https://via.placeholder.com/300x200?text=Grilled+Salmon', true),
    (2, 'Beef Burger', 'Juicy beef patty with cheese and vegetables', 12.99, 'https://via.placeholder.com/300x200?text=Beef+Burger', true),
    (2, 'Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 14.99, 'https://via.placeholder.com/300x200?text=Pasta+Carbonara', true),
    (3, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'https://via.placeholder.com/300x200?text=Orange+Juice', true),
    (3, 'Iced Coffee', 'Cold brew coffee with ice', 3.99, 'https://via.placeholder.com/300x200?text=Iced+Coffee', true),
    (4, 'Chocolate Cake', 'Rich chocolate cake with ganache', 6.99, 'https://via.placeholder.com/300x200?text=Chocolate+Cake', true),
    (4, 'Cheesecake', 'New York style cheesecake', 7.99, 'https://via.placeholder.com/300x200?text=Cheesecake', true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);