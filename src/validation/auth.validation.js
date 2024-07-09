import Joi from 'joi';

export const AuthValidation = {
    signup: Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    }),

    verifyOTP: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    forgotPassword: Joi.object({
        email: Joi.string().email().required(),
    }),

    verifyResetPasswordOTP: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
    }),

    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
};
