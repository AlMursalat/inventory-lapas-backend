import express from "express";
import {
  createBorrower,
  getBorrowers,
  updateBorrower,
  deleteBorrower,
} from "../controllers/borrowerController.js";

const router = express.Router();

router.post("/", createBorrower);
router.get("/", getBorrowers);
router.put("/:id", updateBorrower);
router.delete("/:id", deleteBorrower);

export default router;