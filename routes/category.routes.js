
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";



const router = express.Router();

router.post("/", protect, upload.single("image"), createCategory);
router.get("/:id", getCategory);
router.get("/", getAllCategories);
router.put("/:id", protect, admin, upload.single("image"), updateCategory);
router.delete("/:id", protect, admin, deleteCategory);



export default router;
