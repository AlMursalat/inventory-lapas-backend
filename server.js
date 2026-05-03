import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import productRoutes from "./routes/productRoutes.js";
import borrowerRoutes from "./routes/borrowerRoutes.js";
import borrowingRoutes from "./routes/borrowingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

/* =========================
   TRUST PROXY (PENTING UNTUK RENDER)
========================= */
app.set("trust proxy", 1);

/* =========================
   SECURITY
========================= */
app.use(helmet());

/* =========================
   CORS (PRODUCTION READY)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://inventory-lapas-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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
   ROOT TEST
========================= */
app.get("/", (req, res) => {
  res.json({ message: "API Running OK" });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});