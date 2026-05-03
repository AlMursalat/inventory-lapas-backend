import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import borrowerRoutes from "./routes/borrowerRoutes.js";
import borrowingRoutes from "./routes/borrowingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

/* =========================
   CORS FIX FINAL (PRODUCTION SAFE)
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://inventory-lapas-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

// preflight wajib aman
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/products", productRoutes);
app.use("/api/borrowers", borrowerRoutes);
app.use("/api/borrowings", borrowingRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ message: "API Running OK" });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});