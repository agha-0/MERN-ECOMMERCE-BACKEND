// controllers/categoryController.js

import { CategoryService } from '../services/category.service.js';

export const CategoryController = {
    // Add a new category
    add: async (req, res) => {
        try {
            const category = await CategoryService.add(req.body);
            return res.status(201).json({
                status: 201,
                message: "Category added successfully",
                data: category,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Get all categories
    getAll: async (req, res) => {
        try {
            const category = await CategoryService.getAll();
            if (!category) {
                return res.status(404).json({
                    status: 404,
                    message: "Category not found",
                });
            }
            return res.status(200).json({
                status: 200,
                data: category,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Get a category by ID
    getById: async (req, res) => {
        try {
            const category = await CategoryService.getById(req.params.id);
            if (!category) {
                return res.status(404).json({
                    status: 404,
                    message: "Category not found",
                });
            }
            return res.status(200).json({
                status: 200,
                data: category,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Update a category by ID
    update: async (req, res) => {
        try {
            const category = await CategoryService.update(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({
                    status: 404,
                    message: "Category not found or failed to update",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Category updated successfully",
                data: category,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    // Delete a category by ID
    delete: async (req, res) => {
        try {
            const category = await CategoryService.delete(req.params.id);
            if (!category) {
                return res.status(404).json({
                    status: 404,
                    message: "Category not found or failed to delete",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Category deleted successfully",
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },
};
