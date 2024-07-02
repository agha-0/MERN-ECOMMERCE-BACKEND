// controllers/productController.js
import { ProductService } from '../services/product.service.js';

export const ProductController = {
    // Add a new product
    add: async (req, res) => {
        try {
            console.log(req.file,"req.file")
            // Perform the file upload
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            var model = {
                ...req.body,
                discounted_price: (req.body.discounted_price || req.body.discounted_price === 0) ? req.body.discounted_price : null,
                image: path !== "" ? "/" + path : ""
            }
            console.log(model,"model")
            const product = await ProductService.add(model);
            return res.status(201).json({
                status: 201,
                message: "Product added successfully",
                data: product,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Get all products
    getAll: async (req, res) => {
        try {
            const products = await ProductService.getAll();
            if (!products || products.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "No products found",
                });
            }
            return res.status(200).json({
                status: 200,
                data: products,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Get a product by slug
    getBySlug: async (req, res) => {
        try {
            const validationResult = ProductValidation.getBySlug.validate(req.params);
            if (validationResult.error) {
                return res.status(400).json({
                    status: 400,
                    message: validationResult.error.details[0].message,
                });
            }

            const product = await ProductService.getBySlug(req.params.slug);
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: "Product not found",
                });
            }
            return res.status(200).json({
                status: 200,
                data: product,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Update a product by slug
    update: async (req, res) => {
        try {
            const product = await ProductService.update(req.params.slug, req.body);
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: "Product not found or failed to update",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Product updated successfully",
                data: product,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Delete a product by slug
    delete: async (req, res) => {
        try {
            const validationResult = ProductValidation.delete.validate(req.params);
            if (validationResult.error) {
                return res.status(400).json({
                    status: 400,
                    message: validationResult.error.details[0].message,
                });
            }

            const product = await ProductService.delete(req.params.slug);
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: "Product not found or failed to delete",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Product deleted successfully",
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },
};
