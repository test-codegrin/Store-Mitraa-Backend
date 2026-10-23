const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const generateInvoicePDF = async (data, filePath) => {
  // Template Path
  const templatePath = path.join(
    __dirname,
    "../templates/invoice.ejs"
  );

  // Render HTML
  const html = await ejs.renderFile(templatePath, data);

  // Launch Browser
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    // Load the invoice and wait for the same Poppins font used by the frontend.
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });
    await page.evaluate(() => document.fonts.ready);

    // Size short invoices to their rendered UI instead of forcing an empty
    // A4-height page below the footer.
    const contentHeight = await page.$eval(
      ".invoice-paper",
      (element) => Math.ceil(element.getBoundingClientRect().height),
    );

    // Create Folder
    fs.mkdirSync(path.dirname(filePath), {
      recursive: true,
    });

    // Keep the A4 width used by the UI, but crop the page height to its content.
    await page.pdf({
      path: filePath,
      width: "210mm",
      height: `${contentHeight}px`,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false,
      printBackground: true,
    });
  } finally {
    await browser.close();
  }

  return filePath;
};

module.exports = generateInvoicePDF;
