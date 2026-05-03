import express from "express";
import {
  borrowItem,
  returnItem,
  returnByQR,
  getBorrowings,
  deleteBorrowing,
} from "../controllers/borrowingController.js";

const router = express.Router();

router.post("/borrow", borrowItem);
router.post("/return", returnItem);
router.get("/", getBorrowings);
router.get("/return/:id", returnByQR);
router.delete("/:id", deleteBorrowing);

export default router;