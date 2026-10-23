const invoiceDeleteQueries = {
  getInvoice: `
    SELECT
      id,
      pdf_path
    FROM invoices
    WHERE id = ?
    AND owner_id = ?
    FOR UPDATE
  `,

  getInvoiceItems: `
    SELECT
      product_id,
      quantity
    FROM invoice_items
    WHERE invoice_id = ?
  `,

  updateProductStock: `
    UPDATE products
    SET stock_quantity = stock_quantity + ?
    WHERE id = ?
    AND owner_id = ?
  `,

  deleteInvoice: `
    DELETE FROM invoices
    WHERE id = ?
    AND owner_id = ?
  `,
};

module.exports = invoiceDeleteQueries;
