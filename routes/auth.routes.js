import express from "express";
import { register, login, updateUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../validation/userValidation.js';
import upload  from '../middleware/upload.js';
import { createProduct } from "../controllers/product.controller.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put(
  '/update',
  protect,
  upload.single('image'),
  validate(updateUserSchema),
  updateUser
);


export default router;
