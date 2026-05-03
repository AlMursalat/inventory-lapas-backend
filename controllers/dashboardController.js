import db from "../config/db.js";

// 📦 TOTAL PRODUCTS
export const getTotalProducts = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM products"
    );

    res.json({
      total_products: parseInt(result.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 TOTAL BORROWED (MASIH DIPINJAM)
export const getTotalBorrowed = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM borrowings WHERE status='borrowed'"
    );

    res.json({
      total_borrowed: parseInt(result.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📦 TOTAL AVAILABLE STOCK
export const getTotalStock = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT SUM(stock) FROM products"
    );

    res.json({
      total_stock: parseInt(result.rows[0].sum || 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👤 TOTAL BORROWERS
export const getTotalBorrowers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM borrowers"
    );

    res.json({
      total_borrowers: parseInt(result.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};