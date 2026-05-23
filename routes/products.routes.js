import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateProductImage,
  deleteProduct
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create product
router.post("/", protect, admin, upload.array("images", 5), createProduct);


// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProduct);

// Update product data
router.put("/:id", protect, admin, updateProduct);

// Update product image
router.put("/:id/image", protect, admin, upload.array("images", 5), updateProductImage);

// Delete product
router.delete("/:id", protect, admin, deleteProduct);

export default router;

