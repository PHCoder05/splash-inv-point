# AquaManager Database Setup Guide

This guide will help you set up the complete database for your AquaManager waterpark inventory management system.

## Overview

The AquaManager database consists of the following main components:

### Core Tables
- **categories** - Product categories (Pool Equipment, Safety, etc.)
- **vendors** - Supplier information
- **departments** - Organizational departments
- **people** - Staff members
- **products** - Inventory items
- **inventory_transactions** - Purchase orders and stock movements
- **usage_records** - Internal usage tracking

### Views & Functions
- **product_stock_status** - View for stock status with calculations
- **get_stock_status()** - Function to determine stock status
- **update_updated_at_column()** - Trigger function for timestamps

## Setup Instructions

### Option 1: Using Supabase (Recommended)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login and create a new project
   - Choose a region close to your users
   - Wait for the project to be ready

2. **Apply the Database Schema**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the entire contents of `database_schema.sql`
   - Execute the SQL script

3. **Configure Environment Variables**
   - Create a `.env` file in your project root
   - Add the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - You can find these values in your Supabase project settings

4. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

### Option 2: Using Local PostgreSQL

1. **Install PostgreSQL**
   - Download and install PostgreSQL from [postgresql.org](https://postgresql.org)
   - Create a new database for AquaManager

2. **Apply the Schema**
   ```bash
   psql -d your_database_name -f database_schema.sql
   ```

3. **Configure Connection**
   - Update the Supabase client configuration in `src/lib/supabase.ts`
   - Or create a custom database connection

## Database Schema Details

### Tables Structure

#### categories
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Unique)
- `description` (TEXT)
- `created_at`, `updated_at` (Timestamps)

#### vendors
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Unique)
- `contact_person`, `email`, `phone`, `address` (Contact info)
- `created_at`, `updated_at` (Timestamps)

#### departments
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Unique)
- `description` (TEXT)
- `created_at`, `updated_at` (Timestamps)

#### people
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email`, `phone` (Contact info)
- `department_id` (Foreign Key to departments)
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamps)

#### products
- `id` (UUID, Primary Key)
- `description` (VARCHAR)
- `vendor_id`, `category_id` (Foreign Keys)
- `unit` (VARCHAR)
- `rate` (DECIMAL) - Price in INR (Indian Rupees)
- `quantity`, `min_stock` (INTEGER)
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamps)

#### inventory_transactions
- `id` (UUID, Primary Key)
- `product_id` (Foreign Key to products)
- `transaction_type` (ENUM: purchase, issue, return, adjustment)
- `quantity` (INTEGER)
- `unit_price`, `total_amount` (DECIMAL) - Amounts in INR (Indian Rupees)
- `transaction_date` (DATE)
- `vendor_id`, `person_id`, `department_id` (Foreign Keys)
- `reference_number`, `notes` (TEXT)
- `created_at` (Timestamp)

#### usage_records
- `id` (UUID, Primary Key)
- `product_id` (Foreign Key to products)
- `quantity` (INTEGER)
- `person_id`, `department_id` (Foreign Keys)
- `usage_date` (DATE)
- `purpose` (TEXT)
- `created_at` (Timestamp)

### Sample Data Included

The schema includes comprehensive sample data:

- **6 Categories**: Pool Equipment, Safety, Amenities, Maintenance, Cleaning, Food & Beverage
- **6 Vendors**: AquaSupplies Inc, SafeSun Products, TextilePro, MaintenancePro, M.M Switchgear, HydroGoods
- **7 Departments**: Pool Operations, Guest Services, Safety, Recreation, Maintenance, Funworld, waterworld
- **7 People**: Staff members with department assignments
- **12 Products**: Various inventory items with realistic data
- **5 Sample Transactions**: Purchase orders with full details
- **2 Sample Usage Records**: Internal usage examples

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Public read access for demo purposes
- Authenticated users can perform all operations

### Data Integrity
- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate entries
- Check constraints validate data ranges

## Performance Optimizations

### Indexes
- Foreign key indexes for fast joins
- Date indexes for time-based queries
- Status indexes for filtering

### Views
- `product_stock_status` view for efficient stock calculations
- Pre-joined data reduces query complexity

## Usage Examples

### Get All Products with Vendor and Category
```sql
SELECT p.*, v.name as vendor_name, c.name as category_name
FROM products p
JOIN vendors v ON p.vendor_id = v.id
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;
```

### Get Low Stock Items
```sql
SELECT * FROM product_stock_status 
WHERE stock_status = 'low_stock';
```

### Get Recent Transactions
```sql
SELECT it.*, p.description, v.name as vendor_name
FROM inventory_transactions it
JOIN products p ON it.product_id = p.id
LEFT JOIN vendors v ON it.vendor_id = v.id
ORDER BY it.created_at DESC
LIMIT 10;
```

## Troubleshooting

### Common Issues

1. **Foreign Key Errors**
   - Ensure all referenced data exists before creating relationships
   - Check that UUIDs are properly formatted

2. **Permission Errors**
   - Verify RLS policies are correctly configured
   - Check user authentication status

3. **Connection Issues**
   - Verify environment variables are set correctly
   - Check network connectivity to Supabase

### Getting Help

- Check the Supabase documentation for detailed guides
- Review the SQL schema file for complete table definitions
- Use the Supabase dashboard to inspect your data

## Next Steps

After setting up the database:

1. **Test the Connection**
   - Run your application and verify data loads correctly
   - Test CRUD operations on all tables

2. **Customize the Data**
   - Add your own vendors, categories, and departments
   - Import your existing inventory data

3. **Configure Authentication**
   - Set up user authentication if needed
   - Adjust RLS policies for your security requirements

4. **Monitor Performance**
   - Use Supabase analytics to monitor query performance
   - Optimize indexes based on usage patterns

## Support

For additional help:
- Review the TypeScript types in `src/types/database.ts`
- Check the Supabase client configuration in `src/lib/supabase.ts`
- Refer to the main application code for usage examples 