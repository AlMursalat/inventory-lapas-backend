import express from "express";
import {
  getTotalProducts,
  getTotalBorrowed,
  getTotalStock,
  getTotalBorrowers,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/products", getTotalProducts);
router.get("/borrowed", getTotalBorrowed);
router.get("/stock", getTotalStock);
router.get("/borrowers", getTotalBorrowers);

export default router;