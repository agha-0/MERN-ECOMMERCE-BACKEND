// services/cart.service.js

import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const CartService = {
    getCart: async (userId, guestId) => {
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId }).populate('items.product');
        } else if (guestId) {
            cart = await Cart.findOne({ guestId }).populate('items.product');
        }

        if (!cart) {
            // cart = new Cart({ userId, guestId, items: [] });
            // await cart.save();
            cart = { userId, guestId, items: [] }
        }

        return cart;
    },

    addToCart: async (userId, guestId, productId, quantity = 1) => {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const name = product.name;
        const image = product.image;
        const price = product.price;
        const discountedPrice = product.discounted_price || null;
        const totalPrice = (discountedPrice || price) * quantity;

        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            cart = new Cart({ userId, guestId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].totalPrice += totalPrice;
        } else {
            cart.items.push({ product: productId, quantity, price, discountedPrice, totalPrice, name, image });
        }
        
        await cart.save();
        return cart;
    },

    updateCart: async (userId, guestId, productId, quantity) => {
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            const price = cart.items[itemIndex].price;
            const discountedPrice = cart.items[itemIndex].discountedPrice || null;
            cart.items[itemIndex].totalPrice = (discountedPrice || price) * quantity;

            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        } else {
            throw new Error('Product not in cart');
        }

        await cart.save();
        return cart;
    },

    removeFromCart: async (userId, guestId, productId) => {
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(item => !item.product.equals(productId));
        await cart.save();
        return cart;
    },

    clearCart: async (userId, guestId) => {
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = [];
        await cart.save();
        return cart;
    },
};
