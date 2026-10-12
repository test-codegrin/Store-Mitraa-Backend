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
