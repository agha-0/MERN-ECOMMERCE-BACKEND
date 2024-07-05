// controllers/productController.js
import { CategoryService } from '../services/category.service.js';
import { ProductService } from '../services/product.service.js';
import paginate from '../middlewares/pagination.middleware.js';
import ProductModel from '../models/product.model.js';

export const ProductController = {
    // Add a new product
    add: async (req, res) => {
        if (req.body.cloudinaryUrl) {
            try {
                // Perform the file upload
                // const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
                var model = {
                    ...req.body,
                    discounted_price: (req.body.discounted_price || req.body.discounted_price === 0) ? req.body.discounted_price : null,
                    image: req.body.cloudinaryUrl !== "" ? req.body.cloudinaryUrl : ""
                }
                delete model.cloudinaryUrl

                // If category is provided, check if it exists
                if (req.body.category) {
                    await CategoryService.getById(req.body.category);
                }

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
        } else {
            return res.status(400).send(error.details[0].message);
        }
    },

    // Get all products
    getAll: [
        paginate(ProductModel), // Use the pagination middleware
        async (req, res) => {
            try {
                const sortParam = req.query.sort || null;
                const searchText = req.query.search_text || null;
                let sortOrder = null;

                if (sortParam) {
                    sortOrder = sortParam;
                }

                const limit = req.query.page ? req.pagination.limit : null;
                const skip = req.query.page ? req.pagination.currentPage ? (req.pagination.currentPage - 1) * limit : null : null;

                // Fetch products with optional pagination, sorting, and search
                let { products, total } = await ProductService.getAllProducts({
                    skip: skip,
                    limit: limit,
                    sort: sortOrder,
                    search_text: searchText // Pass the search text
                });

                if (!products || products.length === 0) {
                    return res.status(200).json({
                        status: 200,
                        data: [],
                        message: "No products found",
                    });
                }

                // Update pagination data
                req.pagination.totalItems = total;
                req.pagination.totalPages = Math.ceil(total / limit);

                return res.status(200).json({
                    status: 200,
                    data: products,
                    pagination: req.pagination,
                });
            } catch (error) {
                return res.status(400).json({
                    status: 400,
                    message: error.message,
                });
            }
        },
    ],

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
            const { slug } = req.params;
            const data = req.body;

            // Check if the quantity is provided and add it to the existing quantity
            if (data.quantity !== undefined) {
                const existingProduct = await ProductService.getBySlug(slug);

                if (existingProduct) {
                    data.quantity = existingProduct.quantity + data.quantity;
                }
            }

            // If category is provided, check if it exists
            if (data.category) {
                await CategoryService.getById(data.category);
            }

            // Update the product with the new data
            const product = await ProductService.update(slug, data);

            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: "Product not found or failed to update.",
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
            const product = await ProductService.delete(req.params.id);
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
