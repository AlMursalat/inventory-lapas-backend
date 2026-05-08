import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import borrowerRoutes from "./routes/borrowerRoutes.js";
import borrowingRoutes from "./routes/borrowingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

/* =========================
   CORS CONFIG (LOCAL + PRODUCTION READY)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://inventory-lapas-frontend.vercel.app"
];

// kalau mau LAN (HP / device lain), aktifkan IP lokal kamu di sini
// contoh: "http://192.168.1.9:5173"

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman / mobile apps (no origin)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes("192.168.")
      ) {
        return callback(null, true);
      }

      return callback(null, true); // aman untuk development (tidak strict block)
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

/* =========================
   HANDLE PREFLIGHT REQUEST
========================= */
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/borrowers", borrowerRoutes);
app.use("/api/borrowings", borrowingRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.json({
    message: "API Running OK",
    status: "success"
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});