import db from "./config/db.js";

async function testDB() {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Database Connected!");
    console.log(result.rows);
  } catch (err) {
    console.error(err);
  }
}

testDB();