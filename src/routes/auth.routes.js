import express from 'express';
import multer from 'multer';

import { validate } from '../middlewares/validation.middleware.js';
import { AuthValidation } from '../validation/auth.validation.js';
import { AuthController } from '../controllers/auth.controller.js';

const authRouter = express.Router();
const upload = multer();

authRouter.post(
    '/login',
    upload.none(),
    validate(AuthValidation.login),
    AuthController.login
);

authRouter.post(
    '/signup',
    upload.none(),
    validate(AuthValidation.signup),
    AuthController.signup
);

authRouter.post(
    '/verify-otp',
    validate(AuthValidation.verifyOTP),
    AuthController.verifyOTP
);

authRouter.post(
    '/forgot-password',
    validate(AuthValidation.forgotPassword),
    AuthController.forgotPassword
);

authRouter.post(
    '/verify-reset-password-otp',
    validate(AuthValidation.verifyResetPasswordOTP),
    AuthController.verifyResetPasswordOTP
);

authRouter.post(
    '/reset-password',
    validate(AuthValidation.resetPassword),
    AuthController.resetPassword
);

export default authRouter;
