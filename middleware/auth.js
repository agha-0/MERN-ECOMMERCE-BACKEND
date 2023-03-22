const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.json({ message: "In Valid Token" })
    } else {
        const token = authHeader.split(' ')[1]
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = decode.id

        } catch (error) {
            res.json({ message: "Not Authorized to This Route" })
        }
        next()
    }

}

module.exports = authMiddleware