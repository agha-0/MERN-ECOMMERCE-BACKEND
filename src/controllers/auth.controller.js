import { AuthService } from '../services/auth.service.js';

export const AuthController = {
    signup: async (req, res) => {
        try {
            const user = await AuthService.signup(req.body);
            return res.status(201).json({
                status: 201,
                message: 'User created, verify your email',
                data: user,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const { email, otp, guest_id } = req.body;
            const { user, token } = await AuthService.verifyOTP(email, otp, guest_id);

            return res.status(200).json({
                status: 200,
                message: 'Email verified successfully',
                data: { user, token },
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password, guest_id } = req.body;
            const { token, user } = await AuthService.login(email, password, guest_id);
            return res.status(200).json({
                status: 200,
                message: 'Login successful',
                data: { token, user },
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const message = await AuthService.forgotPassword(email);
            return res.status(200).json({
                status: 200,
                message: message.message,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    verifyResetPasswordOTP: async (req, res) => {
        try {
            const { email, otp } = req.body;
            const { user, token } = await AuthService.verifyResetPasswordOTP(email, otp);
            return res.status(200).json({
                status: 200,
                message: 'OTP verified, you can now reset your password',
                data: { user, token },
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { email, password } = req.body;
            const message = await AuthService.resetPassword(email, password);
            return res.status(200).json({
                status: 200,
                message: message.message,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    },
};
