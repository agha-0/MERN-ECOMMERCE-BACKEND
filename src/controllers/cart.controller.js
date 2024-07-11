// controllers/cartController.js

import { CartService } from '../services/cart.service.js';
import jwt from 'jsonwebtoken';

export const CartController = {
    getCart: async (req, res) => {
        try {
            const { guest_id } = req.query;
            let userId = null;
            // Check if token is provided in the headers
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ') && !guest_id) {
                const token = authHeader.split(' ')[1];
                try {
                    // Verify the token and extract user ID
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userId = decoded.id;
                } catch (error) {
                    return res.status(401).json({ message: 'Invalid token', status: 401 });
                }
            } else if (req.user) {
                userId = req.user._id;
            }

            const cart = await CartService.getCart(userId, guest_id);
            return res.status(200).json({ status: 200, data: cart });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    addToCart: async (req, res) => {
        try {
            const { guestId, productId, quantity } = req.body;
            let userId = null;

            // Check if token is provided in the headers
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ') && !guestId) {
                const token = authHeader.split(' ')[1];
                try {
                    // Verify the token and extract user ID
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userId = decoded.id;
                } catch (error) {
                    return res.status(401).json({ message: 'Invalid token', status: 401 });
                }
            } else if (req.user) {
                userId = req.user._id;
            }

            const cart = await CartService.addToCart(userId, guestId, productId, quantity);

            const completeCart = await CartService.getCart(userId, guestId);
            res.status(200).json({ status: 200, data: completeCart, message: "Product added to cart!"  });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateCart: async (req, res) => {
        try {
            const { guestId, productId, quantity } = req.body;
            let userId = null;

            // Check if token is provided in the headers
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ') && !guestId) {
                const token = authHeader.split(' ')[1];
                try {
                    // Verify the token and extract user ID
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userId = decoded.id;
                } catch (error) {
                    return res.status(401).json({ message: 'Invalid token', status: 401 });
                }
            } else if (req.user) {
                userId = req.user._id;
            }

            const cart = await CartService.updateCart(userId, guestId, productId, quantity);

            const completeCart = await CartService.getCart(userId, guestId);
            res.status(200).json({ status: 200, data: completeCart });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    removeFromCart: async (req, res) => {
        try {
            const { guestId, productId } = req.body;
            let userId = null;

            // Check if token is provided in the headers
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ') && !guestId) {
                const token = authHeader.split(' ')[1];
                try {
                    // Verify the token and extract user ID
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userId = decoded.id;
                } catch (error) {
                    return res.status(401).json({ message: 'Invalid token', status: 401 });
                }
            } else if (req.user) {
                userId = req.user._id;
            }

            const cart = await CartService.removeFromCart(userId, guestId, productId);

            const completeCart = await CartService.getCart(userId, guestId);
            res.status(200).json({ status: 200, data: completeCart });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    clearCart: async (req, res) => {
        try {
            const { guestId } = req.body;
            let userId = null;

            // Check if token is provided in the headers
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ') && !guestId) {
                const token = authHeader.split(' ')[1];
                try {
                    // Verify the token and extract user ID
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userId = decoded.id;
                } catch (error) {
                    return res.status(401).json({ message: 'Invalid token', status: 401 });
                }
            } else if (req.user) {
                userId = req.user._id;
            }

            const cart = await CartService.clearCart(userId, guestId);
            res.status(200).json({ status: 200, data: cart });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};
