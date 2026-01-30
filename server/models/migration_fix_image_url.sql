-- Run this file to fix the image_url column length issue
-- Execute: psql -U postgres -d restaurant_db -f migration_fix_image_url.sql

-- Change image_url from VARCHAR(500) to TEXT to allow longer URLs
ALTER TABLE menu_items 
ALTER COLUMN image_url TYPE TEXT;

-- Verify the change
\d menu_items

-- You should see image_url type changed to 'text'
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'menu_items' AND column_name = 'image_url';