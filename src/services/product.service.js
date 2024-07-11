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

    // Get all products with pagination, sorting, and text search
    getAllProducts: async ({ skip, limit, sort, search_text }) => {
        try {
            let pipeline = [];

            // Add text search if search_text is provided
            if (search_text) {
                pipeline.push({
                    $match: {
                        $or: [
                            { name: { $regex: search_text, $options: 'i' } },
                            // { description: { $regex: search_text, $options: 'i' } }
                        ]
                    }
                });
            }

            // Count filtered results
            pipeline.push({
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        {
                            $addFields: {
                                effective_price: {
                                    $cond: {
                                        if: { $gt: ["$discounted_price", 0] },
                                        then: "$discounted_price",
                                        else: "$price"
                                    }
                                }
                            }
                        },
                        ...(sort ? [{ $sort: { effective_price: sort === 'asc' ? 1 : -1 } }] : []),
                        ...(typeof skip === 'number' ? [{ $skip: skip }] : []),
                        ...(typeof limit === 'number' ? [{ $limit: limit }] : []),
                        {
                            $lookup: {
                                from: 'categories',
                                localField: 'category',
                                foreignField: '_id',
                                as: 'category'
                            }
                        },
                        { $unwind: '$category' }
                    ]
                }
            });

            // Execute the aggregation pipeline
            let result = await Product.aggregate(pipeline).exec();

            // Extract results and count
            const products = result[0].data;
            const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;

            return { products, total };
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
    },

    // get maximum 4 related products
    getRelatedProducts: async (categoryId, excludeProductId, limit = 4) => {
        try {
            const products = await Product.find({
                category: categoryId,
                _id: { $ne: excludeProductId }
            })
                .limit(limit)
                .populate('category');

            return products;
        } catch (error) {
            throw error;
        }
    },
};
