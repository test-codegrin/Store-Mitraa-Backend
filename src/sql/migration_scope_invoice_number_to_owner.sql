-- Allow different shops to reuse an invoice number while keeping each shop's
-- invoice numbers unique.
ALTER TABLE invoices
    DROP INDEX invoice_number,
    ADD CONSTRAINT uq_invoices_owner_invoice_number
        UNIQUE (owner_id, invoice_number);



-- Optional: Allow customers to have optional / nullable phone numbers in Create Invoice
-- Run this manually only if your `customers` table currently enforces NOT NULL on phone_number:
ALTER TABLE customers MODIFY phone_number VARCHAR(20) NULL;
