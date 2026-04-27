import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    vendor: req.user.id,
  });
  res.json(product);
};

export const getVendorProducts = async (req, res) => {
  const products = await Product.find({ vendor: req.params.vendorId });
  res.json(products);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};