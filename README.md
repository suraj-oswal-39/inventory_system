# 📦 Mera Godaam – Inventory Management System

A web-based **Inventory Management System** designed for small and medium-sized stores to manage stock, billing, suppliers, and sales efficiently.

---

## 🚀 Features

* 📋 **Item Management**

  * Add, update, delete, and view items
  * Track quantity, category, prices, and supplier

* 🧾 **Billing System**

  * Create bills with multiple items
  * Apply discounts (cash / %)
  * Auto-calculate total amount
  * Generate **PDF bills**

* 👤 **Customer Management**

  * Store customer details (ID, name, phone)
  * Use during billing

* 🚚 **Supplier & Purchase Orders**

  * Track suppliers
  * Identify low-stock items
  * Create purchase orders for refilling stock

* 📊 **Sales Tracking**

  * View **today’s total sales**
  * Maintain transaction records

* 🔄 **Dynamic UI**

  * Add/remove item rows dynamically
  * SPA (Single Page Application)

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Libraries / Modules

* multer
* cors
* mysql2
* pdfkit

## ▶️ Setup Instructions

1. Install required tools:

   * Node.js
   * MySQL
   * Visual Studio Code with the live server extension

2. Clone the repository:

   ```
   git clone https://github.com/suraj-oswal-39/inventory_system.git
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Configure database:

   * Create MySQL database and tables based on 'require-tables.txt'
   * Update connection details in backend (/server/server.js)

5. Run the server on Visual Studio Code terminal:

   ```
   cd server; node server.js
   ```

6. Open in Visual Studio Code:

   ```
   Click on "Go Live" at the bottom bar in Visual Studio Code 
   ```
Note: for proper setup, read the 'about setup.txt' file
---

## 🧾 Database Tables

* `items` → stores product details
* `sales` → stores bill information
* `sold_items` → stores items sold in each sale
* `supplier` → supplier details
* `purchase_order` → order records

---

## 📌 How It Works

1. Add items to inventory
2. Go to billing page
3. Select items and enter quantity
4. Apply discount (optional)
5. Click **Sold**
6. System:

   * Saves sale data
   * Updates stock
   * Generates PDF bill
7. View updated **Today’s Sales**

---

## ⚠️ Limitations

* Runs on **local server only**
* No authentication system
* No multi-user support
* Limited analytics

---

## 🔮 Future Enhancements

* Barcode scanner integration
* User login system (Admin / Staff)
* Cloud database support
* Advanced reports & analytics
* Mobile application

---

## 🎓 Project Info

* **Project Name:** Mera Godaam – Inventory Management System
* **Course:** BBA (Computer Application)
* **Student:** Suraj Oswal
* **College:** Arihant College, Pune

---

## 📜 License

This project is for **educational purposes only**.
Modification allowed with proper credit.

---

## 🙌 Acknowledgements

* MDN Web Docs
* YouTube tutorials
* ChatGPT (for guidance and debugging)
