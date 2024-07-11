import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import generateOTP from '../utils/generateOTP.js';
import sendEmail from './email.service.js';
import Cart from '../models/cart.model.js';

export const AuthService = {
    signup: async (data) => {
        const { first_name, last_name, email, password } = data;

        // Validate required fields
        if (!first_name || !last_name || !email || !password) {
            throw new Error('All fields are required');
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // If user is verified, throw an error
            if (user.isVerified) {
                throw new Error('Email already registered and verified');
            }

            // If user is not verified, generate a new OTP and update the user
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.otp = await generateOTP();
            user.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
            user.password = await bcrypt.hash(password, 10); // Update the password in case it's changed

            await user.save(); // Save updated user data
        } else {
            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = await generateOTP();

            user = new User({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                otp,
                otpExpires: Date.now() + 3600000, // OTP expires in 1 hour
            });

            await user.save(); // Save new user
        }

        // Send the OTP to the user's email
        await sendEmail(email, 'Email Verification', `Your OTP is ${user.otp}`);

        return user;
    },

    verifyOTP: async (email, otp, guest_id) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Email not registered');
        }

        if (user.isVerified) {
            throw new Error('User already verified');
        }

        if (user.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        if (user.otpExpires < Date.now()) {
            throw new Error('OTP expired');
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude the password and potentially other sensitive fields from the response
        const { password, ...safeUserData } = user.toObject ? user.toObject() : user;

        // Check if the cart with the given guest_id exists
        const cart = await Cart.findOne({ guestId: guest_id });

        if (cart) {
            // Update the cart: set guest_id to null and associate with user_id
            cart.guestId = null;
            cart.userId = safeUserData._id;
            await cart.save();
        }

        // Return the token along with the user data, minus the password
        return { user: safeUserData, token };
    },

    login: async (email, password, guest_id) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Email not registered');
        }

        if (!user.isVerified) {
            await sendEmail(email, 'Email Verification', `Your OTP is ${otp}`);
            throw new Error('Please verify your email');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude the password and potentially other sensitive fields from the response
        const { password: storedPassword, ...safeUserData } = user.toObject ? user.toObject() : user;

        // Check if the cart with the given guest_id exists
        const cart = await Cart.findOne({ guestId: guest_id });

        // Check if the cart with the given safeUserData._id exists
        const userCart = await Cart.findOne({ userId: safeUserData._id });

        if (cart && !userCart) {
            // Update the cart: set guest_id to null and associate with user_id
            cart.guestId = null;
            cart.userId = safeUserData._id;
            await cart.save();
        }

        // Return the token along with the user data, minus the password
        return { token, user: safeUserData };

    },

    forgotPassword: async (email) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Email not registered');
        }

        const otp = await generateOTP();

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour

        await user.save();
        await sendEmail(email, 'Password Reset', `Your OTP is ${otp}`);

        return { message: 'OTP sent to your email' };
    },

    verifyResetPasswordOTP: async (email, otp) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Email not registered');
        }

        if (user.resetPasswordOtp !== otp) {
            throw new Error('Invalid OTP');
        }

        if (user.resetPasswordOtpExpires < Date.now()) {
            throw new Error('OTP expired');
        }

        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        user.isVerified = true;

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { user, token };
    },

    resetPassword: async (email, password) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Email not registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();

        return { message: 'Password reset successfully' };
    },
};
