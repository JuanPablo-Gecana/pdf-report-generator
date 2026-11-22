const { getReportData, getAllOrders } = require("./report");
const { buildHtml, renderPdf } = require("./pdf");

async function main() {
  const data = getReportData();
  const orders = getAllOrders();
  const html = buildHtml(data, orders);
  await renderPdf(html, "reports/test.pdf")
  console.log("PDF created at reports/test.pdf");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});