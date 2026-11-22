const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const db = require("./db");
const { getReportData, getAllOrders } = require("./report");
const { buildHtml, renderPdf } = require("./pdf");

function today() {
  return new Date().toLocaleDateString("en-CA");
}

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" })
});

app.get("/reports/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);
    
    if (!row){
        res.status(404).json({ error: "Report not found" });
    }

    res.json({ id: row.id, created_at: row.created_at, file: `/reports/${row.id}/file` });
});

app.get("/reports/:id/file", (req, res) => {
  const row = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);

    if (!row){
        res.status(404).json({ error: "Report not found" });
    }

    if(!fs.existsSync(path.join(__dirname, row.path))){
        res.status(404).json({ error: "Report not found"});
    }

    res.sendFile(path.join(__dirname, row.path));
});

app.post("/reports", async (req, res) => {
  try {
    const info = db.prepare("INSERT INTO reports (path, created_at) VALUES (?, ?)").run("", today());
    const id = Number(info.lastInsertRowid);
    const filePath = `reports/${id}.pdf`;

    const { force } = req.body ?? {};

    if (!force) {
        const created_at = today();
        const row = db.prepare("SELECT * FROM reports WHERE created_at = ? ORDER BY id DESC LIMIT 1").get(today());
        if (row) {
            return res.status(200).json({ id: row.id, file: `/reports/${row.id}/file` })
        }
    }

    try {
        const data = getReportData();
        const orders = getAllOrders();
        const html = buildHtml(data, orders);
        await renderPdf(html, path.join(__dirname, filePath));;
    } catch (err) {
        db.prepare("DELETE FROM reports WHERE id = ?").run(id);
        throw err;
    }
    
    db.prepare("UPDATE reports SET path = ? WHERE id = ?").run(filePath, id);
    res.status(201).json({ id, file: `/reports/${id}/file` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate the report" });
  }
});

app.listen(3000, () => {
    console.log("Server is up and running!")
});