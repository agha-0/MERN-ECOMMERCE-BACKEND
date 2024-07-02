// services/productService.js

import Product from '../models/product.model.js';
export const ProductService = {
    // Add a new product
    add: async (data) => {
        try {
            const product = await Product.create(data);
            return product;
        } catch (error) {
            throw error;
        }
    },

    // Get all products
    getAll: async () => {
        try {
            const products = await Product.find().populate('category');
            return products;
        } catch (error) {
            throw error;
        }
    },

    // Get product by slug
    getBySlug: async (slug) => {
        try {
            const product = await Product.findOne({ slug }).populate('category');
            if (!product) throw new Error("Product not found.");
            return product;
        } catch (error) {
            throw error;
        }
    },

    // Update product by slug
    update: async (slug, data) => {
        try {
            const product = await Product.findOneAndUpdate({ slug }, data, { new: true, runValidators: true }).populate('category');
            if (!product) throw new Error("Failed to update product. Product not found or update failed.");
            return product;
        } catch (error) {
            throw error;
        }
    },

    // Delete product by slug
    delete: async (slug) => {
        try {
            const product = await Product.findOneAndDelete({ slug });
            if (!product) throw new Error("Failed to delete product. Product not found or delete operation failed.");
            return product;
        } catch (error) {
            throw error;
        }
    }
};
