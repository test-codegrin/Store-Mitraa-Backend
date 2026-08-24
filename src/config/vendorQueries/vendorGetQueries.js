const vendorGetQueries = {
  getAllVendors: `
    SELECT *
    FROM vendors
    WHERE owner_id = ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `,

  getVendorsCount: `
    SELECT COUNT(*) AS total
    FROM vendors
    WHERE owner_id = ?
  `,

  getVendorById: `
    SELECT *
    FROM vendors
    WHERE id = ? AND owner_id = ?
  `,

  getVendorDashboard: `
SELECT
(
    SELECT COUNT(*)
    FROM vendors
    WHERE owner_id = ?
      AND status = 'Active'
) AS active_partners,

(
    SELECT IFNULL(SUM(total_amount), 0)
    FROM vendor_bills
    WHERE owner_id = ?
) AS total_bills,

(
    SELECT COUNT(*)
    FROM vendor_bills
    WHERE owner_id = ?
      AND status IN ('Pending','Partial')
) AS pending_bills
`,

  getVendorDetailsDashboard: `
SELECT
(
    SELECT IFNULL(SUM(remaining_amount), 0)
    FROM vendor_bills
    WHERE owner_id = ?
      AND vendor_id = ?
) AS total_outstanding,

(
    SELECT COUNT(*)
    FROM vendor_bills
    WHERE owner_id = ?
      AND vendor_id = ?
      AND status IN ('Pending','Partial')
) AS pending_bills
`,

  // Top 3 vendors jinka bill regularly aata hai (higher bill_count = zyada regular)
  // INNER JOIN se zero-bill vendors khud hi exclude ho jaate hain
 getTopRegularVendors: `
  SELECT
    v.id,
    v.vendor_company_name,
    v.display_name,
    v.contact_person,
    v.phone,
    v.email,
    v.status,

    COUNT(DISTINCT vb.id) AS total_bills,

    COUNT(
      DISTINCT CASE
        WHEN payment_summary.total_paid >= vb.total_amount
         AND payment_summary.last_payment_date <= vb.due_date
        THEN vb.id
      END
    ) AS on_time_bills,

    IFNULL(SUM(vb.total_amount), 0) AS total_billed,

    MAX(vb.bill_date) AS last_bill_date

  FROM vendors v

  INNER JOIN vendor_bills vb
    ON vb.vendor_id = v.id
    AND vb.owner_id = v.owner_id

  INNER JOIN (
    SELECT
      vendor_bill_id,
      owner_id,
      SUM(amount) AS total_paid,
      MAX(payment_date) AS last_payment_date
    FROM vendor_bill_payments
    GROUP BY vendor_bill_id, owner_id
  ) AS payment_summary
    ON payment_summary.vendor_bill_id = vb.id
    AND payment_summary.owner_id = vb.owner_id

  WHERE v.owner_id = ?

  GROUP BY
    v.id,
    v.vendor_company_name,
    v.display_name,
    v.contact_person,
    v.phone,
    v.email,
    v.status

  HAVING
    COUNT(
      DISTINCT CASE
        WHEN payment_summary.total_paid >= vb.total_amount
         AND payment_summary.last_payment_date <= vb.due_date
        THEN vb.id
      END
    ) > 0

  ORDER BY
    (
      COUNT(
        DISTINCT CASE
          WHEN payment_summary.total_paid >= vb.total_amount
           AND payment_summary.last_payment_date <= vb.due_date
          THEN vb.id
        END
      ) / COUNT(DISTINCT vb.id)
    ) DESC,

    COUNT(
      DISTINCT CASE
        WHEN payment_summary.total_paid >= vb.total_amount
         AND payment_summary.last_payment_date <= vb.due_date
        THEN vb.id
      END
    ) DESC,

    MAX(vb.bill_date) DESC

  LIMIT 3
`,
};

module.exports = vendorGetQueries;