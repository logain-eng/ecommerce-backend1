import Category from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";


export const createCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const filePath = req.file.path.replace(/\\/g, "/");

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "categories",
    });

    const category = await Category.create({
      name,
      image: uploadResult.secure_url,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Category created",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // تحديث الاسم لو موجود
    if (req.body.name) {
      category.name = req.body.name;
    }

    // لو فيه صورة جديدة
    if (req.file) {
      // حذف الصورة القديمة من Cloudinary
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`categories/${publicId}`);

      // رفع الصورة الجديدة
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });

      category.image = result.secure_url;
    }

    await category.save();

    res.json({
      message: "Category updated",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // استخراج publicId من رابط الصورة
    const publicId = category.image.split("/").pop().split(".")[0];

    // حذف الصورة من Cloudinary
    await cloudinary.uploader.destroy(`categories/${publicId}`);

    // حذف الكاتيجوري من الداتا بيز
    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


