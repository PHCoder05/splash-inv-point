-- AquaManager Database Schema
-- Waterpark Inventory Management System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('purchase', 'issue', 'return', 'adjustment');
CREATE TYPE stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL UNIQUE,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- People table (staff members)
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255) NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    unit VARCHAR(20) NOT NULL,
    rate DECIMAL(10,2) NOT NULL DEFAULT 0, -- Price in INR (Indian Rupees)
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory transactions table
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    transaction_type transaction_type NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2), -- Price per unit in INR
    total_amount DECIMAL(10,2), -- Total amount in INR
    transaction_date DATE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage records table
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    usage_date DATE NOT NULL,
    purpose TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_usage_records_product ON usage_records(product_id);
CREATE INDEX idx_usage_records_date ON usage_records(usage_date);
CREATE INDEX idx_usage_records_person ON usage_records(person_id);
CREATE INDEX idx_usage_records_department ON usage_records(department_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get stock status
CREATE OR REPLACE FUNCTION get_stock_status(product_quantity INTEGER, product_min_stock INTEGER)
RETURNS stock_status AS $$
BEGIN
    IF product_quantity = 0 THEN
        RETURN 'out_of_stock';
    ELSIF product_quantity <= product_min_stock THEN
        RETURN 'low_stock';
    ELSE
        RETURN 'in_stock';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a view for product stock status
CREATE VIEW product_stock_status AS
SELECT 
    p.id,
    p.description,
    p.quantity,
    p.min_stock,
    p.unit,
    p.rate,
    get_stock_status(p.quantity, p.min_stock) as stock_status,
    c.name as category,
    v.name as vendor,
    p.created_at,
    p.updated_at
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN vendors v ON p.vendor_id = v.id
WHERE p.is_active = true;

-- Insert sample data

-- Categories
INSERT INTO categories (name, description) VALUES
('Pool Equipment', 'Equipment used in pool operations'),
('Safety', 'Safety equipment and supplies'),
('Amenities', 'Guest amenities and comfort items'),
('Maintenance', 'Maintenance and repair supplies'),
('Cleaning', 'Cleaning supplies and chemicals'),
('Food & Beverage', 'Food and beverage supplies');

-- Vendors
INSERT INTO vendors (name, contact_person, email, phone, address) VALUES
('AquaSupplies Inc', 'John Smith', 'john@aquasupplies.com', '+1-555-0101', '123 Water Street, Pool City, PC 12345'),
('SafeSun Products', 'Sarah Johnson', 'sarah@safesun.com', '+1-555-0102', '456 Safety Ave, Sun City, SC 67890'),
('TextilePro', 'Mike Wilson', 'mike@textilepro.com', '+1-555-0103', '789 Fabric Road, Textile Town, TT 11111'),
('MaintenancePro', 'Lisa Chen', 'lisa@maintenancepro.com', '+1-555-0104', '321 Tool Street, Repair City, RC 22222'),
('M.M Switchgear', 'Vikrant', 'vikrant@mmswitchgear.com', '+1-555-0105', '654 Electrical Ave, Power City, PC 33333'),
('HydroGoods', 'David Thompson', 'david@hydrogoods.com', '+1-555-0106', '987 Liquid Lane, Water Town, WT 44444');

-- Departments
INSERT INTO departments (name, description) VALUES
('Pool Operations', 'Manages pool operations and maintenance'),
('Guest Services', 'Handles guest relations and services'),
('Safety', 'Oversees safety protocols and equipment'),
('Recreation', 'Manages recreational activities'),
('Maintenance', 'Handles facility maintenance'),
('Funworld', 'Manages fun world attractions'),
('waterworld', 'Manages water world attractions');

-- People
INSERT INTO people (name, email, phone, department_id) VALUES
('John Smith', 'john.smith@aquamanager.com', '+1-555-0201', (SELECT id FROM departments WHERE name = 'Pool Operations')),
('Sarah Johnson', 'sarah.johnson@aquamanager.com', '+1-555-0202', (SELECT id FROM departments WHERE name = 'Guest Services')),
('Mike Wilson', 'mike.wilson@aquamanager.com', '+1-555-0203', (SELECT id FROM departments WHERE name = 'Safety')),
('Lisa Chen', 'lisa.chen@aquamanager.com', '+1-555-0204', (SELECT id FROM departments WHERE name = 'Maintenance')),
('Vikrant', 'vikrant@aquamanager.com', '+1-555-0205', (SELECT id FROM departments WHERE name = 'Funworld')),
('David Thompson', 'david.thompson@aquamanager.com', '+1-555-0206', (SELECT id FROM departments WHERE name = 'waterworld')),
('Maria Garcia', 'maria.garcia@aquamanager.com', '+1-555-0207', (SELECT id FROM departments WHERE name = 'Recreation'));

-- Products
INSERT INTO products (description, vendor_id, category_id, unit, rate, quantity, min_stock) VALUES
('Pool Noodles', 
 (SELECT id FROM vendors WHERE name = 'AquaSupplies Inc'),
 (SELECT id FROM categories WHERE name = 'Pool Equipment'),
 'PCS', 5.99, 150, 50),

('Sunscreen SPF 50',
 (SELECT id FROM vendors WHERE name = 'SafeSun Products'),
 (SELECT id FROM categories WHERE name = 'Safety'),
 'BTL', 12.99, 45, 20),

('Pool Towels',
 (SELECT id FROM vendors WHERE name = 'TextilePro'),
 (SELECT id FROM categories WHERE name = 'Amenities'),
 'PCS', 15.99, 80, 30),

('Pool Floats',
 (SELECT id FROM vendors WHERE name = 'AquaSupplies Inc'),
 (SELECT id FROM categories WHERE name = 'Pool Equipment'),
 'PCS', 25.99, 12, 15),

('Water Slides Maintenance Kit',
 (SELECT id FROM vendors WHERE name = 'MaintenancePro'),
 (SELECT id FROM categories WHERE name = 'Maintenance'),
 'KIT', 89.99, 5, 3),

('16" Wall Fan CG',
 (SELECT id FROM vendors WHERE name = 'M.M Switchgear'),
 (SELECT id FROM categories WHERE name = 'Maintenance'),
 'NOS', 1950.00, 5, 2),

('400mm x 7.6mm Cable Ties',
 (SELECT id FROM vendors WHERE name = 'M.M Switchgear'),
 (SELECT id FROM categories WHERE name = 'Maintenance'),
 'PKT', 390.00, 6, 3),

('530mm X 7.6mm Cable Ties',
 (SELECT id FROM vendors WHERE name = 'M.M Switchgear'),
 (SELECT id FROM categories WHERE name = 'Maintenance'),
 'PKT', 525.00, 2, 2),

('LED Rope Light Serial Set',
 (SELECT id FROM vendors WHERE name = 'M.M Switchgear'),
 (SELECT id FROM categories WHERE name = 'Maintenance'),
 'BOX', 8675.00, 3, 1),

('Spare Adaptor for LED Rope',
 (SELECT id FROM vendors WHERE name = 'M.M Switchgear'),
 (SELECT id FROM categories WHERE name = 'Maintenance'),
 'NOS', 180.00, 4, 2),

('Water Bottle',
 (SELECT id FROM vendors WHERE name = 'HydroGoods'),
 (SELECT id FROM categories WHERE name = 'Food & Beverage'),
 'PCS', 3.99, 200, 50),

('Pool Cleaning Chemicals',
 (SELECT id FROM vendors WHERE name = 'AquaSupplies Inc'),
 (SELECT id FROM categories WHERE name = 'Cleaning'),
 'LTR', 45.99, 25, 10);

-- Sample inventory transactions (purchases)
INSERT INTO inventory_transactions (product_id, transaction_type, quantity, unit_price, total_amount, transaction_date, vendor_id, person_id, reference_number, notes) VALUES
((SELECT id FROM products WHERE description = '16" Wall Fan CG'), 'purchase', 5, 1950.00, 9750.00, '2025-01-04', (SELECT id FROM vendors WHERE name = 'M.M Switchgear'), (SELECT id FROM people WHERE name = 'Vikrant'), 'PO-001', 'Initial stock purchase'),
((SELECT id FROM products WHERE description = '400mm x 7.6mm Cable Ties'), 'purchase', 6, 390.00, 2340.00, '2025-01-04', (SELECT id FROM vendors WHERE name = 'M.M Switchgear'), (SELECT id FROM people WHERE name = 'Vikrant'), 'PO-002', 'Initial stock purchase'),
((SELECT id FROM products WHERE description = '530mm X 7.6mm Cable Ties'), 'purchase', 2, 525.00, 1050.00, '2025-02-04', (SELECT id FROM vendors WHERE name = 'M.M Switchgear'), (SELECT id FROM people WHERE name = 'Vikrant'), 'PO-003', 'Additional stock'),
((SELECT id FROM products WHERE description = 'LED Rope Light Serial Set'), 'purchase', 3, 8675.00, 26025.00, '2025-04-04', (SELECT id FROM vendors WHERE name = 'M.M Switchgear'), (SELECT id FROM people WHERE name = 'Vikrant'), 'PO-004', 'Lighting upgrade'),
((SELECT id FROM products WHERE description = 'Spare Adaptor for LED Rope'), 'purchase', 4, 180.00, 720.00, '2025-04-04', (SELECT id FROM vendors WHERE name = 'M.M Switchgear'), (SELECT id FROM people WHERE name = 'Vikrant'), 'PO-005', 'Spare parts');

-- Sample usage records
INSERT INTO usage_records (product_id, quantity, person_id, department_id, usage_date, purpose) VALUES
((SELECT id FROM products WHERE description = '16" Wall Fan CG'), 2, (SELECT id FROM people WHERE name = 'Vikrant'), (SELECT id FROM departments WHERE name = 'Funworld'), '2025-04-02', 'Staff dining area cooling'),
((SELECT id FROM products WHERE description = '400mm x 7.6mm Cable Ties'), 1, (SELECT id FROM people WHERE name = 'Vikrant'), (SELECT id FROM departments WHERE name = 'waterworld'), '2025-04-03', 'Rain dance area maintenance');

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for demo purposes)
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Allow public read access to departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to people" ON people FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to inventory_transactions" ON inventory_transactions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to usage_records" ON usage_records FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage vendors" ON vendors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage departments" ON departments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage people" ON people FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage inventory_transactions" ON inventory_transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage usage_records" ON usage_records FOR ALL USING (auth.role() = 'authenticated'); 