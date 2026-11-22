const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

function buildHtml(data, orders) {
    return `<style>
                tr { break-inside: avoid; }
            </style>
            <h1>Sales Report on ${new Date().toLocaleDateString("en-CA")}</h1>
            <p>Total Orders: ${data.totalOrders}</p>
            <p>Total Revenue: ${data.totalRevenue}</p>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.topProducts.map(p => `<tr><td>${p.product}</td><td>${p.revenue}</td></tr>`).join('')}
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>customer</th>
                        <th>product</th>
                        <th>amount</th>
                        <th>created_at</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(o => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.product}</td><td>${o.amount}</td><td>${o.created_at}</td></tr>`).join('')}
                </tbody>
            </table>`
}

async function renderPdf(html, outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const browser = await chromium.launch();
    try { 
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({ path: outputPath, format: 'A4', printBackground: true }); 
    } finally { 
        await browser.close(); 
    };
    
}

module.exports = { buildHtml, renderPdf };