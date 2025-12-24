const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

// Multer: store files directly in memory as buffer
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
    origin: "http://127.0.0.1:3691", //make sure port code as same as live server port code
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// Only keep body parsers for non-file routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ABDC1234", // replace this with your database password
    database: "inventory_db"
});

// Test connection
db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database!");
});

// insert sale record with items and update stock
app.post("/sell", async (req, res) => {
    const { customerId, customerName, customerPhone, salesDate, paymentMethod, totalAmount, items } = req.body;

    try {
        db.beginTransaction(err => {
            if (err) return res.status(500).json({ error: "Transaction start failed" });

            // Insert into sales
            db.query(
                "INSERT INTO customers (customer_id, customer_name, customer_phone, sales_date, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?)",
                [customerId, customerName, customerPhone, salesDate, paymentMethod, totalAmount],
                (err, saleResult) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error inserting sale:", err);
                            res.status(500).json({ error: "Failed to insert sale" });
                        });
                    }

                    console.log(saleResult.insertId);
                    const saleId = saleResult.insertId;

                    // Prepare sale_items insertion
                    const itemPromises = items.map(item => {
                        const { itemSku, quantity, price, discount, discountMode, amount } = item;

                        return new Promise((resolve, reject) => {
                            db.query(
                                "INSERT INTO sold_items (sale_id, item_sku, quantity, price, discount, discount_mode, amount) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                [saleId, itemSku, quantity, price, discount, discountMode, amount],
                                (err) => {
                                    if (err) return reject(err);
                                    // Update item stock
                                    db.query(
                                        "UPDATE items SET quantity = quantity - ? WHERE sku = ?",
                                        [quantity, itemSku],
                                        (err2) => (err2 ? reject(err2) : resolve())
                                    );
                                }
                            );
                        });
                    });

                    // Wait for all items to complete
                    Promise.all(itemPromises)
                        .then(() => {
                            db.commit(err => {
                                if (err) {
                                    return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
                                }
                                res.json({ message: "Sale recorded successfully", saleId });
                            });
                        })
                        .catch(err => {
                            db.rollback(() => {
                                console.error("Error inserting sale items:", err);
                                res.status(500).json({ error: "Failed to insert sale items" });
                            });
                        });
                }
            );
        });
    } catch (err) {
        console.error("Error saving sale:", err);
        res.status(500).json({ error: "Failed to save sale" });
    }
});

// ---------------- Generate PDF Bill ----------------
app.get('/generate-bill/:saleId', (req, res) => {
    const saleId = req.params.saleId;

    // Fetch sale + item data from database
    const sqlCustomers = `SELECT * FROM customers WHERE sale_id = ?`;
    const sqlItems = `
  SELECT si.*, i.item_name 
  FROM sold_items si
  JOIN items i ON si.item_sku = i.sku
  WHERE si.sale_id = ?
`;

    db.query(sqlCustomers, [saleId], (err, saleResult) => {
        if (err || saleResult.length === 0)
            return res.status(404).send("Sale not found");

        const sale = saleResult[0];

        db.query(sqlItems, [saleId], (err, itemsResult) => {
            if (err) return res.status(500).send("Error fetching sold items");

            // Create new PDF
            const doc = new PDFDocument({ margin: 50 });
            const filename = `Bill_${saleId}.pdf`;
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/pdf');
            doc.pipe(res);

            // Header
            doc.font('Helvetica-Bold').fontSize(16).text('Smart General Store', { align: 'center' });
            doc.fontSize(16).text('Receipt', { align: 'center' });
            doc.moveDown(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

            // Customer Details
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(12)
                .text(`Bill No: ${sale.sale_id}`)
                .text(`Date: ${new Date(sale.sales_date).toDateString()}`)
                .text(`Customer ID: ${sale.customer_id}`)
                .text(`Customer Name: ${sale.customer_name}`)
                .text(`Customer Phone: ${sale.customer_phone}`)
                .text(`Payment Method: ${sale.payment_method}`);
            doc.moveDown(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

            // --- Table Header ---
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').fontSize(12);
            let y2 = doc.y;
            doc.text('Items name', 60, y2);
            doc.text('Qty', 240, y2);
            doc.text('Price', 300, y2);
            doc.text('Discount', 380, y2);
            doc.text('Amount Rs.', 470, y2);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

            // --- Table Body ---
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(12);

            let y = doc.y;
            const rowHeight = 18;
            const pageHeight = doc.page.height - 100; // usable height

            itemsResult.forEach((item, i) => {
                // Check for page overflow
                if (y + rowHeight > pageHeight) {
                    doc.addPage();
                    y = 50;
                    // reprint table header
                    doc.font('Helvetica-Bold').fontSize(12);
                    doc.text('Items name', 60, y);
                    doc.text('Qty', 240, y);
                    doc.text('Price', 300, y);
                    doc.text('Discount', 380, y);
                    doc.text('Amount Rs.', 470, y);
                    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
                    y += 30;
                    doc.font('Helvetica').fontSize(12);
                }

                // Draw item row
                doc.text(item.item_name, 60, y);
                doc.text(item.quantity.toString(), 240, y);
                doc.text(item.price, 300, y);
                doc.text(`${item.discount}${item.discount_mode}`, 380, y);
                doc.text(item.amount, 470, y);
                y += rowHeight;
            });

            // --- Total Line ---
            doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
            doc.font('Helvetica-Bold').fontSize(12).text(`Total Rs. ${sale.total_amount}`, 455, doc.y + 15);

            // --- Footer ---
            doc.moveDown(1.5);
            doc.font('Helvetica-Bold').fontSize(12)
                .text('Thank you for your purchase!', 50, doc.y, { align: 'center' });

            doc.end();
        });
    });
});

// ---------------- Get Today's Total Sales ----------------
app.get('/today-sales', (req, res) => {
    const sql = `
        SELECT IFNULL(SUM(total_amount), 0) AS today_total
        FROM customers
        WHERE DATE(sales_date) = CURDATE()
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching today's sales:", err);
            return res.status(500).json({ error: "Database error" });
        }
        const todayTotal = result[0].today_total || 0;
        res.json({ todayTotal });
    });
});

// Get suppliers with low/zero stock items
app.get("/suppliers", (req, res) => {
    const sql = "SELECT DISTINCT supplier_name FROM items WHERE quantity <= 5";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        console.log(`Fetched ${results.length} suppliers with low/zero stock items`); // <- log
        res.json(results);
    });
});

// Get low/zero stock items for a supplier
app.get("/items/:supplier", (req, res) => {
    const sql = "SELECT item_name FROM items WHERE supplier_name = ? AND quantity <= 5";
    db.query(sql, [req.params.supplier], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        console.log(`Fetched ${results.length} low/zero stock items for supplier ${req.params.supplier}`); // <- log
        res.json(results);
    });
});

// Fetch one item by SKU ---------------------------------------------------------------------------------------
app.get("/item/:sku", (req, res) => {
    const sku = req.params.sku;
    const sql = "SELECT * FROM items WHERE sku = ?";
    db.query(sql, [sku], (err, results) => {
        if (err) {
            console.error("Error fetching item:", err);
            return res.status(500).send("Error fetching item");
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        const item = results[0];
        // Convert blob to base64 if exists
        const photo = item.item_photo
            ? `data:image/png;base64,${item.item_photo.toString("base64")}`
            : null;

        res.json({ ...item, item_photo: photo });
    });
});

// Update one item by SKU---------------------------------------------------------------------------------------
app.put("/update-item/:item_sku", upload.single("item_photo"), (req, res) => {
    const {
        sku,
        item_name,
        quantity,
        unit,
        category,
        purchase_price,
        selling_price,
        supplier_name,
        date_added,
        description
    } = req.body;

    const item_sku = req.params.item_sku;

    console.log("File received:", req.file?.originalname);
    console.log("Body received:", req.body);

    const imageData = req.file ? req.file.buffer : null;

    const sql = imageData
        ? `UPDATE items 
     SET sku=?, item_name=?, quantity=?, unit=?, category=?, purchase_price=?, selling_price=?,
         supplier_name=?, date_added=?, item_photo=?, description=? 
     WHERE sku=?`
        : `UPDATE items 
     SET sku=?, item_name=?, quantity=?, unit=?, category=?, purchase_price=?, selling_price=?,
         supplier_name=?, date_added=?, description=? 
     WHERE sku=?`;

    const params = imageData
        ? [sku, item_name, quantity, unit, category, purchase_price, selling_price, supplier_name, date_added, imageData, description, item_sku]
        : [sku, item_name, quantity, unit, category, purchase_price, selling_price, supplier_name, date_added, description, item_sku];
    ;
    db.query(
        sql,
        params,
        (err, result) => {
            if (err) {
                console.error("Error updating item:", err);
                return res.status(500).json({ message: "Error updating item" });
            }
            console.log("Item updated:", result.affectedRows);
            res.status(200).json({ message: "Item updated successfully!" });
        }
    );
});

// remove item by SKU -----------------------------------------------------------------------------------
app.delete("/delete-item/:sku", (req, res) => {
    const sku = req.params.sku;
    db.query("SET FOREIGN_KEY_CHECKS = 0;", (err) => {
        if (err) {
            console.error("Error disabling foreign key checks:", err);
            return res.status(500).json({ error: "Failed to disable foreign key checks" });
        }
        
        db.query("DELETE FROM items WHERE sku = ?", [sku], (err, result) => {
            if (err) {
                console.error("Delete error:", err);
                return res.status(500).json({ error: "Failed to delete item" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Item not found" });
            }

            console.log(`Deleted item with SKU: ${sku}`);
            res.json({ message: "Item deleted successfully", sku: sku });

            db.query("SET FOREIGN_KEY_CHECKS = 1;", (err) => {
                if (err) {
                    console.error("Error enabling foreign key checks:", err);
                    return res.status(500).json({ error: "Failed to enable foreign key checks" });
                }
            });
        });
    });
});

// Route to fetch items ------------------------------------------------------------------------------
app.get("/itemsload", (req, res) => {
    const sql = "SELECT sku, item_name, selling_price, quantity FROM items WHERE quantity != 0";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching items:", err);
            return res.status(500).send("Error fetching items");
        }

        // Convert image blobs to base64
        const items = results.map(item => ({
            sku: item.sku,
            item_name: item.item_name,
            selling_price: item.selling_price
        }));

        res.json(items);
    });
})

// Route to fetch items ------------------------------------------------------------------------------
app.get("/items", (req, res) => {
    const sql = "SELECT sku, item_name, quantity, unit, selling_price, item_photo FROM items";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching items:", err);
            return res.status(500).send("Error fetching items");
        }

        // Convert image blobs to base64
        const items = results.map(item => ({
            sku: item.sku,
            item_name: item.item_name,
            quantity: item.quantity,
            unit: item.unit,
            selling_price: item.selling_price,
            item_photo: item.item_photo
                ? `data:image/png;base64,${item.item_photo.toString("base64")}`
                : null
        }));

        res.json(items);
    });
});

// Route to insert item ----------------------------------------------------------------------------------------
app.post("/add-item", upload.single("item_photo"), (req, res) => {
    const {
        sku,
        item_name,
        quantity,
        unit,
        category,
        purchase_price,
        selling_price,
        supplier_name,
        date_added,
        description
    } = req.body;

    console.log("File received:", req.file?.originalname);
    console.log("Body received:", req.body);

    const imageData = req.file ? req.file.buffer : null;

    const sql = `
        INSERT INTO items
        (sku, item_name, quantity, unit, category, purchase_price, selling_price, supplier_name, date_added, item_photo, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [sku, item_name, quantity, unit, category, purchase_price, selling_price, supplier_name, date_added, imageData, description],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).json({ message: "Error saving item" });
            }
            console.log("Item saved:", result.affectedRows);
            res.status(200).json({ message: "Item saved successfully!" });
        }
    );
});

// Start server --------------------------------------------------------------------------------------------
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});