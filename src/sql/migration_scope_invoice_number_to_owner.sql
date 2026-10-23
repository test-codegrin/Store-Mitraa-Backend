-- Allow different shops to reuse an invoice number while keeping each shop's
-- invoice numbers unique.
ALTER TABLE invoices
    DROP INDEX invoice_number,
    ADD CONSTRAINT uq_invoices_owner_invoice_number
        UNIQUE (owner_id, invoice_number);
