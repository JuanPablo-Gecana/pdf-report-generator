const db = require('./db');

function getReportData() {
    const totalOrders = db.prepare("SELECT COUNT(*) AS total FROM orders").get().total;

    const totalRevenue = db.prepare("SELECT ROUND(SUM(amount), 2) AS total FROM orders").get().total;

    const topProducts = db.prepare("SELECT product, ROUND(SUM(amount), 2) AS revenue FROM orders GROUP BY product ORDER BY revenue DESC LIMIT 5").all();

    const ordersPerDay = db.prepare("SELECT created_at, COUNT(*) AS orders FROM orders WHERE created_at >= date('now', '-6 days') GROUP BY created_at ORDER BY created_at").all();

    return { totalOrders, totalRevenue, topProducts, ordersPerDay};
}

module.exports = { getReportData };