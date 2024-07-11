// import catchAsyncErrors from "./catchAsyncErrors.js"
// import ErrorHandler from "../utils/errorhandler.js"
// import jwt from "jsonwebtoken"
// import User from "../models/user.model.js"
// exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;

//   console.log(token);
//   if (!token) {
//     return next(new ErrorHandler("Please Login to access this resource", 401));
//   }
//   const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = await User.findById(decodedData.id);
//   next();
// });
// exports.authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `Role : ${req.user.role} is not allowed to access this resource`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };

// auth.middleware.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return next(); // No token provided, proceed without authentication
    }

    const token = authHeader.split(' ')[1];

    if (token === 'null') {
        return next(); // Token is explicitly set to 'null', proceed without authentication
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Assuming your JWT payload includes the user object with _id
        next();
    } catch (ex) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};



