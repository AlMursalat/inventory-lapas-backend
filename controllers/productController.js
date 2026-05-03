import db from "../config/db.js";
import QRCode from "qrcode";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, category, stock, location, condition } = req.body;

    const result = await db.query(
      `INSERT INTO products (name, category, stock, location, condition)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, category, stock, location, condition]
    );

    const product = result.rows[0];

    // generate QR
    const qr = await QRCode.toDataURL(`PRODUCT:${product.id}`);

    await db.query(
      `UPDATE products SET qr_code=$1 WHERE id=$2`,
      [qr, product.id]
    );

    res.status(201).json({
      message: "Product created",
      data: { ...product, qr_code: qr },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getProducts = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
export const getProductById = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM products WHERE id=$1",
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const { name, category, stock, location, condition } = req.body;

    const result = await db.query(
      `UPDATE products 
       SET name=$1, category=$2, stock=$3, location=$4, condition=$5, updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [name, category, stock, location, condition, req.params.id]
    );

    res.json({
      message: "Product updated",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id=$1", [
      req.params.id,
    ]);

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};