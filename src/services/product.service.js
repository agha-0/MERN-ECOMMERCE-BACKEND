// services/productService.js
import Product from '../models/product.model.js';

export const ProductService = {
    // Add a new product
    add: async (data) => {
        try {
            const product = await Product.create(data);
            const populatedProduct = await Product.findById(product._id).populate('category');
            return populatedProduct;
        } catch (error) {
            throw error;
        }
    },

    // Get all products with pagination
    getAllWithPagination: async ({ skip, limit }) => {
        try {
            let products = await Product.find()
                .populate('category')
                .skip(skip)
                .limit(limit)
                .exec();
            return products;
        } catch (error) {
            throw error;
        }
    },


    // Get all products
    getAll: async () => {
        try {
            let products = await Product.find()
                .populate('category')
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
