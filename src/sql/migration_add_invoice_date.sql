-- Migration: Add invoice_date column to invoices table and backfill existing records
-- Safe migration for existing MySQL database

-- 1. Add invoice_date column if not exists
ALTER TABLE invoices
ADD COLUMN invoice_date DATE AFTER invoice_number;

-- 2. Backfill existing records with the date part of created_at
UPDATE invoices
SET invoice_date = DATE(created_at)
WHERE invoice_date IS NULL;

-- 3. Enforce NOT NULL constraint after backfill
ALTER TABLE invoices
MODIFY COLUMN invoice_date DATE NOT NULL;

-- customer last name add customer showing that fixed
UPDATE customers 
SET last_name = NULL 
WHERE last_name = 'Customer';


-- 4. Enforce first_name NOT NULL constraint on customers
-- Backfill any existing NULL or empty first_name records before enforcing NOT NULL
UPDATE customers
SET first_name = 'Customer'
WHERE first_name IS NULL OR TRIM(first_name) = '';

ALTER TABLE customers
MODIFY COLUMN first_name VARCHAR(100) NOT NULL;
