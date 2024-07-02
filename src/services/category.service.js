// services/categoryService.js

import Category from '../models/category.model.js'; // Adjust the path if necessary

export const CategoryService = {
    add: async (data) => {
        try {
            // Create a new category
            const category = await Category.create({
                name: data.name,
            });

            if (!category) throw new Error("Failed to create category. Please try again...");

            return category;
        } catch (error) {
            throw error;
        }
    },

    // Get all categories
    getAll: async () => {
        try {
            const category = await Category.find();
            return category;
        } catch (error) {
            throw error;
        }
    },

    // Get category by ID
    getById: async (id) => {
        try {
            const category = await Category.findById(id);
            if (!category) throw new Error("Category not found.");
            return category;
        } catch (error) {
            throw error;
        }
    },

    // Update category by ID
    update: async (id, data) => {
        try {
            const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
            if (!category) throw new Error("Failed to update category. Please try again...");
            return category;
        } catch (error) {
            throw error;
        }
    },

    // Delete category by ID
    delete: async (id) => {
        try {
            const category = await Category.findByIdAndDelete(id);
            if (!category) throw new Error("Failed to delete category. Please try again...");
            return category;
        } catch (error) {
            throw error;
        }
    }
};
