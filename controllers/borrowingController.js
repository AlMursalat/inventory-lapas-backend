import db from "../config/db.js";
import QRCode from "qrcode";

// PINJAM BARANG + QR
export const borrowItem = async (req, res) => {
  try {
    const { product_id, borrower_id, purpose, quantity, borrow_date } = req.body;

    // CEK PRODUCT
    const product = await db.query(
      "SELECT * FROM products WHERE id=$1",
      [product_id]
    );

    if (!product.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.rows[0].stock < quantity) {
      return res.status(400).json({
        message: "Stock not enough",
      });
    }

    // INSERT BORROWING
    const result = await db.query(
      `INSERT INTO borrowings (product_id, borrower_id, purpose, quantity, borrow_date)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [product_id, borrower_id, purpose, quantity]
    );

    const borrowing = result.rows[0];

    // KURANGI STOK
    await db.query(
      `UPDATE products SET stock = stock - $1 WHERE id=$2`,
      [quantity, product_id]
    );

    // GENERATE QR
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const qrData = `${baseUrl}/return/${borrowing.id}`;
    const qrImage = await QRCode.toDataURL(qrData);

    res.status(201).json({
      message: "Borrow success",
      data: borrowing,
      qr: qrImage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// KEMBALIKAN BARANG (MANUAL)
export const returnItem = async (req, res) => {
  try {
    const { id, condition_return } = req.body;

    const data = await db.query(
      "SELECT * FROM borrowings WHERE id=$1",
      [id]
    );

    if (!data.rows.length) {
      return res.status(404).json({ message: "Not found" });
    }

    const item = data.rows[0];

    if (item.status === "returned") {
      return res.status(400).json({ message: "Already returned" });
    }

    // UPDATE STATUS
    await db.query(
      `UPDATE borrowings 
       SET status='returned', return_date=NOW(), condition_return=$1
       WHERE id=$2`,
      [condition_return || "baik", id]
    );

    // TAMBAH STOK
    await db.query(
      `UPDATE products SET stock = stock + $1 WHERE id=$2`,
      [item.quantity, item.product_id]
    );

    res.json({ message: "Return success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// RETURN VIA QR
export const returnByQR = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(
      "SELECT * FROM borrowings WHERE id=$1",
      [id]
    );

    if (!data.rows.length) {
      return res.send("Data tidak ditemukan");
    }

    const item = data.rows[0];

    if (item.status === "returned") {
      return res.send("Barang sudah dikembalikan");
    }

    // UPDATE STATUS
    await db.query(
      `UPDATE borrowings 
       SET status='returned', return_date=NOW(), condition_return='baik'
       WHERE id=$1`,
      [id]
    );

    // TAMBAH STOK
    await db.query(
      `UPDATE products SET stock = stock + $1 WHERE id=$2`,
      [item.quantity, item.product_id]
    );

    res.send(`
      <h2 style="font-family:sans-serif;text-align:center;margin-top:50px;">
        ✅ Barang berhasil dikembalikan
      </h2>
    `);
  } catch (err) {
    console.error(err);
    res.send("Terjadi kesalahan");
  }
};

// 🔥 DELETE BORROWING
export const deleteBorrowing = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(
      "SELECT * FROM borrowings WHERE id=$1",
      [id]
    );

    if (!data.rows.length) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const item = data.rows[0];

    // ❗ HANYA BOLEH HAPUS JIKA SUDAH DIKEMBALIKAN
    if (item.status !== "returned") {
      return res.status(400).json({
        message: "Tidak bisa hapus, barang masih dipinjam",
      });
    }

    await db.query(
      "DELETE FROM borrowings WHERE id=$1",
      [id]
    );

    res.json({ message: "Data berhasil dihapus" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getBorrowings = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, 
             p.name AS product_name,
             br.name AS borrower_name,
             br.phone
      FROM borrowings b
      JOIN products p ON b.product_id = p.id
      JOIN borrowers br ON b.borrower_id = br.id
      ORDER BY b.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};