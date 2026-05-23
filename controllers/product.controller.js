import Product from "../models/product.model.js";
import cloudinary from "../utils/cloudinary.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // رفع كل الصور إلى Cloudinary
    const imageUrls = [];

    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      createdBy: req.user.id,
      images: imageUrls, 
    });

    res.json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Products


export const getProducts = async (req, res) => {
  try {
    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.user) {
      query.createdBy = req.query.user;
    }

    const products = await Product.find(query)
      .populate("createdBy", "name email")
      .populate("category", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("category", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;

    await product.save();

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const imageUrls = [];

    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    product.images = imageUrls;

    await product.save();

    res.json({ message: "Product images updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

