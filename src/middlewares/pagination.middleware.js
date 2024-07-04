// Middleware function for pagination
const paginate = (model) => async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit) || 10; // Number of items per page

        const startIndex = (page - 1) * limit; // Index of the first item in the current page

        // Ensure `model` is a valid Mongoose model instance
        const totalCount = await model.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // Calculate current last item number
        let currentLastItemNumber = startIndex + limit;
        if (currentLastItemNumber > totalCount) {
            currentLastItemNumber = totalCount;
        }

        // Add pagination data to the request object
        req.pagination = {
            totalCount,
            totalPages,
            currentPage: page,
            currentFirstItemNumber: startIndex + 1,
            currentLastItemNumber,
            limit
        };

        next(); // Move to the next middleware
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

export default paginate;
