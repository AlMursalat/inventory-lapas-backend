import db from "../config/db.js";

// CREATE
export const createBorrower = async (req, res) => {
  try {
    const { name, phone, institution } = req.body;

    const result = await db.query(
      `INSERT INTO borrowers (name, phone, institution)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, phone, institution]
    );

    res.status(201).json({
      message: "Borrower created",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getBorrowers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM borrowers ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateBorrower = async (req, res) => {
  try {
    const { name, phone, institution } = req.body;

    const result = await db.query(
      `UPDATE borrowers 
       SET name=$1, phone=$2, institution=$3
       WHERE id=$4
       RETURNING *`,
      [name, phone, institution, req.params.id]
    );

    res.json({
      message: "Borrower updated",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteBorrower = async (req, res) => {
  try {
    await db.query("DELETE FROM borrowers WHERE id=$1", [
      req.params.id,
    ]);

    res.json({ message: "Borrower deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};