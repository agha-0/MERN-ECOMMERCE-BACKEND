// services/productService.js
import Product from '../models/product.model.js';

export const ProductService = {
    // Add a new product
    add: async (data) => {
        try {
            const product = await Product.create(data);
            await product.populate('category').execPopulate();
            return product;
        } catch (error) {
            throw error;
        }
    },

    // Get all products
    getAll: async ({ skip, limit }) => {
        try {
            const products = await Product.find()
                .populate('category')
                .skip(skip)
                .limit(limit)
                .exec();
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
            const product = await Product.findOneAndUpdate(
                { slug },
                { $set: data },
                { new: true, runValidators: true }
            ).populate('category');
            if (!product) {
                throw new Error("Product not found or update failed.");
            }
            return product;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new Error(`Validation failed: ${error.message}`);
            }
            // Handle other error types as needed
            throw new Error(`Update failed: ${error.message}`);
        }
    },


    // Delete product by id
    delete: async (id) => {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) throw new Error("Failed to delete product. Product not found or delete operation failed.");
            return product;
        } catch (error) {
            throw error;
        }
    }
};
