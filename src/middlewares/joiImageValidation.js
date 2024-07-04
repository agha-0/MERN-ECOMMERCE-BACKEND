// Middleware for request validation
export function validateRequest(req, res, next) {
    if (!req.body.image && req.file) {
        req.body.image = req.file;
        next();
    } else {
        req.body.image = req.body.image
        next();
    }
}